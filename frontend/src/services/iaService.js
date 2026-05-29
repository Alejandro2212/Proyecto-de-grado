import api from "./api";

export const obtenerPrediccionIA = async () => {

    const response = await api.get(
        "/reservas/stats/prediccion"
    );

    return response.data;
};