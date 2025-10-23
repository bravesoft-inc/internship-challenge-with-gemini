import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  membership_status?: 'active' | 'inactive' | 'pending' | 'expired';
  notes?: string;
  profile_image?: string;
  points?: number;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchUsers = async (page: number = 1, perPage: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUser = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export const importUsers = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('csv_file', file);
    
    const response = await axios.post(`${API_URL}/users/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error importing users:', error);
    throw error;
  }
};

export const exportUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/export`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};
