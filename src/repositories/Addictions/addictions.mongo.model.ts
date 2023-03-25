import { Schema, model } from 'mongoose';
import { Addiction } from '../../entities/addiction';

const AddictionSchema = new Schema<Addiction>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  },
  img: {
    type: String,
  },
});

AddictionSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const AddictionModel = model('Addiction', AddictionSchema, 'addictions');
