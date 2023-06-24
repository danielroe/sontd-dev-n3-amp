export type Gender = 'male' | 'female';

export type Avatar = {
  url: string;
};

export type User = {
  created_at: string;
  email: string;
  name: string;
  updated_at: string;
  avatar: Avatar;
};
