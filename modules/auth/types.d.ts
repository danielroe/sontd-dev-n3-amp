import { Store } from '@pinia/nuxt/dist/runtime/composables';

export interface EndpointOption {
  url: string;
  method?: string;
  property?: string;
}

export interface AuthEndpointOptions {
  baseUrl: string;
  login: EndpointOption;
  logout: EndpointOption;
  refresh: EndpointOption;
  user: EndpointOption;
  signup: EndpointOption;
}

export interface AuthRouteRaw {
  path: string;
  file: string;
  name?: string;
}

export interface TokenOptions {
  headerName: string;
  type: string;
  property: string;
}

export interface RefreshTokenOptions {
  paramName: string;
  property: string;
}

export interface CookieOptions {
  ssl: boolean;
  maxAge: number;
}

export interface MiddlewareOptions {
  global: boolean;
}

export interface RedirectOptions {
  login: string;
  logout: string;
  home: string;
}

export interface AuthConfig {
  endpoints: AuthEndpointOptions;
  token: TokenOptions;
  refreshToken: RefreshTokenOptions;
  redirect: RedirectOptions;
  cookie: CookieOptions;
  middleware: MiddlewareOptions;
  rewriteRedirects: boolean;
}

export interface AuthOptions {
  endpoints?: Partial<AuthEndpointOptions>;
  token?: Partial<TokenOptions>;
  refreshToken?: Partial<RefreshTokenOptions>;
  cookie?: Partial<CookieOptions>;
  middleware: MiddlewareOptions;
  redirect?: Partial<RedirectOptions>;
  rewriteRedirects?: boolean;
}

export type AuthTokens = { token: string; refresh_token: string };

export interface User {
  [key: string]: any;
}

export interface AuthService {
  config: AuthConfig;
  httpService: HttpService;
  storage: AuthStorage;
  readonly user: Ref<User | null>;
  readonly store: Store;
  readonly redirectPath: string;
  readonly accessToken: string | undefined;
  readonly refreshToken: string | undefined;
  readonly loggedIn: Ref<boolean>;
  readonly hasTokens: boolean;
  readonly isSessionExpired: boolean;
  readonly isSessionEnd: boolean;
  readonly isPersistent: boolean;
  login<T = unknown>(
    credentials: Record<string, unknown>,
    options?: { sessionOnly?: boolean }
  ): Promise<T>;
  fetchUser<T = unknown>(): Promise<T>;
  logout(callApi?: boolean): Promise<void>;
  refreshTokens<T = unknown>(): Promise<T>;
  setReferer(url: string | null): void;
}
