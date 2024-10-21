import { Request, Response, NextFunction } from 'express';
import Animal from '../models/Animal';

// Tworzenie nowego zwierzęcia
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

    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
};

// Pobieranie wszystkich zwierząt
export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await Animal.find({ userId: req.user?.userId });
      res.status(200).json({ data: animals });
    } catch (error) {
      next(error);
    }
  };

// Pobieranie zwierzęcia po ID
export const getAnimalById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const animal = await Animal.findById(id);
    console.log('Animal found in database:', animal);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
    return res.status(404).json({ message: 'Animal not found or unauthorized' });
    }
    res.status(200).json({ data: animal });
  } catch (error) {
    next(error);
  }
};

// Aktualizacja zwierzęcia
export const updateAnimal = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { type, breed, name, birthDate, diet, chronicDiseases } = req.body;

  try {
    const animal = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found or unauthorized' });
    }

    // Aktualizacja danych zwierzęcia
    Object.assign(animal, { type, breed, name, birthDate, diet, chronicDiseases });
    await animal.save();

    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
};

// Usuwanie zwierzęcia
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