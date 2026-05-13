import api from './api';
import type { ApiResponse, AuthResponse, LoginPayload, SignupPayload, User } from '../types';

export const authService = {
  signup: async (data: SignupPayload): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return response.data.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
