import { UserCondition } from './condition';
import { UserAddiction } from './addiction';

export type States = 'Happy' | 'Sad' | 'Angry' | 'Excited' | 'Calm';

export type User = {
  id: string;
  age: number;
  email: string;
  password: string;
  name: string;
  profilePic: string;
  nickName: string | number;
  timeWithout?: Date;
  addictions: UserAddiction[];
  conditions: UserCondition[];
};
