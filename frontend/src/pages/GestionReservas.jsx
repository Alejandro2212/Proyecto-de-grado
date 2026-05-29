import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

function GestionReservas() {

  const [reservas, setReservas] = useState([]);

  const [estado, setEstado] = useState("");

  const [fecha, setFecha] = useState("");

  // =========================
  // CARGAR
  // =========================
  const cargar = async () => {

    try {

      let url = "/reservas";

      if (estado || fecha) {

        url =
          `/reservas/filtrar?estado=${estado}&fecha=${fecha}`;
      }

      const res = await api.get(url);

      setReservas(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    cargar();

  }, []);

  // =========================
  // CAMBIAR ESTADO
  // =========================
    const cambiarEstado = async (
    id,
    nuevoEstado
    ) => {

    try {

        await api.put(
        `/reservas/${id}/estado?estado=${nuevoEstado}`
        );

        // TOAST PROFESIONAL
        if (nuevoEstado === "APROBADA") {

        toast.success(
            "✅ Reserva aprobada"
        );

        } else if (
        nuevoEstado === "RECHAZADA"
        ) {

        toast.error(
            "❌ Reserva rechazada"
        );

        } else {

        toast(
            "⚠️ Reserva cancelada"
        );
        }

        // SONIDO
        const audio = new Audio(
        `${window.location.origin}/notification.mp3`
        );

        audio.play();

        cargar();

    } catch (error) {

        console.log(error);

        toast.error("Error");
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
        return "bg-slate-100";
    }
  };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Gestión de Reservas

      </h1>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6 flex gap-4">

        <select
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value)
          }
          className="border p-3 rounded-lg"
        >

          <option value="">
            Todos los estados
          </option>

          <option value="PENDIENTE">
            Pendiente
          </option>

          <option value="APROBADA">
            Aprobada
          </option>

          <option value="RECHAZADA">
            Rechazada
          </option>

          <option value="CANCELADA">
            Cancelada
          </option>

        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) =>
            setFecha(e.target.value)
          }
          className="border p-3 rounded-lg"
        />

        <button
          onClick={cargar}
          className="
            bg-slate-900
            text-white
            px-5
            rounded-lg
          "
        >
          Filtrar
        </button>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Usuario
              </th>

              <th className="p-4 text-left">
                Área
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>

              <th className="p-4 text-left">
                Horario
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

              <th className="p-4 text-left">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {reservas.map((r) => (

              <tr
                key={r.id}
                className="border-b"
              >

                <td className="p-4">
                  {r.usuario.nombre}
                </td>

                <td className="p-4">
                  {r.areaComun.nombre}
                </td>

                <td className="p-4">
                  {r.fecha}
                </td>

                <td className="p-4">
                  {r.horaInicio} - {r.horaFin}
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

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() =>
                      cambiarEstado(
                        r.id,
                        "APROBADA"
                      )
                    }
                    className="
                      bg-green-600
                      text-white
                      px-3
                      py-2
                      rounded-lg
                    "
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(
                        r.id,
                        "RECHAZADA"
                      )
                    }
                    className="
                      bg-red-600
                      text-white
                      px-3
                      py-2
                      rounded-lg
                    "
                  >
                    Rechazar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(
                        r.id,
                        "CANCELADA"
                      )
                    }
                    className="
                      bg-gray-600
                      text-white
                      px-3
                      py-2
                      rounded-lg
                    "
                  >
                    Cancelar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default GestionReservas;