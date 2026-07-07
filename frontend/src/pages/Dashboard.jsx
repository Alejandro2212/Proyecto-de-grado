import {
  Bar,
  Doughnut
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

  import {
    CalendarDays,
    Users,
    Building2,
    BrainCircuit,
    CheckCircle,
    Percent,
    TrendingUp,
    Home
  } from "lucide-react";

import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import NotificationBell from "../components/NotificationBell";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Dashboard() {

  const [total, setTotal] =
    useState(0);

  const [areas, setAreas] =
    useState([]);

  const [meses, setMeses] =
    useState([]);

  const [pendientes,
    setPendientes] =
    useState(0);

  const [aprobadas,
    setAprobadas] =
    useState(0);

  const [canceladas,
    setCanceladas] =
    useState(0);

const [usuariosActivos,
  setUsuariosActivos] =
  useState(0);

const [areasActivas,
  setAreasActivas] =
  useState(0);

const [reservasMes,
  setReservasMes] =
  useState(0);

const [porcentajeAprobacion,
  setPorcentajeAprobacion] =
  useState(0);

const [porcentajeCancelacion,
  setPorcentajeCancelacion] =
  useState(0);

const [areaMenosUsada,
  setAreaMenosUsada] =
  useState("");

const [mensajeIA,
  setMensajeIA] =
  useState("");

  const [topArea,
    setTopArea] =
    useState("");

  const [prediccion,
    setPrediccion] =
    useState(null);

  const [notificaciones,
    setNotificaciones] =
    useState([]);

  const porcentajeAprobadas =
    total > 0
      ? ((aprobadas / total) * 100).toFixed(1)
      : 0;

  const porcentajeCanceladas =
    total > 0
      ? ((canceladas / total) * 100).toFixed(1)
      : 0;

  // =========================
  // CARGAR STATS
  // =========================
  const cargarStats = async () => {

    try {

      const totalRes =
        await api.get(
          "/reservas/stats/total"
        );

      setTotal(totalRes.data);

      const areaRes =
        await api.get(
          "/reservas/stats/areas"
        );

      setAreas(areaRes.data);

      const mesRes =
        await api.get(
          "/reservas/stats/mes"
        );

      setMeses(mesRes.data);

      const pendientesRes =
        await api.get(
          "/reservas/stats/pendientes"
        );

      setPendientes(
        pendientesRes.data
      );

      const aprobadasRes =
        await api.get(
          "/reservas/stats/aprobadas"
        );

      setAprobadas(
        aprobadasRes.data
      );

      const canceladasRes =
        await api.get(
          "/reservas/stats/canceladas"
        );

      setCanceladas(
        canceladasRes.data
      );

      const topRes =
        await api.get(
          "/reservas/stats/area-top"
        );

      if (topRes.data.length > 0) {

        setTopArea(
          topRes.data[0][0]
        );
      }

      const predRes =
        await api.get(
          "/reservas/stats/prediccion"
        );

      setPrediccion(
        predRes.data
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al cargar dashboard"
      );
    }

  const dashboardRes =
  await api.get(
    "/dashboard/resumen"
  );

setUsuariosActivos(
  dashboardRes.data.usuariosActivos
);

setAreasActivas(
  dashboardRes.data.areasActivas
);

setReservasMes(
  dashboardRes.data.reservasMes
);

setPorcentajeAprobacion(
  dashboardRes.data.porcentajeAprobacion
);

setPorcentajeCancelacion(
  dashboardRes.data.porcentajeCancelacion
);

setAreaMenosUsada(
  dashboardRes.data.areaMenosUsada
);

setMensajeIA(
  dashboardRes.data.mensajeIA
);
  };

  useEffect(() => {

    cargarStats();

  }, []);

  // =========================
  // WEBSOCKET
  // =========================
  useEffect(() => {

const socket =
    new SockJS(
      import.meta.env.VITE_API_URL.replace("/api", "") + "/ws"
    );
    const client = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {

        client.subscribe(
          "/topic/reservas",
          (msg) => {

            const data =
              JSON.parse(msg.body);

            toast.success(
              "🔔 " + data.mensaje
            );

            setNotificaciones(prev => [

              {
                mensaje: data.mensaje,
                fecha: new Date()
                  .toLocaleTimeString()
              },

              ...prev

            ]);

            const audio =
              new Audio(
                `${window.location.origin}/notification.mp3`
              );

            audio.play()
              .catch(err =>
                console.log(err)
              );

            cargarStats();
          }
        );
      }
    });

    client.activate();

    return () => client.deactivate();

  }, []);

  // =========================
  // CHARTS
  // =========================
const areasData = {
  labels: areas.map(a => a[0]),
  datasets: [
    {
      label: "Reservas",
      data: areas.map(a => a[1]),
      backgroundColor: [
        "#2563EB",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#06B6D4"
      ],
      borderWidth: 0
    }
  ]
};

const areasOptions = {

  indexAxis: "y",

  responsive: true,

  plugins: {

    legend: {
      display: false
    },

    datalabels: {
      color: "#fff",
      anchor: "center",
      align: "center",
      font: {
        weight: "bold"
      }
    }
  },

  scales: {

    x: {
      beginAtZero: true
    }
  }
};

const nombresMeses = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre"
};

const mesesData = {
  labels: meses.map(
    m => nombresMeses[m[0]] || "Sin mes"
  ),

  datasets: [
    {
      label: "Reservas",
      data: meses.map(m => m[1]),
      backgroundColor: "#2563EB",
      borderRadius: 10
    }
  ]
};

const estadosData = {
  labels: [
    "Pendientes",
    "Aprobadas",
    "Canceladas"
  ],

  datasets: [
    {
      data: [
        pendientes,
        aprobadas,
        canceladas
      ],
      backgroundColor: [
        "#F59E0B",
        "#10B981",
        "#EF4444"
      ]
    }
  ]
};

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Dashboard Ejecutivo
          </h1>

          <p className="text-gray-500 mt-3">
            Panel inteligente de métricas
            y estadísticas
          </p>

        </div>

        <div className="flex items-center gap-4">

<NotificationBell />

        </div>

      </div>

{/* DASHBOARD CARDS */}

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-4
    gap-6
    mb-10
  "
>

  <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm">Total Reservas</h3>
        <p className="text-5xl font-bold mt-2">
          {total}
        </p>
      </div>

      <CalendarDays size={45}/>
    </div>
  </div>

  <div className="bg-green-600 text-white p-6 rounded-3xl shadow-xl">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm">Aprobadas</h3>

        <p className="text-5xl font-bold mt-2">
          {aprobadas}
        </p>

        <p className="text-sm mt-2">
          {porcentajeAprobadas}% del total
        </p>
      </div>

      <CheckCircle size={45}/>
    </div>
  </div>

  <div className="bg-yellow-500 text-white p-6 rounded-3xl shadow-xl">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm">Pendientes</h3>

        <p className="text-5xl font-bold mt-2">
          {pendientes}
        </p>
      </div>

      <TrendingUp size={45}/>
    </div>
  </div>

  <div className="bg-purple-600 text-white p-6 rounded-3xl shadow-xl">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm">Área Top</h3>

        <p className="text-2xl font-bold mt-2">
          {topArea}
        </p>
      </div>

      <BrainCircuit size={45}/>
    </div>
  </div>

</div>

{/* MÉTRICAS AVANZADAS */}

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-4
    gap-6
    mb-10
  "
>

  <div className="bg-white p-6 rounded-3xl shadow">
    <div className="flex justify-between items-center">

      <div>
        <h3 className="text-gray-500">
          Usuarios Activos
        </h3>

        <p className="text-4xl font-bold mt-2">
          {usuariosActivos}
        </p>
      </div>

      <Users size={42}/>
    </div>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <div className="flex justify-between items-center">

      <div>
        <h3 className="text-gray-500">
          Áreas Activas
        </h3>

        <p className="text-4xl font-bold mt-2">
          {areasActivas}
        </p>
      </div>

      <Home size={42}/>
    </div>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <div className="flex justify-between items-center">

      <div>
        <h3 className="text-gray-500">
          Reservas del Mes
        </h3>

        <p className="text-4xl font-bold mt-2">
          {reservasMes}
        </p>
      </div>

      <CalendarDays size={42}/>
    </div>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow">
    <div className="flex justify-between items-center">

      <div>
        <h3 className="text-gray-500">
          % Aprobación
        </h3>

        <p className="text-4xl font-bold text-green-600 mt-2">
          {porcentajeAprobacion}%
        </p>
      </div>

      <Percent size={42}/>
    </div>
  </div>

</div>

{/* RESUMEN EJECUTIVO */}

<div
  className="
    bg-white
    rounded-3xl
    shadow-lg
    p-6
    mb-10
  "
>

  <h2 className="text-2xl font-bold mb-6">
    Resumen Ejecutivo
  </h2>

  <div
    className="
      grid
      md:grid-cols-3
      gap-6
    "
  >

    <div>
      <p className="text-gray-500">
        Tasa de Aprobación
      </p>

      <h3 className="text-4xl font-bold text-green-600">
        {porcentajeAprobacion}%
      </h3>
    </div>

    <div>
      <p className="text-gray-500">
        Tasa de Cancelación
      </p>

      <h3 className="text-4xl font-bold text-red-500">
        {porcentajeCancelacion}%
      </h3>
    </div>

    <div>
      <p className="text-gray-500">
        Área Menos Utilizada
      </p>

      <h3 className="text-2xl font-bold">
        {areaMenosUsada}
      </h3>
    </div>

  </div>

</div>

      {/* GRAFICAS */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-8
          mb-10
        "
      >

        <div
          className="
            bg-white
            p-6
            rounded-3xl
            shadow
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-5
            "
          >
            Reservas por Área
          </h2>

        <Bar
          data={areasData}
          options={areasOptions}
        />

        </div>

        <div
          className="
            bg-white
            p-6
            rounded-3xl
            shadow
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-5
            "
          >
            Reservas por Mes
          </h2>

          <Bar data={mesesData} />

        </div>

        <div
          className="
            bg-white
            p-6
            rounded-3xl
            shadow
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-5
            "
          >
            Estados
          </h2>

          <Doughnut
            data={estadosData}
          />

        </div>

      </div>

      {/* IA */}
      {

        prediccion && (

          <div
            className="
              bg-gradient-to-r
              from-slate-900
              to-slate-700
              text-white
              p-8
              rounded-3xl
              shadow-2xl
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                mb-8
              "
            >

              IA Predictiva

            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              <div>

                <h3 className="font-bold">
                  Área Más Usada
                </h3>

                <p className="text-2xl">
                  {
                    prediccion.areaMasUsada
                  }
                </p>

              </div>

              <div>

                <h3 className="font-bold">
                  Horario Más Usado
                </h3>

                <p className="text-2xl">
                  {
                    prediccion.horarioMasUsado
                  }
                </p>

              </div>

              <div>

                <h3 className="font-bold">
                  Día Más Reservado
                </h3>

                <p className="text-2xl">
                  {
                    prediccion.diaMasReservado
                  }
                </p>

              </div>

<div>

  <h3 className="font-bold">
    Área Menos Utilizada
  </h3>

  <p className="text-2xl">
    {areaMenosUsada}
  </p>

</div>

<div>

  <h3 className="font-bold">
    % Cancelación
  </h3>

  <p className="text-2xl">
    {porcentajeCancelacion}%
  </p>

</div>

<div className="md:col-span-2">

  <h3 className="font-bold">
    Recomendación Inteligente
  </h3>

  <p className="text-lg">
    {mensajeIA}
  </p>

</div>

            </div>

          </div>

        )
      }

    </div>
  );
}