import { WritableComputedRef } from 'vue';

export type UseQueryOptions<T> = {
  fallbackValue?: T;
  replace?: boolean;
};

export function useQuery<T>(name: string): WritableComputedRef<T>;
export function useQuery<T>(
  name: string,
  fallbackValue?: T | UseQueryOptions<T>
): WritableComputedRef<T>;
export function useQuery<T>(name: string, options?: UseQueryOptions<T>) {
  const route = useRoute();
  const router = useRouter();

  const configs =
    typeof options === 'object'
      ? { replace: false, fallbackValue: undefined, ...options }
      : { replace: false, fallbackValue: options };

  return computed({
    get: () => {
      return (route.query[name] as T) ?? configs.fallbackValue;
    },
    set: (value) => {
      const query = { ...route.query, [name]: String(value) };
      if (value == null) delete query[name];
      if (configs.replace) {
        router.replace({ ...route, query });
      } else {
        router.push({ ...route, query });
      }
    },
  });
}
