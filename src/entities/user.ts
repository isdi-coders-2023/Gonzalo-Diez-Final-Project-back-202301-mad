export type States = 'Happy' | 'Sad' | 'Angry' | 'Excited' | 'Calm';
export type Causes = 'Stress' | 'Job' | 'Money' | 'Family';

export type User = {
  id: string;
  Age: number;
  email: string;
  password: string;
  Name: string;
  profilePic?: string;
  NickName: string | number;
  timeWithout: Date;
  Addictions?: {
    userAddiction: Adiction;
    TimeConsuming: Date;
    Cause: string;
  }[];
  Conditions?: {
    userCondition: Condition;
    Cause: Causes | string;
    psychoHelp: boolean;
  }[];
};

export type Condition = {
  name: string;
  Causes?: Causes | string;
};

export type Adiction = {
  actualThing: string;
  Causes?: Causes | string;
};
