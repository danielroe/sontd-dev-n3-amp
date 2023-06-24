import { ApiFetchOptions, useApiFetch } from '~/composables/useApiFetch';

export default class RestService<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected resource: string, protected opts: any = {}) {}

  index(
    params?: Record<string, string | number>,
    extras: ApiFetchOptions = {}
  ) {
    return useApiFetch<any>(this.resource, {
      query: params,
      immediate: true,
      ...extras,
    });
  }

  show(id: number | string, params?: Record<string, string | number>) {
    return useApiFetch<T>(`${this.resource}/${id}`, {
      query: params,
      ...this.opts,
    });
  }

  create() {
    console.log('create'); // eslint-disable-line
  }

  update() {
    console.log('update'); // eslint-disable-line
  }

  delete() {
    console.log('delete'); // eslint-disable-line
  }
}
