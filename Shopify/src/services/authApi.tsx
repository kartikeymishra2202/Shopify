import api from "./api";

export const registerApi = async (
  name: string,
  email: string,
  password: string,
  password2:string
) => {
  const res = await api.post("user/register", {
    name,
    email,
    password,
    password2
  });

  return res.data;
};

export const loginApi = async (
  email: string,
  password: string
) => {
  const res = await api.post("user/login", {
    email,
    password,
  });

  return res.data;
};

export const auth0CallbackApi = async (code: string) => {
  const res = await api.post("auth/callback", { code });
  return res.data;
};

export const passwordResetRequestApi = async (email: string) => {
  const res = await api.post("user/password-reset-request", { email });
  return res.data;
};

export const passwordResetConfirmApi = async (
  uid: string,
  token: string,
  password: string,
  password2: string
) => {
  const res = await api.post("user/password-reset-confirm", {
    uid,
    token,
    password,
    password2,
  });
  return res.data;
};
