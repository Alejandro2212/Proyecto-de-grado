import { useEffect, useState } from "react";
import api from "../services/api";

export default function MisReservas() {

  const [reservas, setReservas] = useState([]);

  const usuarioId = localStorage.getItem("usuarioId");

  // =========================
  // CARGAR MIS RESERVAS
  // =========================
  const cargarMisReservas = async () => {
    try {

      const res = await api.get(
        `/reservas/mis-reservas/${usuarioId}`
      );

      setReservas(res.data);

    } catch (error) {
      console.log("Error mis reservas:", error);
    }
  };

  useEffect(() => {
    cargarMisReservas();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Mis Reservas
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Área</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Inicio</th>
              <th className="text-left p-2">Fin</th>
            </tr>
          </thead>

          <tbody>

            {reservas.map((r) => (
              <tr key={r.id} className="border-b">

                <td className="p-2">
                  {r.areaComun?.nombre}
                </td>

                <td className="p-2">
                  {r.fecha}
                </td>

                <td className="p-2">
                  {r.horaInicio}
                </td>

                <td className="p-2">
                  {r.horaFin}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}