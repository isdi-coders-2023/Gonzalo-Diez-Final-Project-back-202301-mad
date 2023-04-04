export type States = 'Happy' | 'Sad' | 'Angry' | 'Excited' | 'Calm';

export type User = {
  id?: string;
  age?: number;
  email: string;
  password: string;
  name?: string;
  profilePic?: string;
  nickName?: string | number;
  timeWithout?: Date;
  addictions?: UserAddiction[];
  conditions?: UserCondition[];
};

export type UserAddiction = {
  addictionId: string;
  timeConsuming: Date;
  cause: string;
};

export type UserCondition = {
  conditionId: string;
  timeConsuming: Date;
  cause: string;
};
