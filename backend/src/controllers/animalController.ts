import { Request, Response } from 'express';
import Animal from '../models/Animal';

// Tworzenie nowego zwierzęcia
export const createAnimal : any = async (req: Request, res: Response) => {
  const { type, breed, name, birthDate, diet, chronicDiseases } : any = req.body;
  const userId : any = req.user?.userId;

  try {
    const animal : any = new Animal({
      userId,
      type,
      breed,
      name,
      birthDate,
      diet,
      chronicDiseases,
    });

    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating animal', error });
  }
};

// Pobieranie listy wszystkich zwierząt
export const getAnimals : any = async (req: Request, res: Response) => {
  try {
    const animals : any = await Animal.find({ userId: req.user?.userId });
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animals', error });
  }
};

// Pobieranie szczegółów zwierzęcia po ID
export const getAnimalById : any = async (req: Request, res: Response) => {
  const { id } : any = req.params;

  try {
    const animal : any = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animal', error });
  }
};

// Aktualizacja zwierzęcia po ID
export const updateAnimal : any = async (req: Request, res: Response) => {
  const { id } : any = req.params;
  const { type, breed, name, birthDate, diet, chronicDiseases } : any = req.body;

  try {
    const animal : any = await Animal.findById(id);
    if (!animal || animal.userId.toString() !== req.user?.userId) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    animal.type = type;
    animal.breed = breed;
    animal.name = name;
    animal.birthDate = birthDate;
    animal.diet = diet;
    animal.chronicDiseases = chronicDiseases;

    await animal.save();
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating animal', error });
  }
};

export const deleteAnimal : any = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const animal : any = await Animal.findById(id);
      if (!animal || animal.userId.toString() !== req.user?.userId) {
        return res.status(404).json({ message: 'Animal not found' });
      }
  
      // Zamiast animal.remove(), użyj deleteOne() lub findByIdAndDelete
      await Animal.findByIdAndDelete(id); // Usuwa zwierzę bezpośrednio z bazy danych
  
      res.status(200).json({ message: 'Animal deleted' });
    } catch (error) {
      console.error('Error deleting animal:', error);
      res.status(500).json({ message: 'Error deleting animal', error });
    }
  };