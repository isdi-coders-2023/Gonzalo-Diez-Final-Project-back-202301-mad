import { Causes } from './condition';
import { User } from './user';

export type Addiction = {
  id: string;
  name: string;
  causes: Causes;
};

export type UserAddiction = {
  id: string;
  addiction: Addiction;
  timeConsuming: Date;
  cause: string;
};
