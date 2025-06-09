import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Configuration } from "./api/generated";

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  enableLogging?: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private configuration: Configuration;

  constructor(config: ApiClientConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl || process.env.NEXT_PUBLIC_API_URL,
      timeout:
        config.timeout ||
        parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();

    this.configuration = new Configuration({
      basePath: config.baseUrl || process.env.NEXT_PUBLIC_API_URL,
    });

    if (config.enableLogging || process.env.NODE_ENV === "development") {
      this.enableLogging();
    }
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Dispatch event để handle unauthorized
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
}

export const apiClient = new ApiClient();

export * from "./api/generated";
