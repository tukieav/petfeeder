import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal } from '../controllers/animalController';

const router : any = express.Router();

router.post('/', isAuthenticated, createAnimal);
router.get('/', isAuthenticated, getAnimals);
router.get('/:id', isAuthenticated, getAnimalById);
router.put('/:id', isAuthenticated, updateAnimal);
router.delete('/:id', isAuthenticated, deleteAnimal);

export default router;