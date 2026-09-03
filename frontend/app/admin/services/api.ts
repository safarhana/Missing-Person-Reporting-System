import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  volunteers?: any[];
  caseOfficers?: any[];
}

export const loginAdmin = async (credentials: { username: string; password: string }) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const registerAdmin = async (data: {
  username: string;
  fullName: string;
  password: string;
  isActive?: boolean;
}) => {
  const response = await apiClient.post("/admin", { ...data, isActive: data.isActive ?? true });
  return response.data;
};

export const getAllAdmins = async (token?: string): Promise<AdminUser[]> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await apiClient.get("/admin", { headers });
  return response.data;
};

export const getAdminById = async (id: number | string, token?: string): Promise<AdminUser> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await apiClient.get(`/admin/id/${id}`, { headers });
  return response.data;
};

export const getAdminByUsername = async (username: string): Promise<AdminUser> => {
  const response = await apiClient.get(`/admin/${encodeURIComponent(username)}`);
  return response.data;
};

export const searchAdminsByName = async (name: string): Promise<AdminUser[]> => {
  const response = await apiClient.get(`/admin/search`, {
    params: { name },
  });
  return response.data;
};

export const updateAdmin = async (
  username: string,
  updateData: { username: string; fullName: string; password?: string; isActive: boolean }
) => {
  const response = await apiClient.put(`/admin/${encodeURIComponent(username)}`, updateData);
  return response.data;
};

export const updateAdminStatus = async (username: string, isActive: boolean) => {
  const response = await apiClient.patch(`/admin/status/${encodeURIComponent(username)}`, {
    isActive,
  });
  return response.data;
};

export const deleteAdmin = async (username: string) => {
  const response = await apiClient.delete(`/admin/${encodeURIComponent(username)}`);
  return response.data;
};

export const getAdminVolunteers = async (adminId: number | string) => {
  const response = await apiClient.get(`/admin/${adminId}/volunteers`);
  return response.data;
};

export const assignVolunteerToAdmin = async (
  adminId: number | string,
  volunteerId: number | string
) => {
  const response = await apiClient.post(`/admin/${adminId}/volunteer/${volunteerId}`);
  return response.data;
};

export const removeVolunteerFromAdmin = async (
  adminId: number | string,
  volunteerId: number | string
) => {
  const response = await apiClient.delete(`/admin/${adminId}/volunteer/${volunteerId}`);
  return response.data;
};

export const getAdminCaseOfficers = async (adminId: number | string) => {
  const response = await apiClient.get(`/admin/${adminId}/case-officers`);
  return response.data;
};

export const assignCaseOfficerToAdmin = async (
  adminId: number | string,
  caseOfficerId: number | string
) => {
  const response = await apiClient.post(`/admin/${adminId}/case-officer/${caseOfficerId}`);
  return response.data;
};

export const removeCaseOfficerFromAdmin = async (
  adminId: number | string,
  caseOfficerId: number | string
) => {
  const response = await apiClient.delete(`/admin/${adminId}/case-officer/${caseOfficerId}`);
  return response.data;
};

export default apiClient;
