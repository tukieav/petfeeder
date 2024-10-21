import { Request, Response } from 'express';
import Animal from '../models/Animal';

export const createAnimal = async (req: Request, res: Response) => {
  const { type, breed, name, birthDate, diet, chronicDiseases } = req.body;
  const userId = req.user?.userId;

  try {
    const animal = new Animal({ userId, type, breed, name, birthDate, diet, chronicDiseases });
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating animal', error });
  }
};

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const animals = await Animal.find({ userId: req.user?.userId });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animals', error });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animal', error });
  }
};
export const updateAnimal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, breed, name, birthDate, diet, chronicDiseases } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    Object.assign(animal, { type, breed, name, birthDate, diet, chronicDiseases });
    await animal.save();
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating animal', error });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    await Animal.findByIdAndDelete(id);
    res.status(200).json({ message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting animal', error });
  }
};