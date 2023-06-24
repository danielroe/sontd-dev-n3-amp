import { RawPaginationQuery } from '~~/types';
import { ApiPagination } from '~~/types/api';

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(timeoutId);
    }, ms);
  });

export const initPagination = (
  partials?: Partial<RawPaginationQuery | ApiPagination>
): ApiPagination => ({
  ...partials,
  offset: Number(partials?.offset || 20),
  page: Number(partials?.page || 1),
  total: Number((partials as ApiPagination)?.total || 0),
  count: Number((partials as ApiPagination)?.count || 0),
});
