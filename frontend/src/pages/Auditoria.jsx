import { useEffect, useState } from "react";
import api from "../services/api";

function Auditoria() {

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // CARGAR LOGS
  // =========================
  const cargarLogs = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/auditoria");

      setLogs(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    cargarLogs();

  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="p-10">

        <h1 className="text-2xl font-bold">
          Cargando auditoría...
        </h1>

      </div>
    );
  }

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Bitácora Inteligente
        </h1>

        <p className="text-gray-500 mt-2">
          Registro de actividades del sistema
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-5 text-left">
                Usuario
              </th>

              <th className="p-5 text-left">
                Acción
              </th>

              <th className="p-5 text-left">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {
              logs.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="p-6 text-center"
                  >

                    No existen registros

                  </td>

                </tr>

              ) : (

                logs.map((log) => (

                  <tr
                    key={log.id}
                    className="
                      border-b
                      hover:bg-slate-50
                      transition
                    "
                  >

                    <td className="p-5 font-semibold">
                      {log.usuario}
                    </td>

                    <td className="p-5">
                      {log.accion}
                    </td>

                    <td className="p-5 text-gray-500">
                      {
                        new Date(log.fecha)
                          .toLocaleString()
                      }
                    </td>

                  </tr>
                ))
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Auditoria;