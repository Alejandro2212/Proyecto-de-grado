import api from "./api";

export const obtenerPrediccionIA = async () => {

    const response = await api.get(
        "/reservas/stats/prediccion"
    );

    return response.data;
};

export const obtenerRecomendacionIA = async () => {
  const response = await api.get("/ia/recomendacion");
  return response.data;
};

export const obtenerPrediccionRandomForest = async ({
  area_id,
  hora,
  dia_semana,
  mes,
  capacidad,
}) => {

  const response = await api.post("/ia/predecir", {
    area_id,
    hora,
    dia_semana,
    mes,
    capacidad,
  });

  return response.data;
};

export const obtenerHorarioInteligente = async (
  areaId,
  fecha
) => {

  const response = await api.get(
    "/ia/recomendacion-horario",
    {
      params: {
        areaId,
        fecha
      }
    }
  );

  return response.data;
};

export const obtenerHorarioGlobalIA =
  async () => {

    const response = await api.get(
      "/ia/recomendacion-horario-global"
    );

    return response.data;
};