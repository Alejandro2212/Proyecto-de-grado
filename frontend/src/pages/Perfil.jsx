import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Perfil() {

  const [perfil,
    setPerfil] = useState({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      ci: "",
      rol: ""
    });

  const cargarPerfil =
    async () => {

      try {

        const res =
          await api.get(
            "/perfil"
          );

        setPerfil(res.data);

      } catch {

        toast.error(
          "Error al cargar perfil"
        );
      }
    };

  useEffect(() => {

    cargarPerfil();

  }, []);

  const guardar =
    async () => {

      try {

        await api.put(
          "/perfil",
          {
            nombre:
              perfil.nombre,

            apellido:
              perfil.apellido,

            telefono:
              perfil.telefono,

            ci:
              perfil.ci
          }
        );

        toast.success(
          "Perfil actualizado"
        );

      } catch {

        toast.error(
          "Error al guardar"
        );
      }
    };

  return (

    <div className="p-6">

      <div
        className="
          bg-white
          rounded-3xl
          shadow
          p-8
          max-w-4xl
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Mi Perfil
        </h1>

        <div
          className="
            grid
            md:grid-cols-2
            gap-5
          "
        >

          <input
            value={perfil.nombre}
            onChange={(e)=>
              setPerfil({
                ...perfil,
                nombre:
                e.target.value
              })
            }
            placeholder="Nombre"
            className="border p-3 rounded-xl"
          />

          <input
            value={perfil.apellido}
            onChange={(e)=>
              setPerfil({
                ...perfil,
                apellido:
                e.target.value
              })
            }
            placeholder="Apellido"
            className="border p-3 rounded-xl"
          />

          <input
            value={perfil.telefono}
            onChange={(e)=>
              setPerfil({
                ...perfil,
                telefono:
                e.target.value
              })
            }
            placeholder="Teléfono"
            className="border p-3 rounded-xl"
          />

          <input
            value={perfil.ci}
            onChange={(e)=>
              setPerfil({
                ...perfil,
                ci:
                e.target.value
              })
            }
            placeholder="CI"
            className="border p-3 rounded-xl"
          />

          <input
            value={perfil.email}
            disabled
            className="
              border
              p-3
              rounded-xl
              bg-gray-100
            "
          />

          <input
            value={perfil.rol}
            disabled
            className="
              border
              p-3
              rounded-xl
              bg-gray-100
            "
          />

        </div>

        <button
          onClick={guardar}
          className="
            mt-6
            bg-slate-900
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Guardar Cambios
        </button>

      </div>

    </div>
  );
}