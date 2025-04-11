import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  education: { type: String, required: true },
  languages: { type: [String], required: true },
  pricePerSession: { type: Number, required: true },
  availability: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Therapist = mongoose.model('Therapist', therapistSchema);
export default Therapist;