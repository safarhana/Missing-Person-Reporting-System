import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return {};
};

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  volunteers?: any[];
  caseOfficers?: any[];
}

export const loginAdmin = async (credentials: { username: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const registerAdmin = async (data: {
  username: string;
  fullName: string;
  password: string;
  isActive?: boolean;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin`,
    { ...data, isActive: data.isActive ?? true },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const getAllAdmins = async (token?: string): Promise<AdminUser[]> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/admin`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

export const getAdminById = async (id: number | string, token?: string): Promise<AdminUser> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/admin/id/${id}`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

export const getAdminByUsername = async (username: string): Promise<AdminUser> => {
  const response = await axios.get(`${API_BASE_URL}/admin/${encodeURIComponent(username)}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const searchAdminsByName = async (name: string): Promise<AdminUser[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin/search`, {
    params: { name },
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const updateAdmin = async (
  username: string,
  updateData: { username: string; fullName: string; password?: string; isActive: boolean }
) => {
  const response = await axios.put(
    `${API_BASE_URL}/admin/${encodeURIComponent(username)}`,
    updateData,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateAdminStatus = async (username: string, isActive: boolean) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/status/${encodeURIComponent(username)}`,
    { isActive },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteAdmin = async (username: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/admin/${encodeURIComponent(username)}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const getAdminVolunteers = async (adminId: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/${adminId}/volunteers`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const assignVolunteerToAdmin = async (
  adminId: number | string,
  volunteerId: number | string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/${adminId}/volunteer/${volunteerId}`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const removeVolunteerFromAdmin = async (
  adminId: number | string,
  volunteerId: number | string
) => {
  const response = await axios.delete(
    `${API_BASE_URL}/admin/${adminId}/volunteer/${volunteerId}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const getAdminCaseOfficers = async (adminId: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/${adminId}/case-officers`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const assignCaseOfficerToAdmin = async (
  adminId: number | string,
  caseOfficerId: number | string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/${adminId}/case-officer/${caseOfficerId}`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

export const removeCaseOfficerFromAdmin = async (
  adminId: number | string,
  caseOfficerId: number | string
) => {
  const response = await axios.delete(
    `${API_BASE_URL}/admin/${adminId}/case-officer/${caseOfficerId}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};
