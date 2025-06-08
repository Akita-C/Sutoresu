import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Configuration } from "./api/generated";

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  enableLogging?: boolean;
}

export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";

  static getAccessToken(): string | null {
    if (typeof window !== "undefined") return null;
    return localStorage.getItem(TokenStorage.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") return null;
    return localStorage.getItem(TokenStorage.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") return;
    localStorage.setItem(TokenStorage.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TokenStorage.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window !== "undefined") return;
    localStorage.removeItem(TokenStorage.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TokenStorage.REFRESH_TOKEN_KEY);
  }

  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private configuration: Configuration;

  constructor(config: ApiClientConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl || process.env.NEXT_PUBLIC_API_URL,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupRequestInterceptors();
    this.setupResponseInterceptors();

    this.configuration = new Configuration({
      basePath: config.baseUrl || process.env.NEXT_PUBLIC_API_URL,
      accessToken: () => TokenStorage.getAccessToken() || "",
    });

    if (config.enableLogging || process.env.NODE_ENV === "development") {
      this.enableLogging();
    }
  }

  private setupRequestInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = TokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private setupResponseInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.request?.status === 401) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("api:unauthorized"));
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private enableLogging(): void {
    this.axiosInstance.interceptors.request.use((config) => {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ [API] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          `❌ [API] ${error.response?.status} ${error.config?.url}`,
        );
        return Promise.reject(error);
      },
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  getConfiguration(): Configuration {
    return this.configuration;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  isAuthenticated(): boolean {
    return TokenStorage.hasTokens();
  }

  clearAuth(): void {
    TokenStorage.clearTokens();
  }
}

export const apiClient = new ApiClient();

export * from "./api/generated";
