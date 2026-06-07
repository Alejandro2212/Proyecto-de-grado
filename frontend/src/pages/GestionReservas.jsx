import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function GestionReservas() {

  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // CARGAR
  // =========================
  const cargar = async () => {

    try {

      setLoading(true);

      let url = "/reservas";

      if (estado || fecha) {

        url =
          `/reservas/filtrar?estado=${estado}&fecha=${fecha}`;
      }

      const res = await api.get(url);

      setReservas(res.data);

    } catch (error) {

      console.log(error);

      toast.error("Error al cargar reservas");

    } finally {

      setLoading(false);
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

    const confirm = await Swal.fire({

      title: "¿Confirmar acción?",
      text: `Cambiar estado a ${nuevoEstado}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {

      await api.put(
        `/reservas/${id}/estado?estado=${nuevoEstado}`
      );

      if (nuevoEstado === "APROBADA") {

        toast.success("✅ Reserva aprobada");

      } else if (
        nuevoEstado === "RECHAZADA"
      ) {

        toast.error("❌ Reserva rechazada");

      } else {

        toast("⚠️ Reserva cancelada");
      }

      const audio = new Audio(
        `${window.location.origin}/notification.mp3`
      );

      audio.play();

      cargar();

    } catch (error) {

      console.log(error);

      toast.error("Error al actualizar estado");
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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Gestión Inteligente de Reservas
          </h1>

          <p className="text-gray-500 mt-2">
            Administración avanzada de solicitudes
          </p>

        </div>

      </div>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6 flex gap-4 flex-wrap">

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
            hover:bg-slate-700
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

        {

          loading ? (

            <div className="p-10 text-center text-xl font-bold">
              Cargando reservas...
            </div>

          ) : (

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
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4 font-semibold">
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

                    <td className="p-4 flex gap-2 flex-wrap">

                      <button
                        onClick={() =>
                          cambiarEstado(
                            r.id,
                            "APROBADA"
                          )
                        }
                        className="
                          bg-green-600
                          hover:bg-green-700
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
                          hover:bg-red-700
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
                          hover:bg-gray-700
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

          )
        }

      </div>

    </div>
  );
}

export default GestionReservas;