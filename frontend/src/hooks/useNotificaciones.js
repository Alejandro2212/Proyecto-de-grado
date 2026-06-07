import { useEffect, useState } from "react";
import api from "../services/api";

export default function useNotificaciones() {

  const [notificaciones,
    setNotificaciones] =
    useState([]);

  const [pendientes,
    setPendientes] =
    useState(0);

  const cargarNotificaciones =
    async () => {

      try {

        const usuarioId =
          localStorage.getItem("usuarioId");

        if (!usuarioId) return;

        const res =
          await api.get(
            `/notificaciones/${usuarioId}`
          );

        setNotificaciones(
          res.data
        );

        const pendientesRes =
          await api.get(
            `/notificaciones/${usuarioId}/pendientes`
          );

        setPendientes(
          pendientesRes.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  const marcarLeida =
    async (id) => {

      try {

        await api.put(
          `/notificaciones/${id}/leida`
        );

        cargarNotificaciones();

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    cargarNotificaciones();

  }, []);

  return {

    notificaciones,

    pendientes,

    cargarNotificaciones,

    marcarLeida
  };
}