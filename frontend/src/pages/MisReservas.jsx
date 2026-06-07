import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MisReservas() {

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = localStorage.getItem("usuarioId");
  const rol = localStorage.getItem("rol");

  // =========================
  // CARGAR RESERVAS
  // =========================
  const cargarMisReservas = async () => {

    try {

      if (!usuarioId) {

        toast.error(
          "No se encontró el usuario"
        );

        setLoading(false);
        return;
      }

      const res = await api.get(
        "/reservas/usuario",
        {
          params: {
            usuarioId,
            rol
          }
        }
      );

      setReservas(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "Error reservas:",
        error
      );

      console.error(
        "Respuesta:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data ||
        "Error al cargar reservas"
      );

      setReservas([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    cargarMisReservas();

  }, []);

  // =========================
  // CANCELAR RESERVA
  // =========================
  const cancelarReserva = async (id) => {

    try {

      await api.put(
        `/reservas/${id}/cancelar`,
        null,
        {
          params: {
            usuarioId
          }
        }
      );

      toast.success(
        "Reserva cancelada correctamente"
      );

      await cargarMisReservas();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data ||
        "Error al cancelar la reserva"
      );
    }
  };

  // =========================
  // COLOR ESTADO
  // =========================
  const colorEstado = (estado) => {

    switch (estado) {

      case "APROBADA":
        return "bg-green-100 text-green-700";

      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-700";

      case "RECHAZADA":
        return "bg-red-100 text-red-700";

      case "CANCELADA":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Mis Reservas
        </h1>

        <p className="text-gray-500 mt-2">
          Historial completo de reservas
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        {loading ? (

          <div className="p-10 text-center">

            <h2 className="text-2xl font-bold">
              Cargando reservas...
            </h2>

          </div>

        ) : reservas.length === 0 ? (

          <div className="p-10 text-center text-gray-500">

            No existen reservas registradas.

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-900 text-white">

              <tr>

                <th className="p-4 text-left">
                  Área
                </th>

                {rol === "ADMIN" && (

                  <th className="p-4 text-left">
                    Usuario
                  </th>

                )}

                <th className="p-4 text-left">
                  Fecha
                </th>

                <th className="p-4 text-left">
                  Inicio
                </th>

                <th className="p-4 text-left">
                  Fin
                </th>

                <th className="p-4 text-left">
                  Estado
                </th>

                <th className="p-4 text-left">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {reservas.map((r) => (

                <tr
                  key={r.id}
                  className="
                    border-b
                    hover:bg-slate-50
                  "
                >

                  <td className="p-4 font-semibold">
                    {r.areaComun?.nombre || "-"}
                  </td>

                  {rol === "ADMIN" && (

                    <td className="p-4">
                      {r.usuario?.nombre || "-"}
                    </td>

                  )}

                  <td className="p-4">
                    {r.fecha}
                  </td>

                  <td className="p-4">
                    {r.horaInicio}
                  </td>

                  <td className="p-4">
                    {r.horaFin}
                  </td>

                  <td className="p-4">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold
                        ${colorEstado(r.estado)}
                      `}
                    >
                      {r.estado}
                    </span>

                  </td>

                  <td className="p-4">

                    {(r.estado === "PENDIENTE" ||
                      r.estado === "APROBADA") && (

                      <button

                        onClick={() => {

                          const confirmar =
                            window.confirm(
                              "¿Está seguro de cancelar esta reserva?"
                            );

                          if (confirmar) {

                            cancelarReserva(r.id);
                          }

                        }}

                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          font-semibold
                        "
                      >
                        Cancelar
                      </button>

                    )}

                    {(r.estado === "CANCELADA" ||
                      r.estado === "RECHAZADA") && (

                      <span className="text-gray-400">
                        —
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}