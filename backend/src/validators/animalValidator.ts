import Joi from 'joi';
import animalData from '../animalData.json'; 

const validTypes = animalData.types;
const validBreeds = Object.values(animalData.breeds).flat();
const validDiets = Object.values(animalData.diets).flat();
const validChronicDiseases = Object.values(animalData.chronicDiseases).flat();
const validAllergies = Object.values(animalData.allergies).flat();

export const animalSchema = Joi.object({
  type: Joi.string().valid(...validTypes).required(), 
  breed: Joi.string().valid(...validBreeds).required(), 
  name: Joi.string().required(),
  birthDate: Joi.date().iso().required(),
  diet: Joi.string().valid(...validDiets).optional(), 
  chronicDiseases: Joi.array().items(Joi.string().valid(...validChronicDiseases)).optional(),
  allergies: Joi.array().items(Joi.string().valid(...validAllergies)).optional(),
});