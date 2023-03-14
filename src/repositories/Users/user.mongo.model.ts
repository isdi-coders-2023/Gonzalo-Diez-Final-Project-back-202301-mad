import { Schema, model } from 'mongoose';
import { User } from '../../entities/user';

const userSchema = new Schema<User>({
  Age: {
    type: Number,
    required: true,
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
  Name: {
    type: String,
    required: true,
    unique: false,
  },
  profilePic: {
    type: String,
    unique: false,
  },
  NickName: {
    type: String,
    required: true,
    unique: true,
  },
  timeWithout: {
    type: Date,
    required: false,
    unique: false,
  },
  Addictions: {
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'Addictions',
  },
  Conditions: {
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'Conditions',
  },
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
