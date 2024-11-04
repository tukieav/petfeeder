import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  name: { type: String, required: true },
  birthDate: { type: String, required: true },
  diet: { type: String, required: false }, 
  chronicDiseases: { type: [String], required: false },
  allergies: { type: [String], required: false }
});

export default mongoose.model('Animal', animalSchema);