import api from "./api";

// =========================
// OBTENER TODOS
// =========================
export const obtenerUsuarios = async () => {
  const res = await api.get("/usuarios");
  return res.data;
};

// =========================
// PENDIENTES
// =========================
export const obtenerPendientes = async () => {
  const res = await api.get("/usuarios/pendientes");
  return res.data;
};

// =========================
// APROBAR
// =========================
export const aprobarUsuario = async (id) => {
  const res = await api.put(`/usuarios/${id}/aprobar`);
  return res.data;
};

// =========================
// RECHAZAR
// =========================
export const rechazarUsuario = async (id) => {
  const res = await api.delete(`/usuarios/${id}/rechazar`);
  return res.data;
};