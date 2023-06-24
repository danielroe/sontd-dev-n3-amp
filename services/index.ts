import { Blog } from '~~/types/Blog';
import { User } from '~~/types/User';
import RestService from './RestService';

export function defineApiService() {
  return {
    users: new RestService<User>('users'),
    blogs: new RestService<Blog>('blogs'),
  };
}

const apiService = defineApiService();

export type ApiService = ReturnType<typeof defineApiService>;

export function useApiService() {
  return {
    apiService,
  };
}
