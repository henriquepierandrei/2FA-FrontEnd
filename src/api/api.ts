import axios, { AxiosInstance, AxiosError, AxiosHeaders } from "axios";
import { parseCookies, setCookie } from "nookies";

// Variáveis de controle para gerenciar a renovação do token
let isRefreshing = false;
let failedRequestQueue: any[] = [];

// Tipagem personalizada para os dados de erro
interface ErrorResponse {
  error: string;
}

// Função para verificar se o token expirou
export const isTokenExpired = (token: string): boolean => {
  try {
    // 1. Decodifica o payload do token (parte do meio do JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 2. Obtém o tempo de expiração (em segundos)
    const tokenExpiry = payload.exp;

    // 3. Obtém o tempo atual (em segundos)
    const currentTime = Math.floor(Date.now() / 1000);

    // 4. Converte os timestamps para datas no formato pt-BR
    const formatDate = (timestampInSeconds: number): string => {
      const date = new Date(timestampInSeconds * 1000); // Converte para milissegundos
      return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }); // Formato brasileiro
    };

    // 5. Exibe os valores para depuração
    console.log("Payload do token:", payload);
    console.log("Hora atual (currentTime):", formatDate(currentTime));
    console.log("Token expira em (tokenExpiry):", formatDate(tokenExpiry));
    console.log("Token está expirado? ", tokenExpiry < currentTime);

    // 6. Retorna true se o token estiver expirado, false caso contrário
    return tokenExpiry < currentTime;
  } catch (error) {
    // 7. Em caso de erro (token inválido, formato incorreto, etc.), considera como expirado
    console.error('Erro ao verificar expiração do token:', error);
    return true;
  }
};



// Função para configurar a instância do Axios com cookies e interceptores
export function setupAPIClient(ctx: any = undefined): AxiosInstance {
  const cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      Authorization: `Bearer ${cookies["accessToken"] || ""}`,
    },
  });

  // Interceptor de resposta para lidar com erros 401 (token expirado)
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
      if (error?.response?.status === 401) {
        if (error?.response?.data?.error === 'Unauthorized') {
          console.log("Token expirado, tentando renovar...");

          const { refreshToken } = parseCookies(ctx);
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              // Faz a requisição para renovar o token
              const response = await axios.post(
                "http://localhost:8080/api/v1/auth/refresh",
                { refreshToken }
              );

              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

              // Atualiza os cookies com os novos tokens
              setCookie(ctx, "accessToken", newAccessToken, {
                maxAge: 30 * 24 * 60 * 60, // 30 dias
                path: "/", // Disponível em toda a aplicação
                secure: process.env.NODE_ENV === "false", // Apenas HTTPS em produção
                sameSite: "lax", // Política de segurança
              });
              
              setCookie(ctx, "refreshToken", newRefreshToken, {
                maxAge: 30 * 24 * 60 * 60, // 30 dias
                path: "/",
                secure: process.env.NODE_ENV === "false", // alterar para production quando estiver em producao
                sameSite: "lax",
              });

              // Atualiza o header de autorização com o novo token
              api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;

              // Reprocessa as requisições que falharam
              failedRequestQueue.forEach((request) => request.onSuccess(newAccessToken));
              failedRequestQueue = [];
            } catch (refreshError) {
              console.error('Erro ao renovar o token:', refreshError);
              // Limpa os cookies e redireciona para o login em caso de erro
              setCookie(ctx, "accessToken", "", { path: "/" });
              setCookie(ctx, "refreshToken", "", { path: "/" });
              failedRequestQueue = [];
              window.location.href = "/login";
            } finally {
              isRefreshing = false;
            }
          }

          // Adiciona a requisição falha à fila para ser reprocessada após o refresh
          return new Promise((resolve, reject) => {
            if (!originalConfig) {
              return reject(new Error("Configuração original não encontrada."));
            }
          
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                if (originalConfig.headers) {
                  originalConfig.headers["Authorization"] = `Bearer ${token}`;
                }
                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
          
        }
      }
      return Promise.reject(error);
    }
  );

  // Interceptor de requisição para verificar a expiração do token antes de cada requisição
  api.interceptors.request.use(
    async (config) => {
      const cookies = parseCookies(ctx);
      const accessToken = cookies["accessToken"];

      if (accessToken && isTokenExpired(accessToken)) {
        console.log("Token expirado, tentando renovar antes da requisição...");

        const { refreshToken } = parseCookies(ctx);

        if (refreshToken) {
          try {
            // Faz a requisição para renovar o token
            const response = await axios.post(
              "http://localhost:8080/api/v1/auth/refresh",
              { refreshToken }
            );

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            // Atualiza os cookies com os novos tokens
            setCookie(ctx, "accessToken", newAccessToken, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });

            setCookie(ctx, "refreshToken", newRefreshToken, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });

            // Atualiza o header de autorização com o novo token
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          } catch (error) {
            console.error('Erro ao renovar o token:', error);
            setCookie(ctx, "accessToken", "", { path: "/" });
            setCookie(ctx, "refreshToken", "", { path: "/" });
            window.location.href = "/login";
          }
        } else {
          console.error('Refresh token não encontrado');
          window.location.href = "/login";
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}

// Instância padrão do Axios configurada para ser usada globalmente
export const api = setupAPIClient();