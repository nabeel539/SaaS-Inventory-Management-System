import api from './api';
import type { ApiResponse, Organization, UpdateSettingsPayload } from '../types';

export const settingsService = {
  getSettings: async (): Promise<Organization> => {
    const response = await api.get<ApiResponse<Organization>>('/settings');
    return response.data.data;
  },

  updateSettings: async (data: UpdateSettingsPayload): Promise<Organization> => {
    const response = await api.put<ApiResponse<Organization>>('/settings', data);
    return response.data.data;
  },
};
