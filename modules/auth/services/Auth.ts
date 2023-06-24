import { $Fetch } from 'ofetch';
import get from 'lodash/get';
import { AuthConfig, AuthEndpointOptions, AuthService } from '../types';
import AuthStorage from './AuthStorage';
import HttpService from './HttpService';

export class Auth implements AuthService {
  public config!: AuthConfig;
  public httpService!: HttpService;
  public storage!: AuthStorage;

  constructor($fetch: $Fetch) {
    const {
      public: { auth },
    } = useRuntimeConfig();
    this.config = auth;
    this.httpService = new HttpService($fetch, this.config, this);
    this.storage = new AuthStorage({ authConfig: auth });
  }

  get user() {
    return this.storage.user;
  }

  get store() {
    return this.storage.authStore;
  }

  get redirectPath() {
    let redirectPath = this.config.redirect.home ?? '/';

    if (this.config.rewriteRedirects && this.storage.referer.value) {
      redirectPath = this.storage.referer.value;
    }

    return redirectPath;
  }

  get accessToken() {
    return this.storage.accessToken;
  }

  get refreshToken() {
    return this.storage.refreshToken;
  }

  get loggedIn() {
    return this.storage.loggedIn;
  }

  get hasTokens() {
    const { refreshToken, accessToken } = this.storage;
    return !!(refreshToken || accessToken);
  }

  get isSessionExpired() {
    const { accessToken, refreshToken } = this.storage;
    return !!(refreshToken && !accessToken);
  }

  get isSessionEnd() {
    const { accessToken, refreshToken } = this.storage;
    return !!(accessToken && refreshToken);
  }

  get isPersistent() {
    return this.storage.persistent != null;
  }

  async login<T = unknown>(
    credentials: Record<string, unknown>,
    { sessionOnly = false } = {}
  ) {
    try {
      const res = await this.httpService.call<T>(
        this.config.endpoints.login.method,
        this.config.endpoints.login.url,
        credentials
      );
      const data = this.getProperty(res, 'login');
      const token = this.getToken(data, 'token');
      const refresh_token = this.getToken(data, 'refreshToken');
      this.storage.setAuth({ token, refresh_token });
      this.storage.setPersistent(!sessionOnly);
      await this.fetchUser();
      this.setReferer(null);
      return data;
    } catch (error) {
      this.logout(false);
      return Promise.reject(error);
    }
  }

  async fetchUser<T = unknown>() {
    try {
      const res = await this.httpService.call<T>(
        this.config.endpoints.user.method,
        this.config.endpoints.user.url
      );
      const data = this.getProperty(res, 'user');
      this.storage.setUser(data);
      return data;
    } catch (error) {
      this.logout(false);
      return Promise.reject(error);
    }
  }

  async logout(callApi = true): Promise<void> {
    try {
      if (callApi) {
        await this.httpService.call<unknown>(
          this.config.endpoints.logout.method,
          this.config.endpoints.logout.url
        );
      }
    } catch {
    } finally {
      this.storage.resetAuth();
    }
  }

  async refreshTokens<T = unknown>() {
    try {
      const { refreshToken } = this.storage;
      const res = await this.httpService.call<T>(
        this.config.endpoints.refresh.method,
        this.config.endpoints.refresh.url,
        { [this.config.refreshToken.paramName]: refreshToken }
      );
      const data = this.getProperty(res, 'refresh');
      const token = this.getToken(data, 'token');
      const refresh_token = this.getToken(data, 'refreshToken');
      this.storage.setAuth({ token, refresh_token });
      return data;
    } catch (error) {
      this.logout(false);
      return Promise.reject(error);
    }
  }

  setReferer(url: string | null) {
    this.storage.setReferer(url);
  }

  protected getProperty(
    response: any,
    key: Exclude<keyof AuthEndpointOptions, 'baseUrl'>
  ) {
    const { property } = this.config.endpoints[key];
    return property ? get(response, property) : response;
  }

  protected getToken(data: any, type: 'token' | 'refreshToken') {
    const { property } = this.config[type];
    return get(data, property);
  }
}
