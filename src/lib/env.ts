import { env } from "next-runtime-env";

export const runtimeEnv = {
  get API_URL() {
    return env("NEXT_PUBLIC_API_URL") || "http://localhost:8080";
  },
  get FRONTEND_URL() {
    return env("NEXT_PUBLIC_FRONTEND_URL") || "http://localhost:3000";
  },
  get API_TIMEOUT() {
    return parseInt(env("NEXT_PUBLIC_API_TIMEOUT") || "30000");
  },
  get API_LOGGING() {
    return env("NEXT_PUBLIC_API_LOGGING") === "true";
  },
};

export const getEnv = () => runtimeEnv;
