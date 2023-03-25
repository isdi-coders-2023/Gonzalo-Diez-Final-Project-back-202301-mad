import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, password, cluster, dbName } = config;

export const dbConnect = () => {
  // Const uri =
  //   'mongodb+srv://gonzu:root@cluster0.390ucxn.mongodb.net/?retryWrites=true&w=majority';

  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
