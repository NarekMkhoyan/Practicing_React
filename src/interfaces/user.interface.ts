export interface INewUser {
  id: string;
  email: string;
  hasCompletedInitialSettings: boolean;
}

export interface IUser extends INewUser {
  firstName: string;
  lastName: string;
  age: string;
  avatar: string;
  dbId: string;
}

export class User implements IUser {
  id!: string;
  email!: string;
  hasCompletedInitialSettings!: boolean;
  firstName!: string;
  lastName!: string;
  age!: string;
  avatar!: string;
  dbId!: string;

  constructor(user: Partial<IUser>) {
    Object.assign(this, user);
  }
}
