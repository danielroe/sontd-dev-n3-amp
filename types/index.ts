import { LocationQueryValue } from 'vue-router';

export * from './api';
export * from './auth';
export * from './Blog';
export * from './User';

export type RawPaginationQuery = {
  page: LocationQueryValue | LocationQueryValue[];
  offset: LocationQueryValue | LocationQueryValue[];
};
