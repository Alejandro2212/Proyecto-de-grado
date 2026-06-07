import { useEffect, useState } from "react";
import api from "../services/api";

export default function usePerfil() {

  const [perfil, setPerfil] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const cargarPerfil = async () => {

    try {

      const response =
        await api.get("/perfil");

      setPerfil(response.data);

    } catch (error) {

      console.error(
        "Error al cargar perfil:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    cargarPerfil();

  }, []);

  return {
    perfil,
    loading,
    recargarPerfil: cargarPerfil
  };
}