import { LoginRequest, RegisterRequest } from "@/lib/api";

export type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  UserProfileDto,
} from "@/lib/api/generated";

export interface LoginFormData extends LoginRequest {
  rememberMe?: boolean;
}

export interface RegisterFormData extends RegisterRequest {
  agreeToTerms?: boolean;
}
