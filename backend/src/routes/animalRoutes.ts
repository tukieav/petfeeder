import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal } from '../controllers/animalController';
import csrf from 'csurf';



const router : any = express.Router();
const csrfProtection = csrf({ cookie: true });

router.post('/', isAuthenticated, csrfProtection, createAnimal);
router.put('/:id', isAuthenticated, csrfProtection, updateAnimal);
router.delete('/:id', isAuthenticated, csrfProtection, deleteAnimal);

router.get('/', isAuthenticated, getAnimals);
router.get('/:id', isAuthenticated, getAnimalById);

export default router;