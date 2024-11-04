import mongoose from 'mongoose';
const { Schema } = mongoose;

const dietSchema = new Schema({
  animalId: { type: Schema.Types.ObjectId, required: true, ref: 'Animal' },
  dietPlan: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Diet', dietSchema);
