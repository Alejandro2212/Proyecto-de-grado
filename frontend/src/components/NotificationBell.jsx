import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter
} from "lucide-react";

import api from "../services/api";

export default function NotificationBell() {

  const [abierto, setAbierto] =
    useState(false);

  const [notificaciones,
    setNotificaciones] =
    useState([]);

  const [filtro,
    setFiltro] =
    useState("TODAS");

  const [orden, setOrden] =
    useState("NUEVAS");

  // =========================
  // CARGAR NOTIFICACIONES
  // =========================
  const cargarNotificaciones =
    async () => {

      try {

        const usuarioId =
          localStorage.getItem(
            "usuarioId"
          );

        if (!usuarioId) return;

        const response =
          await api.get(
            `/notificaciones/usuario/${usuarioId}`
          );

        setNotificaciones(
          response.data
        );

      } catch (error) {

        console.error(
          "Error cargando notificaciones",
          error
        );
      }
    };

  // =========================
  // MARCAR UNA LEIDA
  // =========================
  const marcarLeida =
    async (id) => {

      try {

        await api.put(
          `/notificaciones/${id}/leida`
        );

        setNotificaciones(prev =>
          prev.map(n =>
            n.id === id
              ? {
                  ...n,
                  leida: true
                }
              : n
          )
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // MARCAR TODAS LEIDAS
  // =========================
  const marcarTodasLeidas =
    async () => {

      try {

        const usuarioId =
          localStorage.getItem(
            "usuarioId"
          );

        await api.put(
          `/notificaciones/usuario/${usuarioId}/todas-leidas`
        );

        setNotificaciones(prev =>
          prev.map(n => ({
            ...n,
            leida: true
          }))
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // ELIMINAR UNA
  // =========================
  const eliminar =
    async (id) => {

      try {

        await api.delete(
          `/notificaciones/${id}`
        );

        setNotificaciones(prev =>
          prev.filter(
            n => n.id !== id
          )
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // ELIMINAR TODAS
  // =========================
  const eliminarTodas =
    async () => {

      try {

        const usuarioId =
          localStorage.getItem(
            "usuarioId"
          );

        await api.delete(
          `/notificaciones/usuario/${usuarioId}`
        );

        setNotificaciones([]);

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // FECHA
  // =========================
  const formatearFecha =
    (fecha) => {

      if (!fecha) return "";

      return new Date(fecha)
        .toLocaleString("es-BO");
    };

  // =========================
  // COLOR SEGUN TIPO
  // =========================
  const colorTipo =
    (tipo) => {

      switch (tipo) {

        case "RESERVA":
          return "bg-blue-100 text-blue-700";

        case "ESTADO":
          return "bg-green-100 text-green-700";

        case "CANCELACION":
          return "bg-red-100 text-red-700";

        default:
          return "bg-gray-100 text-gray-700";

        case "AVISO":
          return "bg-purple-100 text-purple-700";

        case "MANTENIMIENTO":
          return "bg-yellow-100 text-yellow-700";

        case "REUNION":
          return "bg-indigo-100 text-indigo-700";

        case "EMERGENCIA":
          return "bg-red-100 text-red-700";
      }
    };

  // =========================
  // FILTRADO
  // =========================
  const notificacionesFiltradas =
    filtro === "TODAS"
      ? notificaciones
      : notificaciones.filter(
          n => n.tipo === filtro
        );
  
  const notificacionesOrdenadas =
    [...notificacionesFiltradas];

  switch (orden) {

    case "ANTIGUAS":

      notificacionesOrdenadas.sort(
        (a, b) =>
          new Date(a.fecha)
          -
          new Date(b.fecha)
      );

      break;

    case "NO_LEIDAS":

      notificacionesOrdenadas.sort(
        (a, b) =>
          Number(a.leida)
          -
          Number(b.leida)
      );

      break;

    case "LEIDAS":

      notificacionesOrdenadas.sort(
        (a, b) =>
          Number(b.leida)
          -
          Number(a.leida)
      );

      break;

    default:

      notificacionesOrdenadas.sort(
        (a, b) =>
          new Date(b.fecha)
          -
          new Date(a.fecha)
      );
  }

  const noLeidas =
    notificaciones.filter(
      n => !n.leida
    ).length;

  // =========================
  // INICIAL
  // =========================
  useEffect(() => {

    cargarNotificaciones();

  }, []);

  // =========================
  // REFRESH
  // =========================
  useEffect(() => {

    const intervalo =
      setInterval(() => {

        cargarNotificaciones();

      }, 10000);

    return () =>
      clearInterval(intervalo);

  }, []);

  return (

    <div className="relative">

      {/* CAMPANA */}
      <button
        onClick={() =>
          setAbierto(!abierto)
        }
        className="
          relative
          bg-white
          p-2
          rounded-full
          hover:bg-slate-100
        "
      >

        <Bell
          size={24}
          className="text-slate-700"
        />

        {

          noLeidas > 0 && (

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                rounded-full
                w-5
                h-5
                flex
                items-center
                justify-center
              "
            >

              {noLeidas}

            </span>

          )
        }

      </button>

      {

        abierto && (

          <div
            className="
              absolute
              right-0
              top-12
              bg-white
              shadow-2xl
              rounded-2xl
              w-[420px]
              z-50
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                bg-slate-900
                text-white
                p-4
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <h3 className="font-bold">

                  Notificaciones

                </h3>

                <span>

                  {noLeidas} pendientes

                </span>

              </div>

            </div>

            {/* FILTROS */}
            <div
              className="
                p-3
                border-b
                flex
                gap-2
                flex-wrap
              "
            >
          {/* ORDENAMIENTO */}
          <div
            className="
              p-3
              border-b
            "
          >

            <select
              value={orden}
              onChange={(e) =>
                setOrden(e.target.value)
              }
              className="
                w-full
                border
                rounded-lg
                p-2
                text-sm
              "
            >

              <option value="NUEVAS">
                Más recientes
              </option>

              <option value="ANTIGUAS">
                Más antiguas
              </option>

              <option value="NO_LEIDAS">
                No leídas primero
              </option>

              <option value="LEIDAS">
                Leídas primero
              </option>

            </select>

          </div>

              <Filter size={18} />

              {

                [
                  "TODAS",
                  "RESERVA",
                  "ESTADO",
                  "CANCELACION",
                  "AVISO",
                  "MANTENIMIENTO",
                  "REUNION",
                  "EMERGENCIA"
                ].map(op => (

                  <button
                    key={op}
                    onClick={() =>
                      setFiltro(op)
                    }
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm

                      ${
                        filtro === op
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100"
                      }
                    `}
                  >

                    {op}

                  </button>

                ))
              }

            </div>

            {/* ACCIONES */}
            <div
              className="
                flex
                justify-between
                p-3
                border-b
              "
            >

              <button
                onClick={
                  marcarTodasLeidas
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-blue-600
                  text-sm
                "
              >

                <CheckCheck size={16} />

                Marcar todas

              </button>

              <button
                onClick={
                  eliminarTodas
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-red-600
                  text-sm
                "
              >

                <Trash2 size={16} />

                Eliminar todas

              </button>

            </div>

            {/* LISTA */}
            <div
              className="
                max-h-[500px]
                overflow-y-auto
              "
            >

              {

                notificacionesFiltradas.length === 0 ? (

                  <div
                    className="
                      p-8
                      text-center
                      text-gray-500
                    "
                  >

                    No existen notificaciones

                  </div>

                ) : (

                  notificacionesOrdenadas.map(
                    (n) => (

                      <div
                        key={n.id}
                        className={`
                          p-4
                          border-b

                          ${
                            !n.leida
                              ? "bg-blue-50"
                              : ""
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            justify-between
                            items-start
                          "
                        >

                          <div>

                            <h4
                              className="
                                font-semibold
                              "
                            >

                              {n.titulo}

                            </h4>

                            <span
                              className={`
                                px-2
                                py-1
                                text-xs
                                rounded-full

                                ${colorTipo(
                                  n.tipo
                                )}
                              `}
                            >

                              {n.tipo}

                            </span>

                          </div>

                          <button
                            onClick={() =>
                              eliminar(n.id)
                            }
                            className="
                              text-red-500
                            "
                          >

                            <Trash2
                              size={16}
                            />

                          </button>

                        </div>

                        <p
                          className="
                            mt-2
                            text-sm
                          "
                        >

                          {n.mensaje}

                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-2
                          "
                        >

                          {
                            formatearFecha(
                              n.fecha
                            )
                          }

                        </p>

                        {

                          !n.leida && (

                            <button
                              onClick={() =>
                                marcarLeida(
                                  n.id
                                )
                              }
                              className="
                                mt-2
                                text-blue-600
                                text-sm
                              "
                            >

                              Marcar como leída

                            </button>

                          )
                        }

                      </div>

                    )
                  )
                )
              }

            </div>

          </div>

        )
      }

    </div>
  );
}