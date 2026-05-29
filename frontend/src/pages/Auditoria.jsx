import { useEffect, useState } from "react";
import api from "../services/api";

function Auditoria() {

  const [logs, setLogs] = useState([]);

  const cargarLogs = async () => {

    try {

      const res =
        await api.get("/auditoria");

      setLogs(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    cargarLogs();

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Bitácora del Sistema
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Usuario
              </th>

              <th className="p-4 text-left">
                Acción
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr
                key={log.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">
                  {log.usuario}
                </td>

                <td className="p-4">
                  {log.accion}
                </td>

                <td className="p-4 text-gray-600">
                  {
                    new Date(log.fecha)
                      .toLocaleString()
                  }
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Auditoria;