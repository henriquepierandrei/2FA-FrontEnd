// import axios, { AxiosInstance, AxiosError } from "axios";
// import { parseCookies, setCookie } from "nookies";

// interface ErrorResponse {
//   error: string;
// }

// interface TokenResponse {
//   accessToken: string;
//   refreshToken: string;
// }

// let isRefreshing = false;
// let failedRequestQueue: Array<{
//   onSuccess: (token: string) => void;
//   onFailure: (err: AxiosError) => void;
// }> = [];

// export function setupAPIClient(ctx: any = undefined): AxiosInstance {
//   const api = axios.create({
//     baseURL: 'https://twofaspring-latest.onrender.com/api/v1',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
//   });

//   api.interceptors.request.use((config) => {
//     const cookies = parseCookies(ctx);
//     const accessToken = cookies.accessToken;

//     if (config.data instanceof FormData) {
//       delete config.headers['Content-Type'];
//     }

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   });

//   api.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError<ErrorResponse>) => {
//       if (error?.response?.status === 401) {
//         const cookies = parseCookies(ctx);
//         const refreshToken = cookies.refreshToken;
//         const originalConfig = error.config;

//         if (!originalConfig) {
//           return Promise.reject(error);
//         }

//         if (!isRefreshing) {
//           isRefreshing = true;

//           try {
//             const response = await api.post<TokenResponse>('/auth/refresh', {
//               refreshToken
//             });

//             const { accessToken, refreshToken: newRefreshToken } = response.data;

//             setCookie(ctx, 'accessToken', accessToken, {
//               path: '/',
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'strict'
//             });

//             setCookie(ctx, 'refreshToken', newRefreshToken, {
//               path: '/',
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'strict'
//             });

//             api.defaults.headers.Authorization = `Bearer ${accessToken}`;

//             failedRequestQueue.forEach(request => {
//               request.onSuccess(accessToken);
//             });

//             return api(originalConfig);
//           } catch (err) {
//             failedRequestQueue.forEach(request => {
//               request.onFailure(err as AxiosError);
//             });

//             setCookie(ctx, 'accessToken', '', { path: '/' });
//             setCookie(ctx, 'refreshToken', '', { path: '/' });
//             window.location.href = '/login';
//           } finally {
//             isRefreshing = false;
//             failedRequestQueue = [];
//           }
//         }

//         return new Promise((resolve, reject) => {
//           failedRequestQueue.push({
//             onSuccess: (token: string) => {
//               originalConfig.headers.Authorization = `Bearer ${token}`;
//               resolve(api(originalConfig));
//             },
//             onFailure: (err: AxiosError) => {
//               reject(err);
//             },
//           });
//         });
//       }

//       return Promise.reject(error);
//     }
//   );

//   return api;
// }

// export const api = setupAPIClient();

import axios, { AxiosInstance, AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

interface ErrorResponse {
  error: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

let isRefreshing = false;
let failedRequestQueue: Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}> = [];

export function setupAPIClient(ctx: any = undefined): AxiosInstance {
  const api = axios.create({
    baseURL: 'https://twofaspring-latest.onrender.com/api/v1',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use((config) => {
    const cookies = parseCookies(ctx);
    const accessToken = cookies.accessToken;

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Verifica se a requisição é para o endpoint de refresh e NÃO adiciona o token
    if (accessToken && !config.url?.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
      if (error?.response?.status === 401) {
        const cookies = parseCookies(ctx);
        const refreshToken = cookies.refreshToken;
        const originalConfig = error.config;

        if (!originalConfig) {
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Cria uma instância temporária para a chamada de refresh
            // para garantir que não haverá interferência de interceptors
            const refreshApi = axios.create({
              baseURL: 'https://twofaspring-latest.onrender.com/api/v1',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            const response = await refreshApi.post<TokenResponse>('/auth/refresh', {
              refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            setCookie(ctx, 'accessToken', accessToken, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });

            setCookie(ctx, 'refreshToken', newRefreshToken, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });

            api.defaults.headers.Authorization = `Bearer ${accessToken}`;

            failedRequestQueue.forEach(request => {
              request.onSuccess(accessToken);
            });

            return api(originalConfig);
          } catch (err) {
            failedRequestQueue.forEach(request => {
              request.onFailure(err as AxiosError);
            });

            setCookie(ctx, 'accessToken', '', { path: '/' });
            setCookie(ctx, 'refreshToken', '', { path: '/' });
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } finally {
            isRefreshing = false;
            failedRequestQueue = [];
          }
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = setupAPIClient();

