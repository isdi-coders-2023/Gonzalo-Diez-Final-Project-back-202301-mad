import { Schema, model } from 'mongoose';
import { User } from '../../entities/user';

const userSchema = new Schema<User>({
  age: {
    type: Number,
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
    unique: false,
  },
  profilePic: {
    type: String,
    unique: false,
  },
  nickName: {
    type: String,
    unique: false,
  },
  timeWithout: {
    type: String,
    unique: false,
  },
  addictions: [
    {
      addictionId: {
        type: Schema.Types.ObjectId,
        ref: 'Addiction',
      },
      timeConsuming: {
        type: Date,
        required: true,
      },
      cause: {
        type: String,
        required: true,
      },
    },
  ],
  conditions: [
    {
      Condition: {
        type: Schema.Types.ObjectId,
        ref: 'Condition',
      },
      timeConsuming: {
        type: Date,
        required: true,
      },
      cause: {
        type: String,
        required: true,
      },
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
