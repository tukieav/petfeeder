import { Request, Response, NextFunction } from 'express';
import Animal from '../models/Animal';

export const createAnimal = async (req: Request, res: Response, next: NextFunction) => {
  const { type, breed, name, birthDate, diet, chronicDiseases } = req.body;

  try {
    const newAnimal = new Animal({
      userId: req.user?.userId,
      type,
      breed,
      name,
      birthDate,
      diet,
      chronicDiseases,
    });

    console.log('Animal to be saved:', newAnimal);

    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
};

export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await Animal.find({ userId: req.user?.userId });
      res.status(200).json({ data: animals });
    } catch (error) {
      console.error('Error saving animal:', error); 
      next(error);
    }
  };

export const getAnimalById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
    return res.status(404).json({ message: 'Animal not found or unauthorized' });
    }
    res.status(200).json({ data: animal });
  } catch (error) {
    next(error);
  }
};

export const updateAnimal = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { type, breed, name, birthDate, diet, chronicDiseases } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found or unauthorized' });
    }
    Object.assign(animal, { type, breed, name, birthDate, diet, chronicDiseases });
    await animal.save();

    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
};

export const deleteAnimal = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found or unauthorized' });
    }

    await animal.deleteOne();
    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (error) {
    next(error);
  }
};