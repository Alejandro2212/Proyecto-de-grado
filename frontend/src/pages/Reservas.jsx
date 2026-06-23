import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  Building2
} from "lucide-react";
import {
  obtenerPrediccionRandomForest,
  obtenerHorarioInteligente
} from "../services/iaService";



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

  const [prediccionIA, setPrediccionIA] = 
    useState(null);

  const [horarioIA, setHorarioIA] =
    useState(null);


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


  useEffect(() => {
    if (areas.length > 0) {
      consultarIA();
    }
  }, [
    form.areaId,
    form.fecha,
    form.horaInicio,
    areas
  ]);

  useEffect(() => {

    if (
      form.areaId &&
      form.fecha
    ) {

      cargarHorarioInteligente();

    }

  }, [
    form.areaId,
    form.fecha
  ]);
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

  const consultarIA = async () => {

    if (
      !form.areaId ||
      !form.fecha ||
      !form.horaInicio
    ) {
      return;
    }

    try {

      const fecha = new Date(form.fecha);

      const hora = parseInt(
        form.horaInicio.split(":")[0]
      );

      const jsDay = fecha.getDay();

      // Convierte:
      // JS: 0=domingo,1=lunes,...,6=sábado
      // A: 0=lunes,...,5=sábado,6=domingo
      const dia_semana = jsDay === 0 ? 6 : jsDay - 1;

      const mes = fecha.getMonth() + 1;

      const areaSeleccionada =
        areas.find(
          a => Number(a.id) === Number(form.areaId)
        );

          if (!form.areaId || !form.fecha || !form.horaInicio) return;

      if (!areaSeleccionada) return;

      const respuesta =
        await obtenerPrediccionRandomForest({

          area_id: Number(form.areaId),

          hora,

          dia_semana,

          mes,

          capacidad: areaSeleccionada.capacidad

        });

      setPrediccionIA(respuesta);

    } catch (error) {

      console.log(error);

      setPrediccionIA(null);

    }

  };


const cargarHorarioInteligente =
  async () => {

    if (
      !form.areaId ||
      !form.fecha
    ) {
      return;
    }

    try {

      const data =
        await obtenerHorarioInteligente(
          form.areaId,
          form.fecha
        );

      setHorarioIA(data);

    } catch (error) {

      console.log(error);

      setHorarioIA(null);

    }
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

        <div
          className="
            mt-5
            bg-gradient-to-r
            from-violet-600
            to-indigo-700
            text-white
            rounded-2xl
            p-5
            shadow-lg
          "
        >

          <h3 className="font-bold text-lg">
            🤖 IA ACTIVA
          </h3>

          <p className="mt-2 text-sm opacity-90">

            La inteligencia artificial está analizando
            disponibilidad, demanda histórica y
            horarios recomendados en tiempo real.

          </p>

        </div>

      </div>

      {/* FORM */}
        <div
          className="
            grid
            lg:grid-cols-2
            gap-8
            bg-white
            p-8
            rounded-3xl
            shadow-xl
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


    {
      prediccionIA && (

        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
            rounded-2xl
            p-6
            shadow-xl
          "
        >
          <h3 className="font-bold text-blue-700 mb-2">
            🤖 Predicción Inteligente
          </h3>

        <div className="mt-4">

          <p className="text-sm text-blue-100 mb-2">
            Nivel estimado de demanda
          </p>

          <span
            className={`
              px-4
              py-2
              rounded-full
              font-bold
              text-white

              ${
                prediccionIA.prediccion === "BAJA"
                  ? "bg-green-500"
                  : prediccionIA.prediccion === "MEDIA"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
            `}
          >
            {prediccionIA.prediccion}
          </span>

        </div>

        <div className="mt-5">

          <div className="w-full bg-white/20 rounded-full h-4">

            <div
              className={`
                h-4
                rounded-full

                ${
                  prediccionIA.prediccion === "BAJA"
                    ? "bg-green-400"
                    : prediccionIA.prediccion === "MEDIA"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }
              `}
              style={{
                width:
                  prediccionIA.prediccion === "BAJA"
                    ? "25%"
                    : prediccionIA.prediccion === "MEDIA"
                    ? "60%"
                    : "100%"
              }}
            />

          </div>

        </div>

          <p className="text-sm text-gray-600 mt-2">

            {
              prediccionIA.prediccion === "BAJA"
                ? "Existe baja ocupación prevista. Es un excelente momento para reservar."
                : prediccionIA.prediccion === "MEDIA"
                ? "Se espera una demanda moderada. Se recomienda reservar con anticipación."
                : "Existe una alta demanda estimada. Considera realizar la reserva cuanto antes o elegir otro horario."
            }

          </p>

        </div>

      )
    }

    {
      horarioIA && (

        <div className="bg-green-50 border border-green-300 rounded-xl p-4">

          <h3 className="font-bold text-green-700 mb-2">

            💡 Horario sugerido por IA

          </h3>

          <div
            className="
              mt-3
              bg-green-100
              border
              border-green-300
              rounded-xl
              p-4
            "
          >

            <p className="text-sm text-green-700">
              Mejor horario encontrado
            </p>

            <h2
              className="
                text-3xl
                font-bold
                text-green-800
              "
            >
              {horarioIA.mejorHorarioAlternativo}
            </h2>

            <p className="text-sm mt-2 text-gray-600">
              Probabilidad de disponibilidad:
              {" "}
              {horarioIA.probabilidad}%
            </p>

          </div>

          <div className="mt-3">

            <p className="font-medium">

              Alternativas recomendadas:

            </p>

            <div className="flex flex-wrap gap-3 mt-4">

            {
              horarioIA.horariosAlternativos?.map(
                (hora,index)=>(

                  <button
                    key={index}
                    type="button"

                    onClick={() =>
                      setForm({
                        ...form,
                        horaInicio: hora,

                        horaFin:
                          `${String(
                            parseInt(hora.split(":")[0]) + 1
                          ).padStart(2,"0")}:00`
                      })
                    }
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-green-100
                      text-green-700
                      font-semibold
                      hover:bg-green-200
                      transition
                    "
                  >
                    {hora}
                  </button>

                )
              )
            }

            </div>

          </div>

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
            w-full
            bg-gradient-to-r
            from-emerald-500
            to-green-700
            text-white
            p-4
            rounded-2xl
            font-bold
            text-lg
            shadow-xl
            hover:scale-[1.02]
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