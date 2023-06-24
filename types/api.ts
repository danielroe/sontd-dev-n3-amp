export type ApiPagination = {
  count: number;
  offset: number;
  page: number;
  total: number;
  prev?: number;
  next?: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: ApiPagination;
};
