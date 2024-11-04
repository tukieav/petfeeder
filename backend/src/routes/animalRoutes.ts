import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal } from '../controllers/animalController';
import { generateDiet, getLastDiet } from '../controllers/dietController';
import csrf from 'csurf';



const router : any = express.Router();
const csrfProtection = csrf({ cookie: true });

router.post('/', isAuthenticated, csrfProtection, createAnimal);
router.put('/:id', isAuthenticated, csrfProtection, updateAnimal);
router.delete('/:id', isAuthenticated, csrfProtection, deleteAnimal);
router.post('/:animalId/generate-diet', isAuthenticated, csrfProtection, generateDiet);
router.get('/:animalId/diet', isAuthenticated, csrfProtection, getLastDiet); 

router.get('/', isAuthenticated, getAnimals);
router.get('/:id', isAuthenticated, getAnimalById);

export default router;