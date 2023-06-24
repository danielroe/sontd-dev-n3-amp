import { Avatar, User as IUser } from '~~/types';

declare module '#app' {
  interface PageMeta {
    auth: 'guest' | boolean;
  }
}

declare module '~~/modules/auth/types' {
  interface User extends IUser {}
}

export {};
