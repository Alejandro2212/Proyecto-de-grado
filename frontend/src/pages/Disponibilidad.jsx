import { useState } from "react";

import api from "../services/api";

import Swal from "sweetalert2";

function Disponibilidad() {

  const [areaId, setAreaId] =
    useState("");

  const [fecha, setFecha] =
    useState("");

  const [reservas, setReservas] =
    useState([]);

  // =========================
  // CONSULTAR
  // =========================
  const consultar = async () => {

    try {

      if (!areaId || !fecha) {

        Swal.fire(
          "Campos requeridos",
          "Debes ingresar área y fecha",
          "warning"
        );

        return;
      }

      const res =
        await api.get(
          "/reservas/disponibilidad",
          {
            params: {
              areaId,
              fecha
            }
          }
        );

      setReservas(res.data);

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        "No se pudo consultar disponibilidad",
        "error"
      );
    }
  };

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Disponibilidad de Áreas
        </h1>

        <p className="text-gray-500 mt-2">
          Consulta inteligente de reservas
        </p>

      </div>

      {/* FILTROS */}
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="number"
            placeholder="ID Área"
            value={areaId}
            onChange={(e) =>
              setAreaId(e.target.value)
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(e.target.value)
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          <button
            onClick={consultar}
            className="
              bg-slate-900
              hover:bg-slate-700
              text-white
              rounded-xl
              p-3
              font-semibold
            "
          >

            Consultar Disponibilidad

          </button>

        </div>

      </div>

      {/* RESULTADOS */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Reservas Encontradas
        </h2>

        {
          reservas.length === 0 ? (

            <div className="text-gray-500">

              No existen reservas en esta fecha.

            </div>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="p-4 text-left">
                    Usuario
                  </th>

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

                </tr>

              </thead>

              <tbody>

                {
                  reservas.map((r, i) => (

                    <tr
                      key={i}
                      className="
                        border-b
                        hover:bg-slate-50
                      "
                    >

                      <td className="p-4">
                        {r.usuario?.nombre}
                      </td>

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
                            text-white
                            text-sm

                            ${
                              r.estado === "APROBADA"
                                ? "bg-green-500"
                                : r.estado === "PENDIENTE"
                                ? "bg-yellow-500"
                                : r.estado === "CANCELADA"
                                ? "bg-gray-500"
                                : "bg-red-500"
                            }
                          `}
                        >

                          {r.estado}

                        </span>

                      </td>

                    </tr>
                  ))
                }

              </tbody>

            </table>
          )
        }

      </div>

    </div>
  );
}

export default Disponibilidad;