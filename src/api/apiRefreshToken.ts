import axios, { AxiosInstance } from "axios";

export function setupAPIClient(): AxiosInstance {
  const apiRefreshToken = axios.create({
    baseURL: 'https://twofaspring-latest.onrender.com/api/v1',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return apiRefreshToken;
}

export const apiRefreshToken = setupAPIClient();
