import { useState } from "react";
import api from "../services/api";

function Disponibilidad() {

  const [areaId, setAreaId] = useState("");
  const [fecha, setFecha] = useState("");
  const [reservas, setReservas] = useState([]);

  const consultar = async () => {

    try {

      const res = await api.get(
        `/reservas/disponibilidad`,
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
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Disponibilidad de Áreas
      </h1>

      {/* FILTROS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="number"
            placeholder="ID Área"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={consultar}
            className="bg-slate-900 text-white rounded p-2"
          >
            Consultar
          </button>

        </div>

      </div>

      {/* RESULTADOS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Reservas encontradas
        </h2>

        {reservas.length === 0 ? (
          <p>No hay reservas en esta fecha.</p>
        ) : (
          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map((r, i) => (
                <tr key={i} className="border-b">
                  <td>{r.usuario?.nombre}</td>
                  <td>{r.fecha}</td>
                  <td>{r.horaInicio}</td>
                  <td>{r.horaFin}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default Disponibilidad;