import {
  Bar,
  Pie,
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

import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import NotificationBell from "../components/NotificationBell";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {

  // =========================
  // STATES
  // =========================
  const [total, setTotal] = useState(0);

  const [areas, setAreas] = useState([]);

  const [meses, setMeses] = useState([]);

  const [pendientes, setPendientes] =
    useState(0);

  const [aprobadas, setAprobadas] =
    useState(0);

  const [canceladas, setCanceladas] =
    useState(0);

  const [topArea, setTopArea] =
    useState("");

  const [proximas, setProximas] =
    useState([]);

  const [prediccion, setPrediccion] =
    useState(null);

  const [loadingPdf, setLoadingPdf] =
    useState(false);

  const [notificaciones, setNotificaciones] =
    useState([]);

  // =========================
  // CARGAR STATS
  // =========================
  const cargarStats = async () => {

    try {

      // TOTAL
      const totalRes =
        await api.get("/reservas/stats/total");

      setTotal(totalRes.data);

      // AREAS
      const areaRes =
        await api.get("/reservas/stats/areas");

      setAreas(areaRes.data);

      // MESES
      const mesRes =
        await api.get("/reservas/stats/mes");

      setMeses(mesRes.data);

      // PENDIENTES
      const pendientesRes =
        await api.get(
          "/reservas/stats/pendientes"
        );

      setPendientes(
        pendientesRes.data
      );

      // APROBADAS
      const aprobadasRes =
        await api.get(
          "/reservas/stats/aprobadas"
        );

      setAprobadas(
        aprobadasRes.data
      );

      // CANCELADAS
      const canceladasRes =
        await api.get(
          "/reservas/stats/canceladas"
        );

      setCanceladas(
        canceladasRes.data
      );

      // AREA TOP
      const topRes =
        await api.get(
          "/reservas/stats/area-top"
        );

      if (topRes.data.length > 0) {

        setTopArea(
          topRes.data[0][0]
        );
      }

      // PROXIMAS
      const proxRes =
        await api.get(
          "/reservas/stats/proximas"
        );

      setProximas(
        proxRes.data
      );

      // IA
      const predRes =
        await api.get(
          "/reservas/stats/prediccion"
        );

      setPrediccion(
        predRes.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {

    cargarStats();

  }, []);

  // =========================
  // WEBSOCKET
  // =========================
  useEffect(() => {

    const socket =
      new SockJS(
        "http://localhost:8080/ws"
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
  // PDF
  // =========================
  const descargarPdf = async () => {

    try {

      setLoadingPdf(true);

      const response =
        await api.get(
          "/reportes/reservas",
          {
            responseType: "blob"
          }
        );

      const file = new Blob(
        [response.data],
        { type: "application/pdf" }
      );

      const fileURL =
        window.URL.createObjectURL(file);

      const link =
        document.createElement("a");

      link.href = fileURL;

      link.download =
        "reporte_reservas.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(fileURL);

      toast.success(
        "PDF descargado correctamente"
      );

    } catch (error) {

      toast.error(
        "Error al generar PDF"
      );

    } finally {

      setLoadingPdf(false);
    }
  };

  // =========================
  // CHARTS
  // =========================
  const areasData = {

    labels:
      areas.map(a => a[0]),

    datasets: [
      {
        label: "Reservas",
        data:
          areas.map(a => a[1])
      }
    ]
  };

  const mesesData = {

    labels:
      meses.map(
        m => `Mes ${m[0]}`
      ),

    datasets: [
      {
        label: "Reservas",
        data:
          meses.map(m => m[1])
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
        ]
      }
    ]
  };

  // =========================
  // RETURN
  // =========================
  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard Ejecutivo
        </h1>

        <div className="flex gap-4 items-center">

          <NotificationBell
            notifications={notificaciones}
          />

          <button
            onClick={descargarPdf}
            disabled={loadingPdf}
            className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-5
              py-3
              rounded-xl
              shadow
            "
          >

            {
              loadingPdf
                ? "Generando..."
                : "Descargar PDF"
            }

          </button>

        </div>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-5 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2>Total</h2>

          <p className="text-4xl font-bold mt-2">
            {total}
          </p>

        </div>

        <div className="bg-yellow-100 p-6 rounded-2xl shadow">

          <h2>Pendientes</h2>

          <p className="text-4xl font-bold mt-2">
            {pendientes}
          </p>

        </div>

        <div className="bg-green-100 p-6 rounded-2xl shadow">

          <h2>Aprobadas</h2>

          <p className="text-4xl font-bold mt-2">
            {aprobadas}
          </p>

        </div>

        <div className="bg-gray-200 p-6 rounded-2xl shadow">

          <h2>Canceladas</h2>

          <p className="text-4xl font-bold mt-2">
            {canceladas}
          </p>

        </div>

        <div className="bg-blue-100 p-6 rounded-2xl shadow">

          <h2>Área Top</h2>

          <p className="text-2xl font-bold mt-2">
            {topArea}
          </p>

        </div>

      </div>

      {/* GRAFICAS */}
      <div className="grid grid-cols-3 gap-8 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Reservas por Área
          </h2>

          <Pie data={areasData} />

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Reservas por Mes
          </h2>

          <Bar data={mesesData} />

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Estados
          </h2>

          <Doughnut data={estadosData} />

        </div>

      </div>

      {/* PROXIMAS */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Próximas Reservas
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">
                Usuario
              </th>

              <th className="text-left p-3">
                Área
              </th>

              <th className="text-left p-3">
                Fecha
              </th>

              <th className="text-left p-3">
                Estado
              </th>

            </tr>

          </thead>

          <tbody>

            {
              proximas.map(r => (

                <tr
                  key={r.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-3">
                    {r.usuario.nombre}
                  </td>

                  <td className="p-3">
                    {r.areaComun.nombre}
                  </td>

                  <td className="p-3">
                    {r.fecha}
                  </td>

                  <td className="p-3">

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

      </div>

      {/* IA PREDICTIVA */}
      <div
        className="
          mt-10
          bg-gradient-to-r
          from-slate-900
          to-slate-700
          text-white
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        <h2 className="text-3xl font-bold mb-8">

          IA Predictiva de Reservas

        </h2>

        {

          prediccion && (

            <div className="grid grid-cols-2 gap-8">

              <div>

                <h3 className="text-xl font-bold mb-2">
                  Área Más Usada
                </h3>

                <p className="text-2xl">
                  {prediccion.areaMasUsada}
                </p>

              </div>

              <div>

                <h3 className="text-xl font-bold mb-2">
                  Horario Más Reservado
                </h3>

                <p className="text-2xl">
                  {prediccion.horarioMasUsado}
                </p>

              </div>

              <div>

                <h3 className="text-xl font-bold mb-2">
                  Día Más Reservado
                </h3>

                <p className="text-2xl">
                  {prediccion.diaMasReservado}
                </p>

              </div>

              <div>

                <h3 className="text-xl font-bold mb-2">
                  Recomendación IA
                </h3>

                <p className="text-lg">
                  {prediccion.recomendacion}
                </p>

              </div>

            </div>

          )

        }

      </div>

    </div>
  );
}