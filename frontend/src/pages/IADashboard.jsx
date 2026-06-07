import { useEffect, useState } from "react";
import { obtenerPrediccionIA } from "../services/iaService";

export default function IADashboard() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const cargarIA = async () => {

    try {

      const res = await obtenerPrediccionIA();

      setData(res);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    cargarIA();

  }, []);

  if (loading) {

    return (

      <div className="p-10">

        <h2 className="text-3xl font-bold">
          Cargando IA Predictiva...
        </h2>

      </div>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-4xl font-bold mb-8">
        Inteligencia Artificial Predictiva
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-3">
            Área Más Usada
          </h3>

          <p className="text-3xl text-blue-600 font-bold">
            {data.areaMasUsada}
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-3">
            Horario Más Reservado
          </h3>

          <p className="text-3xl text-green-600 font-bold">
            {data.horarioMasUsado}
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-3">
            Día Más Reservado
          </h3>

          <p className="text-3xl text-orange-600 font-bold">
            {data.diaMasReservado}
          </p>

        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-3">
            Recomendación IA
          </h3>

          <p className="text-lg">
            {data.recomendacion}
          </p>

        </div>

      </div>

    </div>
  );
}
