import axios from "axios";

const API_URL = "http://tu-api-url.com";

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    // otros campos que devuelva tu API
  };
}

export const loginUser = async (credentials: Credentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    // Aquí puedes afinar el tipo de error si quieres
    throw error.response?.data || error;
  }
};
