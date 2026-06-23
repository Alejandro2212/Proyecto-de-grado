import api from "./api";

export const solicitarRecuperacion = async (email) => {

  const response = await api.post(
    "/password/forgot",
    {
      email
    }
  );

  return response.data;
};

export const cambiarPassword = async (
  token,
  nuevaPassword
) => {

  const response = await api.post(
    "/password/reset",
    {
      token,
      nuevaPassword
    }
  );

  return response.data;
};