import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  UserCircle2,
  Mail,
  Shield,
  Phone,
  CreditCard,
  User
} from "lucide-react";

export default function Perfil() {

  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    ci: "",
    rol: ""
  });

  const cargarPerfil = async () => {

    try {

      const res =
        await api.get("/perfil");

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

  const guardar = async () => {

    try {

      await api.put(
        "/perfil",
        {
          nombre: perfil.nombre,
          apellido: perfil.apellido,
          telefono: perfil.telefono,
          ci: perfil.ci
        }
      );

      toast.success(
        "Perfil actualizado correctamente"
      );

    } catch {

      toast.error(
        "Error al guardar"
      );
    }
  };

  return (

    <div className="p-6 max-w-7xl mx-auto">

      {/* BOTÓN VOLVER */}

      <button
        onClick={() => navigate(-1)}
        className="
          flex
          items-center
          gap-2
          mb-6
          text-blue-600
          hover:text-blue-800
          font-semibold
        "
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      {/* CABECERA */}

      <div
        className="
          bg-gradient-to-r
          from-slate-900
          to-slate-700
          text-white
          rounded-3xl
          p-8
          shadow-xl
          mb-8
        "
      >

        <div className="flex items-center gap-6">

          <UserCircle2 size={90} />

          <div>

            <h1 className="text-4xl font-bold">

              {perfil.nombre} {perfil.apellido}

            </h1>

            <p className="text-slate-300 mt-2">
              {perfil.email}
            </p>

            <span
              className="
                inline-block
                mt-4
                bg-white/20
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
              "
            >
              {perfil.rol}
            </span>

          </div>

        </div>

      </div>

      {/* ESTADÍSTICAS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-8
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow
            p-6
          "
        >
          <h3 className="text-gray-500">
            Estado
          </h3>

          <p className="text-2xl font-bold text-green-600 mt-2">
            Activo
          </p>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            shadow
            p-6
          "
        >
          <h3 className="text-gray-500">
            Rol
          </h3>

          <p className="text-2xl font-bold mt-2">
            {perfil.rol}
          </p>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            shadow
            p-6
          "
        >
          <h3 className="text-gray-500">
            Cuenta
          </h3>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            Verificada
          </p>
        </div>

      </div>

      {/* FORMULARIO */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          p-8
        "
      >

        {/* DATOS PERSONALES */}

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Información Personal
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            gap-6
          "
        >

          <div>

            <label className="font-medium text-gray-600">
              Nombre
            </label>

            <div className="relative mt-2">

              <User
                size={18}
                className="
                  absolute
                  left-3
                  top-4
                  text-gray-400
                "
              />

              <input
                value={perfil.nombre}
                onChange={(e) =>
                  setPerfil({
                    ...perfil,
                    nombre: e.target.value
                  })
                }
                className="
                  w-full
                  border
                  rounded-xl
                  pl-10
                  p-3
                "
              />

            </div>

          </div>

          <div>

            <label className="font-medium text-gray-600">
              Apellido
            </label>

            <input
              value={perfil.apellido}
              onChange={(e) =>
                setPerfil({
                  ...perfil,
                  apellido: e.target.value
                })
              }
              className="
                w-full
                border
                rounded-xl
                p-3
                mt-2
              "
            />

          </div>

          <div>

            <label className="font-medium text-gray-600">
              Teléfono
            </label>

            <div className="relative mt-2">

              <Phone
                size={18}
                className="
                  absolute
                  left-3
                  top-4
                  text-gray-400
                "
              />

              <input
                value={perfil.telefono}
                onChange={(e) =>
                  setPerfil({
                    ...perfil,
                    telefono: e.target.value
                  })
                }
                className="
                  w-full
                  border
                  rounded-xl
                  pl-10
                  p-3
                "
              />

            </div>

          </div>

          <div>

            <label className="font-medium text-gray-600">
              Carnet de Identidad
            </label>

            <div className="relative mt-2">

              <CreditCard
                size={18}
                className="
                  absolute
                  left-3
                  top-4
                  text-gray-400
                "
              />

              <input
                value={perfil.ci}
                onChange={(e) =>
                  setPerfil({
                    ...perfil,
                    ci: e.target.value
                  })
                }
                className="
                  w-full
                  border
                  rounded-xl
                  pl-10
                  p-3
                "
              />

            </div>

          </div>

        </div>

        {/* CUENTA */}

        <h2
          className="
            text-2xl
            font-bold
            mt-10
            mb-6
          "
        >
          Información de Cuenta
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            gap-6
          "
        >

          <div>

            <label className="font-medium text-gray-600">
              Correo Electrónico
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="
                  absolute
                  left-3
                  top-4
                  text-gray-400
                "
              />

              <input
                value={perfil.email}
                disabled
                className="
                  w-full
                  border
                  rounded-xl
                  pl-10
                  p-3
                  bg-gray-100
                "
              />

            </div>

          </div>

          <div>

            <label className="font-medium text-gray-600">
              Rol
            </label>

            <div className="relative mt-2">

              <Shield
                size={18}
                className="
                  absolute
                  left-3
                  top-4
                  text-gray-400
                "
              />

              <input
                value={perfil.rol}
                disabled
                className="
                  w-full
                  border
                  rounded-xl
                  pl-10
                  p-3
                  bg-gray-100
                "
              />

            </div>

          </div>

        </div>

        {/* BOTÓN */}

        <button
          onClick={guardar}
          className="
            mt-8
            bg-slate-900
            hover:bg-slate-800
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Guardar Cambios
        </button>

      </div>

    </div>
  );
}