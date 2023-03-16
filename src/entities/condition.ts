export type Causes = 'Stress' | 'Job' | 'Money' | 'Family';

export type Condition = {
  id: string;
  name: string;
  Causes: Causes | string;
};

export type UserCondition = {
  id: string;
  addiction: Condition;
  timeConsuming: Date;
  cause: string;
};
