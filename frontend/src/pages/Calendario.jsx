import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin from "@fullcalendar/interaction";

import listPlugin from "@fullcalendar/list";

import Swal from "sweetalert2";

import api from "../services/api";

export default function Calendario() {

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // COLORES
  // =========================
  const colores = {

    APROBADA: "#22c55e",

    PENDIENTE: "#eab308",

    RECHAZADA: "#ef4444",

    CANCELADA: "#6b7280"
  };

  // =========================
  // CARGAR RESERVAS
  // =========================
  const cargarReservas = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/reservas");

      const data =
        res.data.map((r) => ({

          id: r.id,

          title:
            r.areaComun?.nombre +
            " • " +
            r.usuario?.nombre,

          start:
            `${r.fecha}T${r.horaInicio}`,

          end:
            `${r.fecha}T${r.horaFin}`,

          backgroundColor:
            colores[r.estado],

          borderColor:
            colores[r.estado],

          extendedProps: {

            estado:
              r.estado,

            usuario:
              r.usuario?.nombre,

            area:
              r.areaComun?.nombre,

            fecha:
              r.fecha,

            inicio:
              r.horaInicio,

            fin:
              r.horaFin
          }
        }));

      setEvents(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    cargarReservas();

  }, []);

  // =========================
  // EVENT CLICK
  // =========================
  const handleEventClick = (info) => {

    const e = info.event;

    Swal.fire({

      title: "Detalle Reserva",

      html: `

        <div style="text-align:left">

          <p><b>Área:</b> ${e.extendedProps.area}</p>

          <p><b>Usuario:</b> ${e.extendedProps.usuario}</p>

          <p><b>Estado:</b> ${e.extendedProps.estado}</p>

          <p><b>Fecha:</b> ${e.extendedProps.fecha}</p>

          <p><b>Inicio:</b> ${e.extendedProps.inicio}</p>

          <p><b>Fin:</b> ${e.extendedProps.fin}</p>

        </div>
      `
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="p-10">

        <h1 className="text-2xl font-bold">
          Cargando calendario...
        </h1>

      </div>
    );
  }

  // =========================
  // RETURN
  // =========================
  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Calendario Inteligente
        </h1>

        <p className="text-gray-500 mt-2">
          Visualización avanzada de reservas
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow-2xl">

        <FullCalendar

          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin
          ]}

          initialView="dayGridMonth"

          locale="es"

          height="82vh"

          events={events}

          eventClick={handleEventClick}

          headerToolbar={{

            left:
              "prev,next today",

            center:
              "title",

            right:
              "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}

        />

      </div>

    </div>
  );
}