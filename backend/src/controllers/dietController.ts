import { Request, Response, NextFunction } from 'express';
import Animal from '../models/Animal';
import Diet from '../models/Diet';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDiet = async (req: Request, res: Response, next: NextFunction) => {
  const { animalId } = req.params;

  try {
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const messages = [
      { role: 'system', content: 'You are a helpful assistant that provides detailed diet plans in structured JSON format.' },
      { 
        role: 'user', 
        content: `
          Please generate a structured JSON diet plan for the following animal. Ensure each meal's "steps_to_do" field is a list of preparation steps with detailed instructions, including ingredient quantities if applicable.
          - Type: ${animal.type}
          - Breed: ${animal.breed}
          - Name: ${animal.name}
          - Birth Date: ${animal.birthDate}
          - Chronic Diseases: ${animal.chronicDiseases}

          Structure:
          {
            "morning": {
              "name_of_food": "String",
              "steps_to_do": ["Step 1", "Step 2", "..."],
              "calories": "String",
              "macro": { "protein": "String", "fat": "String", "fiber": "String" },
              "micro": { "AdditionalNutrient": "String" }
            },
            "afternoon": { /* Similar structure */ },
            "evening": { /* Similar structure */ }
          }
        `
      }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages as any,
      functions: [
        {
          name: "generate_diet_plan",
          description: "Generates a diet plan for animals in structured JSON format",
          parameters: {
            type: "object",
            properties: {
              morning: {
                type: "object",
                properties: {
                  name_of_food: { type: "string" },
                  steps_to_do: { 
                    type: "array",
                    items: { type: "string" }
                  },
                  calories: { type: "string" },
                  macro: {
                    type: "object",
                    properties: {
                      protein: { type: "string" },
                      fat: { type: "string" },
                      fiber: { type: "string" }
                    }
                  },
                  micro: {
                    type: "object",
                    additionalProperties: { type: "string" } 
                  }
                }
              },
              afternoon: { /* Same structure as in "morning" */ },
              evening: { /* Same structure as in "morning" */ }
            }
          },
        }
      ],
      function_call: { name: "generate_diet_plan" },
      max_tokens: 1000,
    });

    const argumentsContent = response.choices[0].message?.function_call?.arguments;

    let dietPlan;
    try {
      dietPlan = JSON.parse(argumentsContent || '{}');
      console.log("Parsed diet plan:", dietPlan);
    } catch (parseError) {
      console.error('Error parsing JSON from function_call.arguments:', parseError);
      return res.status(500).json({ message: 'Failed to parse diet plan JSON from AI response' });
    }

    const newDiet = new Diet({
      animalId: animal._id,
      dietPlan,
    });
    await newDiet.save();

    res.status(201).json({ message: 'Diet generated successfully', diet: newDiet });
  } catch (error) {
    console.error('Error generating diet:', error);
    next(error);
  }
};

export const getLastDiet = async (req: Request, res: Response, next: NextFunction) => {
  const { animalId } = req.params;

  try {
    const lastDiet = await Diet.findOne({ animalId }).sort({ createdAt: -1 });
    if (!lastDiet) {
      return res.status(404).json({ message: 'No diet found for this animal' });
    }
    res.status(200).json({ dietPlan: lastDiet.dietPlan });
  } catch (error) {
    next(error);
  }
};
