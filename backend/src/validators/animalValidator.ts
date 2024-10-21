import Joi from 'joi';

export const animalSchema = Joi.object({
  type: Joi.string().required(),
  breed: Joi.string().required(),
  name: Joi.string().required(),
  birthDate: Joi.date().iso().required(),
  diet: Joi.string().optional(),
  chronicDiseases: Joi.string().optional(),
});