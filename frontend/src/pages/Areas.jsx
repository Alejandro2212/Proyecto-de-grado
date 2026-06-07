import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Areas() {

  const [areas, setAreas] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    capacidad: "",
    horarioInicio: "",
    horarioFin: ""
  });

  // =========================
  // CARGAR AREAS
  // =========================
  const cargarAreas = async () => {

    try {

      const res =
        await api.get("/areas");

      setAreas(res.data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al cargar áreas"
      );
    }
  };

  useEffect(() => {

    cargarAreas();

  }, []);

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {

    try {

      if (
        !form.nombre ||
        !form.descripcion ||
        !form.capacidad ||
        !form.horarioInicio ||
        !form.horarioFin
      ) {

        toast.error(
          "Complete todos los campos"
        );

        return;
      }

      await api.post(
        "/areas",
        {
          ...form,
          capacidad:
            Number(form.capacidad)
        }
      );

      toast.success(
        "Área creada correctamente"
      );

      setForm({
        nombre: "",
        descripcion: "",
        capacidad: "",
        horarioInicio: "",
        horarioFin: ""
      });

      cargarAreas();

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al crear área"
      );
    }
  };

  // =========================
  // ACTIVAR
  // =========================
  const activar = async (id) => {

    try {

      await api.put(
        `/areas/${id}/activar`
      );

      toast.success(
        "Área activada"
      );

      cargarAreas();

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al activar área"
      );
    }
  };

  // =========================
  // DESACTIVAR
  // =========================
  const desactivar = async (id) => {

    try {

      await api.put(
        `/areas/${id}/desactivar`
      );

      toast.success(
        "Área desactivada"
      );

      cargarAreas();

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al desactivar área"
      );
    }
  };

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Gestión de Áreas Comunes
        </h1>

        <p className="text-gray-500 mt-2">
          Administración de espacios del condominio
        </p>

      </div>

      {/* FORMULARIO */}

      <div
        className="
          bg-white
          p-6
          rounded-3xl
          shadow
          mb-8
        "
      >

        <h2
          className="
            text-xl
            font-bold
            mb-4
          "
        >
          Nueva Área
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            gap-4
          "
        >

          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Capacidad"
            value={form.capacidad}
            onChange={(e) =>
              setForm({
                ...form,
                capacidad: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({
                ...form,
                descripcion: e.target.value
              })
            }
            className="
              border
              p-3
              rounded-xl
              md:col-span-2
            "
          />

          <input
            type="time"
            value={form.horarioInicio}
            onChange={(e) =>
              setForm({
                ...form,
                horarioInicio: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="time"
            value={form.horarioFin}
            onChange={(e) =>
              setForm({
                ...form,
                horarioFin: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

        </div>

        <button
          onClick={guardar}
          className="
            mt-5
            bg-green-600
            hover:bg-green-700
            text-white
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >
          Crear Área
        </button>

      </div>

      {/* TABLA */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-slate-900
              text-white
            "
          >

            <tr>

              <th className="p-4">
                Área
              </th>

              <th>
                Capacidad
              </th>

              <th>
                Horario
              </th>

              <th>
                Estado
              </th>

              <th>
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {areas.map(area => (

              <tr
                key={area.id}
                className="
                  border-b
                  text-center
                "
              >

                <td className="p-4">

                  <div className="font-bold">
                    {area.nombre}
                  </div>

                  <div
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    {area.descripcion}
                  </div>

                </td>

                <td>
                  {area.capacidad}
                </td>

                <td>

                  {area.horarioInicio}
                  {" - "}
                  {area.horarioFin}

                </td>

                <td>

                  {area.activo ? (

                    <span
                      className="
                        bg-green-100
                        text-green-700
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      Activa
                    </span>

                  ) : (

                    <span
                      className="
                        bg-red-100
                        text-red-700
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      Inactiva
                    </span>

                  )}

                </td>

                <td>

                  {area.activo ? (

                    <button
                      onClick={() =>
                        desactivar(area.id)
                      }
                      className="
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "
                    >
                      Desactivar
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        activar(area.id)
                      }
                      className="
                        bg-green-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "
                    >
                      Activar
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Areas;