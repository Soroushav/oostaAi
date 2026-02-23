import axios from "axios";

const API = "http://127.0.0.1:8000/api/auth";

type LoginParams = {
  email: string;
  password: string;
};

type SignupParams = {
  email: string;
  password: string;
  password2: string;
};

export async function login({ email, password }: LoginParams) {
  const response = await axios.post(`${API}/login/`, {
    email,
    password,
  });

  return response.data;
}

export async function signup({ email, password, password2 }: SignupParams) {
  const response = await axios.post(`${API}/signup/`, {
    email,
    password,
    password2,
  });

  return response.data;
}

export async function logout() {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  return axios.post(
    `${API}/logout/`,
    {
      refresh: refresh, // REQUIRED
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
}