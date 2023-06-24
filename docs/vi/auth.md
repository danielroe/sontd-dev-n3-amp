# Authentication module

> Module authentication trong source base này được viết dựa trên thiết kế của module [nuxt/auth](https://auth.nuxtjs.org/) để tương thích với Nuxt 3 (Vue 3).

## Getting Started
Auth module đang sử dụng `$fetch` cho việc gọi API và `pinia` làm store lưu trữ thông tin user.

## Usage
Source của module được đặt trong thư mục `modules/auth`, mặc định được tích hợp trong source base, không cần phải cài đặt thêm.

Bên trong file `nuxt.config.ts` cần có khai báo `'./modules/auth'`.
```diff
- modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
+ modules: ['@pinia/nuxt', '@nuxtjs/i18n', './modules/auth'],
```

> **Note**
> Auth module cần phải khai báo sau module `@pinia/nuxt`

### Options
Thêm option `auth` vào `nuxt.config.ts`.

```ts
export default defineNuxtConfig({
  // ... other options
  auth: {
    endpoints: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      login: { url: '/login', method: 'POST', property: 'data' },
      logout: { url: '/logout', method: 'DELETE' },
      refresh: { url: '/refresh_tokens', method: 'POST', property: 'data' },
      user: { url: '/me', method: 'GET', property: 'data' },
    },
    token: {
      headerName: 'Authorization',
      type: 'Bearer',
    },
    refreshToken: {
      paramName: 'token',
    },
  },
},
```


## Usage
> Xem example trong file `pages/login.vue`.

### composable `useLogin`

```ts
const { credentials, errorMsg, login } =
  useLogin<LoginPayload>({
    initialCredentials: {
      email: '',
      password: '',
      remember_me: true,
    },
  });
```

### Minimal login form

```html
<form @submit.prevent="() => login()">
  <p>{{ errorMsg }}</p>
  <input v-model="credentials.email" type="email" /><br />
  <input v-model="credentials.password" type="password" /><br />
  <input v-model="credentials.remember_me" type="checkbox" /> Remember Me
  <button :disabled="pending" type="submit">Login</button>
</form>
```

- `credentials` là một ref, khởi tạo là một object rỗng `{}`, có thể thêm bất kỳ thuộc tính nào vào, object này sẽ làm param để submit api login.
- `login` là hàm handler dùng cho submit login.
- `pending` có giá trị true khi đang gọi API login.
- `errorMsg` Chứa message lỗi

### Access `$auth` instance
`$auth` được provide sẵn trong nuxt app, có thể access `$auth` instance bằng cách

```ts
const { $auth } = useNuxtApp()
```
Hoặc nếu sử dụng options API
```ts
this.$auth
```

## API
### Configurations
- `endpoints`: Chứa các thông tin api endpoints cho việc authentication.
  - `baseUrl`: Base URL của API. Default value `process.env.NUXT_PUBLIC_API_BASE_URL`.
  - `login`: Chứa thông tin endpoint của API login:
    - `url`: Đường dẫn của API login. Default value: `'/login'`.
    - `method`: Method khi gọi API login. Default value: `'POST'`.
    - `property`: root key của response, cần dùng trong những trường hợp API trả về dữ liệu bọc trong key `data` chẳng hạng. Default value: `''`. Trường hợp cần gói giá trị trong object lồng nhau thì sử dụng dấu `.` (vd: `auth.tokens` => `{ auth: tokens: 'XXX' }`)
  - `logout`:
    - `url`: '/logout' Đường dẫn của API logout. Default value: `/logout`
    - `method`: Method khi gọi API logout. Default value: `'DELETE'`
  - `refresh`:
    - `url`: Đường dẫn của API refresh token. Default value: `'/refresh_tokens'`.
    - `method`: Method khi gọi API refresh token. Default value: `'POST'`.
    - `property`: root key của response, cần dùng trong những trường hợp API trả về dữ liệu bọc trong key `data` chẳng hạng. Default value: `''`. Trường hợp cần gói giá trị trong object lồng nhau thì sử dụng dấu `.` (vd: `auth.tokens` => `{ auth: tokens: 'XXX' }`)
  - `user`:
    - `url`: Đường dẫn của API get current user. Default value: `'/refresh_tokens'`.
    - `method`: Method khi gọi API current user. Default value: `'GET'`.
    - `property`: root key của response, cần dùng trong những trường hợp API trả về dữ liệu bọc trong key `data` chẳng hạng. Default value: `''`. Trường hợp cần gói giá trị trong object lồng nhau thì sử dụng dấu `.` (vd: `data.user` => `{ data: user: 'XXX' }`)
- `token`
  - `headerName`: Tên headers dùng để set cho request interceptors. Default value: `'Authorization'`
  - `type`: Loại token. Default value: `'Bearer'`
- `refreshToken`
  - `paramName`: Tên param trong body khi thực hiện refresh tokens. Default value: `'token'`. Trường hợp cần gói giá trị trong object lồng nhau thì sử dụng dấu `.` (vd: `auth.refresh_token` => `{ auth: refresh_token: 'XXX' }`)
- `redirect`
  - `login`: User will be redirected to this path if login is required. Default value: `'/login'`
  - `logout`: User will be redirected to this path if after logout, current route is protected.Default value: `'/'`
  - `home`: User will be redirected to this path after login. (rewriteRedirects will rewrite this path). Default value: `'/'`
- `rewriteRedirects`: If enabled, user will redirect back to the original guarded route instead of `redirect.home`. Default value: `true`

### $auth
#### Attributes
| Name | Type | Description |
|---|---|---|
| `user` | Ref<unknown> | Current user as a ref |
| `store` | Auth Store | Pinia store instance for auth module |
| `referer` | string | Path to be redirect after login success (if `rewriteRedirects` is set) |
| `accessToken` | string | The access token from cookies |
| `refreshToken` | string | The refresh token from cookies |
| `loggedIn` | boolean | `true` if logged in |
| `isSessionExpired` | boolean | `true` if logged in but access token is expired but refresh token is still valid |
| `isSessionEnd` | boolean | `true` if both access token and refresh token are expired |
#### Methods
| Method | Arguments | Returns | Description |
|---|---|---|---|
| `login` | `credentials: Record<string, unknown>` | `object` | Login and fetch current user |
| `fetchUser` | | `object` | Fetch current user |
| `logout` | `callApi = true` | `Promise<void>` | logout and clean up session. If call `logout(false)` will logout client side only |
| `refreshTokens` | | `object` | Refresh access token |
| `setReferer` | `url: string` | `void` | Set the referer path |
