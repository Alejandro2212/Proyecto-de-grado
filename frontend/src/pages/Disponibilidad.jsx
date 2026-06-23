import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

// =========================
// imagenes importadas para disponibilidad
// =========================
import piscinaImg from "../assets/areas/piscina.jpg";
import canchaImg from "../assets/areas/cancha.jpg";
import salonImg from "../assets/areas/salon.jpg";
import parqueImg from "../assets/areas/parque.jpg";
import parrilleroImg from "../assets/areas/parrillero.jpg";
import jardinImg from "../assets/areas/jardin.jpg";

function Disponibilidad() {

  // =========================
  // ESTADOS
  // =========================

  const [areas, setAreas] = useState([]);

  const [areaSeleccionada, setAreaSeleccionada] =
    useState(null);

  const [fecha, setFecha] =
    useState("");

  const [reservas, setReservas] =
    useState([]);

  // =========================
  // CARGAR ÁREAS
  // =========================

  useEffect(() => {

    cargarAreas();

  }, []);

  const cargarAreas = async () => {

    try {

      const res =
        await api.get("/areas/activas");

      setAreas(res.data);

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        "No se pudieron cargar las áreas.",
        "error"
      );

    }

  };

  // =========================
  // CONSULTAR DISPONIBILIDAD
  // =========================

  const consultar = async () => {

    if (!areaSeleccionada) {

      Swal.fire(
        "Área requerida",
        "Selecciona un área común.",
        "warning"
      );

      return;
    }

    if (!fecha) {

      Swal.fire(
        "Fecha requerida",
        "Selecciona una fecha.",
        "warning"
      );

      return;
    }

    try {

      const res =
        await api.get(
          "/reservas/disponibilidad",
          {
            params: {
              areaId: areaSeleccionada.id,
              fecha
            }
          }
        );

      setReservas(res.data);

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        "No se pudo consultar la disponibilidad.",
        "error"
      );

    }

  };

  const generarHorarios = () => {

    if (!areaSeleccionada) return [];

    const inicio = parseInt(
      areaSeleccionada.horarioInicio.substring(0, 2)
    );

    const fin = parseInt(
      areaSeleccionada.horarioFin.substring(0, 2)
    );

    const bloques = [];

    for (let h = inicio; h < fin; h++) {

      const horaInicio =
        `${String(h).padStart(2, "0")}:00`;

      const horaFin =
        `${String(h + 1).padStart(2, "0")}:00`;

      const reserva = reservas.find(r => {

        return (
          r.horaInicio.substring(0, 5) <= horaInicio &&
          r.horaFin.substring(0, 5) > horaInicio
        );

      });

      bloques.push({
        horaInicio,
        horaFin,
        reserva
      });

    }

    return bloques;

  };

  const horarios = generarHorarios();


  const horasLibres =
    horarios.filter((h) => !h.reserva).length;

  const horasOcupadas =
    horarios.filter((h) => h.reserva).length;

  const totalReservas =
    reservas.length;

  const porcentajeOcupacion =
    horarios.length > 0
      ? Math.round(
          (horasOcupadas * 100) / horarios.length
        )
      : 0;

  return (

    <div className="p-6">

      {/* ========================= */}
      {/* TÍTULO */}
      {/* ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Disponibilidad de Áreas
        </h1>

        <p className="text-gray-500 mt-2">
          Selecciona un área común para consultar su disponibilidad.
        </p>

      </div>

    {/* ========================= */}
    {/* TARJETAS */}
    {/* ========================= */}

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

      {areas.map((area) => {

        let imagen = piscinaImg;

        const nombre = area.nombre.toLowerCase();

        if (nombre.includes("piscina")) {
          imagen = piscinaImg;
        } else if (nombre.includes("cancha")) {
          imagen = canchaImg;
        } else if (
          nombre.includes("salón") ||
          nombre.includes("salon")
        ) {
          imagen = salonImg;
        } else if (
          nombre.includes("zona infantil") ||
          nombre.includes("infantil") ||
          nombre.includes("parque")
        ) {
          imagen = parqueImg;
        } else if (
          nombre.includes("paseo verde horizonte") ||
          nombre.includes("paseo verde") ||
          nombre.includes("jardín") ||
          nombre.includes("jardin")
        ) {
          imagen = jardinImg;
        } else if (
          nombre.includes("parrillero") ||
          nombre.includes("parrilla")
        ) {
          imagen = parrilleroImg;
        }

        return (

          <div
            key={area.id}
            onClick={() => setAreaSeleccionada(area)}
            className={`
              cursor-pointer
              rounded-3xl
              overflow-hidden
              shadow-xl
              transition-all
              duration-300

              ${
                areaSeleccionada?.id === area.id
                  ? "scale-105 ring-4 ring-slate-900"
                  : "hover:scale-105 hover:shadow-2xl"
              }
            `}
          >

            {/* Imagen de fondo */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${imagen})`,
              }}
            >
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <h2 className="text-white text-3xl font-bold p-5">
                  {area.nombre}
                </h2>
              </div>
            </div>

            {/* Información */}
            <div className="bg-white p-5">

              <p className="text-gray-600 mb-3">
                {area.descripcion}
              </p>

              <div className="flex justify-between text-sm text-gray-700">

                <span>
                  👥 {area.capacidad} personas
                </span>

                <span>
                  🕒 {area.horarioInicio} - {area.horarioFin}
                </span>

              </div>

            </div>

          </div>

        );

      })}

    </div>

{/* ========================= */}
{/* PANEL DE DISPONIBILIDAD */}
{/* ========================= */}

{areaSeleccionada && (

  <div className="bg-white rounded-3xl shadow-xl p-8">

    <div className="flex justify-between items-center mb-6">

      <div>

        <h2 className="text-3xl font-bold text-slate-800">
          {areaSeleccionada.nombre}
        </h2>

        <p className="text-gray-500">
          Consulta de disponibilidad y reservas
        </p>

      </div>

      <div className="flex gap-3">

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-xl p-3"
        />

        <button
          onClick={consultar}
          className="
            bg-slate-900
            hover:bg-slate-700
            text-white
            px-6
            rounded-xl
          "
        >
          Consultar
        </button>

      </div>

    </div>

    {/* ========================= */}
    {/* RESUMEN DEL DÍA */}
    {/* ========================= */}

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      <div className="bg-green-50 rounded-2xl p-4 shadow">
        <div className="text-sm text-gray-500">
          Horas libres
        </div>
        <div className="text-3xl font-bold text-green-600">
          {horasLibres}
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-4 shadow">
        <div className="text-sm text-gray-500">
          Horas ocupadas
        </div>
        <div className="text-3xl font-bold text-red-600">
          {horasOcupadas}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-4 shadow">
        <div className="text-sm text-gray-500">
          Reservas del día
        </div>
        <div className="text-3xl font-bold text-blue-600">
          {totalReservas}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-4 shadow">
        <div className="text-sm text-gray-500">
          Ocupación
        </div>
        <div className="text-3xl font-bold text-yellow-600">
          {porcentajeOcupacion}%
        </div>
      </div>

    </div>
<div className="space-y-3">

  {horarios.map((h, index) => (

    <div
      key={index}
      className={`
        flex
        justify-between
        items-center
        rounded-2xl
        p-4
        border

        ${
          h.reserva
            ? "bg-red-50 border-red-300"
            : "bg-green-50 border-green-300"
        }
      `}
    >

      <div>

        <div className="font-bold text-lg">
          {h.horaInicio} - {h.horaFin}
        </div>

        {
          h.reserva ? (

            <div className="text-sm text-gray-700 mt-1">

              Reservado por{" "}

              <strong>

                {h.reserva.usuario?.nombre}{" "}
                {h.reserva.usuario?.apellido}

              </strong>

            </div>

          ) : (

            <div className="text-sm text-green-700 mt-1">

              Disponible

            </div>

          )
        }

      </div>

      <div>

        {
          h.reserva ? (

            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">

              Ocupado

            </span>

          ) : (

            <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">

              Libre

            </span>

          )
        }

      </div>

    </div>

  ))}

</div>

  </div>

)}


    </div>

  );

}

export default Disponibilidad;