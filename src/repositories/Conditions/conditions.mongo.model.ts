import { Schema, model } from 'mongoose';
import { Condition } from '../../entities/condition';

const ConditionsSchema = new Schema<Condition>({
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

ConditionsSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__V;
    delete returnedObject._id;
  },
});

export const ConditionModel = model(
  'Condition',
  ConditionsSchema,
  'conditions'
);
