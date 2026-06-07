import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  Building2
} from "lucide-react";

function Reservas() {

  const [areas, setAreas] = useState([]);

  const usuarioId =
    localStorage.getItem("usuarioId");

  const [form, setForm] = useState({
    usuarioId: usuarioId,
    areaId: "",
    fecha: "",
    horaInicio: "",
    horaFin: ""
  });

  const [ocupado, setOcupado] =
    useState(false);

  const [errores, setErrores] =
    useState([]);

  // =========================
  // CARGAR ÁREAS
  // =========================
  useEffect(() => {

    const cargar = async () => {

      try {

        const areaRes =
          await api.get("/areas");

        setAreas(areaRes.data);

      } catch (error) {

        console.log(error);

        toast.error(
          "Error cargando áreas"
        );
      }
    };

    cargar();

  }, []);

  // =========================
  // VALIDACIONES
  // =========================
  const validarFormulario = () => {

    let listaErrores = [];

    const hoy =
      new Date()
        .toISOString()
        .split("T")[0];

    // FECHA PASADA
    if (
      form.fecha &&
      form.fecha < hoy
    ) {

      listaErrores.push(
        "No puedes reservar fechas pasadas"
      );
    }

    // HORAS IGUALES
    if (
      form.horaInicio &&
      form.horaFin &&
      form.horaInicio === form.horaFin
    ) {

      listaErrores.push(
        "La hora inicio y fin no pueden ser iguales"
      );
    }

    // HORA FIN MENOR
    if (
      form.horaInicio &&
      form.horaFin &&
      form.horaFin < form.horaInicio
    ) {

      listaErrores.push(
        "La hora fin no puede ser menor a la hora inicio"
      );
    }

    // HORARIO PERMITIDO
    if (
      form.horaInicio &&
      (
        form.horaInicio < "06:00" ||
        form.horaInicio > "23:00"
      )
    ) {

      listaErrores.push(
        "Las reservas deben iniciar entre 06:00 y 23:00"
      );
    }

    if (
      form.horaFin &&
      (
        form.horaFin < "06:00" ||
        form.horaFin > "23:00"
      )
    ) {

      listaErrores.push(
        "Las reservas deben finalizar entre 06:00 y 23:00"
      );
    }

    setErrores(listaErrores);

    return listaErrores.length === 0;
  };

  // =========================
  // VALIDAR DISPONIBILIDAD
  // =========================
  const validarDisponibilidad =
    async () => {

    if (
      !form.areaId ||
      !form.fecha ||
      !form.horaInicio ||
      !form.horaFin
    ) return;

    if (!validarFormulario()) {

      return;
    }

    try {

      const res = await api.get(
        "/reservas/validar",
        {
          params: {
            areaId: form.areaId,
            fecha: form.fecha,
            horaInicio:
              form.horaInicio,
            horaFin:
              form.horaFin
          }
        }
      );

      setOcupado(!res.data);

      if (!res.data) {

        toast.error(
          "Horario ocupado"
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {

    if (
      !form.areaId ||
      !form.fecha ||
      !form.horaInicio ||
      !form.horaFin
    ) {

      toast.error(
        "Completa todos los campos"
      );

      return;
    }

    // VALIDACIONES
    if (!validarFormulario()) {

      toast.error(
        "Corrige los errores"
      );

      return;
    }

    if (ocupado) {

      toast.error(
        "Horario ocupado"
      );

      return;
    }

    try {

      await api.post("/reservas", {

        usuarioId:
          Number(form.usuarioId),

        areaId:
          Number(form.areaId),

        fecha:
          form.fecha,

        horaInicio:
          form.horaInicio,

        horaFin:
          form.horaFin
      });

      toast.success(
        "Reserva creada correctamente"
      );

      setForm({
        usuarioId,
        areaId: "",
        fecha: "",
        horaInicio: "",
        horaFin: ""
      });

      setErrores([]);

      setOcupado(false);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data ||
        "Error al crear reserva"
      );
    }
  };

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Nueva Reserva
        </h1>

        <p className="text-gray-500 mt-2">
          Reserva inteligente de áreas comunes
        </p>

      </div>

      {/* FORM */}
      <div
        className="
          bg-white
          p-8
          rounded-3xl
          shadow
          max-w-2xl
        "
      >

        <div className="grid gap-5">

          {/* AREA */}
          <div>

            <label className="font-semibold mb-2 block">
              Área Común
            </label>

            <div className="relative">

              <Building2
                className="
                  absolute
                  left-3
                  top-3.5
                  text-gray-400
                "
                size={18}
              />

              <select
                value={form.areaId}
                onChange={e =>
                  setForm({
                    ...form,
                    areaId:
                      e.target.value
                  })
                }
                className="
                  border
                  p-3
                  pl-10
                  rounded-xl
                  w-full
                "
              >

                <option value="">
                  Seleccione Área
                </option>

                {
                  areas.map(a => (

                    <option
                      key={a.id}
                      value={a.id}
                    >

                      {a.nombre}

                    </option>

                  ))
                }

              </select>

            </div>

          </div>

          {/* FECHA */}
          <div>

            <label className="font-semibold mb-2 block">
              Fecha
            </label>

            <div className="relative">

              <CalendarDays
                className="
                  absolute
                  left-3
                  top-3.5
                  text-gray-400
                "
                size={18}
              />

              <input
                type="date"
                value={form.fecha}
                onChange={e =>
                  setForm({
                    ...form,
                    fecha:
                      e.target.value
                  })
                }
                className="
                  border
                  p-3
                  pl-10
                  rounded-xl
                  w-full
                "
              />

            </div>

          </div>

          {/* HORA INICIO */}
          <div>

            <label className="font-semibold mb-2 block">
              Hora Inicio
            </label>

            <div className="relative">

              <Clock3
                className="
                  absolute
                  left-3
                  top-3.5
                  text-gray-400
                "
                size={18}
              />

              <input
                type="time"
                value={form.horaInicio}
                onChange={e =>
                  setForm({
                    ...form,
                    horaInicio:
                      e.target.value
                  })
                }
                onBlur={
                  validarDisponibilidad
                }
                className="
                  border
                  p-3
                  pl-10
                  rounded-xl
                  w-full
                "
              />

            </div>

          </div>

          {/* HORA FIN */}
          <div>

            <label className="font-semibold mb-2 block">
              Hora Fin
            </label>

            <div className="relative">

              <Clock3
                className="
                  absolute
                  left-3
                  top-3.5
                  text-gray-400
                "
                size={18}
              />

              <input
                type="time"
                value={form.horaFin}
                onChange={e =>
                  setForm({
                    ...form,
                    horaFin:
                      e.target.value
                  })
                }
                onBlur={
                  validarDisponibilidad
                }
                className="
                  border
                  p-3
                  pl-10
                  rounded-xl
                  w-full
                "
              />

            </div>

          </div>

          {/* ERRORES */}
          {
            errores.length > 0 && (

              <div
                className="
                  bg-yellow-100
                  text-yellow-800
                  p-4
                  rounded-xl
                "
              >

                <ul className="list-disc ml-5">

                  {
                    errores.map(
                      (e, index) => (

                        <li key={index}>
                          {e}
                        </li>
                      )
                    )
                  }

                </ul>

              </div>

            )
          }

          {/* HORARIO OCUPADO */}
          {
            ocupado && (

              <div
                className="
                  bg-red-100
                  text-red-700
                  p-4
                  rounded-xl
                "
              >

                ⚠️ El horario seleccionado
                ya está ocupado.

              </div>

            )
          }

          {/* BOTON */}
          <button
            onClick={guardar}
            disabled={
              ocupado ||
              errores.length > 0
            }
            className="
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-400
              text-white
              p-4
              rounded-xl
              font-bold
              shadow-lg
              transition
            "
          >

            Crear Reserva

          </button>

        </div>

      </div>

    </div>
  );
}

export default Reservas;