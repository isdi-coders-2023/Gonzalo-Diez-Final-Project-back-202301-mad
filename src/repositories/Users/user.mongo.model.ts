import { Schema, model } from 'mongoose';
import { User } from '../../entities/user';

const userSchema = new Schema<User>({
  age: {
    type: Number,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
    unique: false,
  },
  profilePic: {
    type: String,
    unique: false,
  },
  nickName: {
    type: String,
    required: false,
    unique: true,
  },
  timeWithout: {
    type: Date,
    required: false,
    unique: false,
  },
  addictions: [
    {
      type: Schema.Types.ObjectId,
      default: [],
      ref: 'Addictions',
      required: false,
    },
  ],
  conditions: [
    {
      type: Schema.Types.ObjectId,
      default: [],
      ref: 'Conditions',
      required: false,
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
