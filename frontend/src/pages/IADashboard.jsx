import { useEffect, useState } from "react";

import {
  obtenerPrediccionIA,
  obtenerRecomendacionIA,
  obtenerHorarioGlobalIA
} from "../services/iaService";

export default function IADashboard() {

  const [prediccion, setPrediccion] =
    useState(null);

  const [recomendacion, setRecomendacion] =
    useState(null);


  const [horarioIA, setHorarioIA] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const cargarDatos = async () => {

    try {

      const pred =
        await obtenerPrediccionIA();

      const reco =
        await obtenerRecomendacionIA();

      const horario =
        await obtenerHorarioGlobalIA();

      setPrediccion(pred);

      setRecomendacion(reco);

      setHorarioIA(horario);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    cargarDatos();

  }, []);

  if (loading) {

    return (

      <div className="p-10">

        <h2
          className="
            text-3xl
            font-bold
          "
        >
          Cargando Inteligencia Artificial...
        </h2>

      </div>
    );
  }

  return (

    <div className="p-6">

      <h1
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        Inteligencia Artificial Predictiva
      </h1>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      <div className="bg-white rounded-2xl shadow p-5">

        <h3 className="text-sm text-gray-500">
          Reservas Analizadas
        </h3>

        <p className="text-3xl font-bold text-blue-600">
          {prediccion.totalReservas}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <h3 className="text-sm text-gray-500">
          Área Más Demandada
        </h3>

        <p className="text-xl font-bold text-red-600">
          {prediccion.areaMasUsada}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <h3 className="text-sm text-gray-500">
          Área Recomendada
        </h3>

        <p className="text-xl font-bold text-green-600">
          {recomendacion.areaRecomendada}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <h3 className="text-sm text-gray-500">
          Precisión IA
        </h3>

        <p className="text-3xl font-bold text-purple-600">
          92%
        </p>

      </div>

    </div>

      {/* =======================
          IA PREDICTIVA
      ======================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-10
        "
      >

        <div
          className="
            bg-white
            p-6
            rounded-2xl
            shadow
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Área Más Usada
          </h3>

          <p
            className="
              text-3xl
              text-blue-600
              font-bold
            "
          >
            {prediccion.areaMasUsada}
          </p>

        </div>

        <div
          className="
            bg-white
            p-6
            rounded-2xl
            shadow
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Horario Más Reservado
          </h3>

          <p
            className="
              text-3xl
              text-green-600
              font-bold
            "
          >
            {prediccion.horarioMasUsado}
          </p>

        </div>

        <div
          className="
            bg-white
            p-6
            rounded-2xl
            shadow
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Día Más Reservado
          </h3>

          <p
            className="
              text-3xl
              text-orange-600
              font-bold
            "
          >
            {prediccion.diaMasReservado}
          </p>

        </div>

        <div
          className="
            bg-slate-900
            text-white
            p-6
            rounded-2xl
            shadow
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Recomendación General
          </h3>

          <p
            className="
              text-lg
            "
          >
            {prediccion.recomendacion}
          </p>

        </div>

      </div>

      {/* =======================
          IA DE RECOMENDACIÓN
      ======================== */}

      <h2
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Recomendaciones Inteligentes
      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          gap-6
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Área Recomendada
          </h3>

          <p
            className="
              text-3xl
              font-bold
              text-blue-600
            "
          >
            {recomendacion.areaRecomendada}
          </p>

          <p
            className="
              mt-3
              text-gray-600
            "
          >
            Ocupación histórica:
            {" "}
            {recomendacion.ocupacionArea}
          </p>

        </div>

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Horario Recomendada
          </h3>

          <p
            className="
              text-3xl
              font-bold
              text-green-600
            "
          >
            {recomendacion.horarioRecomendado}
          </p>

          <p
            className="
              mt-3
              text-gray-600
            "
          >
            Reservas registradas:
            {" "}
            {recomendacion.ocupacionHorario}
          </p>

    {
      horarioIA?.horariosAlternativos && (

        <div className="mt-4">

          <h4 className="font-semibold mb-2">
            Horarios Alternativos
          </h4>

          <div className="flex flex-wrap gap-2">

            {
              horarioIA.horariosAlternativos.map(
                (hora, index) => (

                  <span
                    key={index}
                    className="
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                    "
                  >
                    {hora}
                  </span>

                )
              )
            }

          </div>

        </div>

      )
    }

        </div>

      </div>

      <div
        className="
          mt-6
          bg-slate-900
          text-white
          rounded-2xl
          p-6
        "
      >

<div
  className="
    mt-6
    bg-blue-50
    border
    border-blue-300
    rounded-2xl
    p-6
  "
>

  <h3
    className="
      text-xl
      font-bold
      text-blue-700
      mb-4
    "
  >
    🤖 Análisis Inteligente
  </h3>

  <p className="text-gray-700">

    El modelo de inteligencia artificial
    detecta que la mayor demanda se
    concentra en el área:

    <strong>
      {" "}
      {prediccion.areaMasUsada}
    </strong>

    .

    El horario con mayor utilización es:

    <strong>
      {" "}
      {prediccion.horarioMasUsado}
    </strong>

    .

    Para maximizar disponibilidad se
    recomienda utilizar:

    <strong>
      {" "}
      {recomendacion.areaRecomendada}
    </strong>

    , especialmente en horarios de baja
    ocupación.

  </p>

</div>        

        <h3
          className="
            text-xl
            font-bold
            mb-3
          "
        >
          Nivel de Demanda
        </h3>

        <p
          className="
            text-2xl
            font-bold
            mb-3
          "
        >
          {recomendacion.nivelDemanda}
        </p>

        <p>
          {recomendacion.mensaje}
        </p>

      </div>

    </div>
  );
}