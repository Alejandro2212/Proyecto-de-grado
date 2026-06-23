import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import toast from "react-hot-toast";

import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound
} from "lucide-react";

export default function CambiarPassword() {

  const navigate = useNavigate();

  const [passwordActual,
    setPasswordActual] = useState("");

  const [passwordNueva,
    setPasswordNueva] = useState("");

  const [confirmacion,
    setConfirmacion] = useState("");

  const [mostrarActual,
    setMostrarActual] = useState(false);

  const [mostrarNueva,
    setMostrarNueva] = useState(false);

  const [mostrarConfirmacion,
    setMostrarConfirmacion] = useState(false);

  const guardar = async () => {

    if (
      passwordNueva !== confirmacion
    ) {

      toast.error(
        "Las contraseñas no coinciden"
      );

      return;
    }

    try {

      await api.put(
        "/perfil/password",
        {
          passwordActual,
          passwordNueva
        }
      );

      toast.success(
        "Contraseña actualizada correctamente"
      );

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmacion("");

    } catch (error) {

      toast.error(
        error.response?.data ||
        "Error al actualizar contraseña"
      );
    }
  };

  const obtenerNivelSeguridad = () => {

    if (passwordNueva.length < 6)
      return {
        texto: "Débil",
        color: "bg-red-500",
        ancho: "w-1/4"
      };

    if (passwordNueva.length < 10)
      return {
        texto: "Media",
        color: "bg-yellow-500",
        ancho: "w-2/4"
      };

    return {
      texto: "Fuerte",
      color: "bg-green-500",
      ancho: "w-full"
    };
  };

  const seguridad =
    obtenerNivelSeguridad();

  return (

    <div className="p-6">

      {/* BOTON VOLVER */}

      <button
        onClick={() => navigate(-1)}
        className="
          flex
          items-center
          gap-2
          mb-6
          text-slate-700
          hover:text-slate-900
          font-medium
        "
      >
        <ArrowLeft size={20}/>
        Volver
      </button>

      <div
        className="
          max-w-3xl
          mx-auto
        "
      >

        {/* HEADER */}

        <div
          className="
            bg-gradient-to-r
            from-slate-900
            to-slate-700
            text-white
            rounded-3xl
            p-8
            shadow-xl
            mb-6
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                bg-white/20
                p-4
                rounded-2xl
              "
            >
              <ShieldCheck size={40}/>
            </div>

            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                "
              >
                Seguridad de Cuenta
              </h1>

              <p
                className="
                  text-slate-300
                  mt-2
                "
              >
                Mantén tu cuenta protegida
                actualizando tu contraseña
                periódicamente.
              </p>

            </div>

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

          <div className="space-y-5">

            {/* PASSWORD ACTUAL */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                "
              >
                Contraseña Actual
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-4
                    text-gray-400
                  "
                />

                <input
                  type={
                    mostrarActual
                      ? "text"
                      : "password"
                  }
                  value={passwordActual}
                  onChange={(e)=>
                    setPasswordActual(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-xl
                    pl-12
                    pr-12
                    py-3
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarActual(
                      !mostrarActual
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-4
                  "
                >
                  {
                    mostrarActual
                    ? <EyeOff size={18}/>
                    : <Eye size={18}/>
                  }
                </button>

              </div>

            </div>

            {/* NUEVA PASSWORD */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                "
              >
                Nueva Contraseña
              </label>

              <div className="relative">

                <KeyRound
                  size={18}
                  className="
                    absolute
                    left-4
                    top-4
                    text-gray-400
                  "
                />

                <input
                  type={
                    mostrarNueva
                      ? "text"
                      : "password"
                  }
                  value={passwordNueva}
                  onChange={(e)=>
                    setPasswordNueva(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-xl
                    pl-12
                    pr-12
                    py-3
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarNueva(
                      !mostrarNueva
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-4
                  "
                >
                  {
                    mostrarNueva
                    ? <EyeOff size={18}/>
                    : <Eye size={18}/>
                  }
                </button>

              </div>

              {/* BARRA SEGURIDAD */}

              {
                passwordNueva && (

                  <div className="mt-3">

                    <div
                      className="
                        h-2
                        bg-gray-200
                        rounded-full
                        overflow-hidden
                      "
                    >
                      <div
                        className={`
                          h-full
                          ${seguridad.color}
                          ${seguridad.ancho}
                        `}
                      />
                    </div>

                    <p
                      className="
                        text-sm
                        mt-2
                        font-medium
                      "
                    >
                      Seguridad:
                      {" "}
                      {seguridad.texto}
                    </p>

                  </div>

                )
              }

            </div>

            {/* CONFIRMAR */}

            <div>

              <label
                className="
                  block
                  mb-2
                  font-medium
                "
              >
                Confirmar Contraseña
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-4
                    text-gray-400
                  "
                />

                <input
                  type={
                    mostrarConfirmacion
                      ? "text"
                      : "password"
                  }
                  value={confirmacion}
                  onChange={(e)=>
                    setConfirmacion(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-xl
                    pl-12
                    pr-12
                    py-3
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmacion(
                      !mostrarConfirmacion
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-4
                  "
                >
                  {
                    mostrarConfirmacion
                    ? <EyeOff size={18}/>
                    : <Eye size={18}/>
                  }
                </button>

              </div>

            </div>

            {/* RECOMENDACIONES */}

            <div
              className="
                bg-blue-50
                border
                border-blue-200
                rounded-2xl
                p-4
              "
            >

              <h3
                className="
                  font-semibold
                  mb-2
                "
              >
                Recomendaciones
              </h3>

              <ul
                className="
                  text-sm
                  text-gray-600
                  space-y-1
                "
              >
                <li>• Utiliza mínimo 8 caracteres.</li>
                <li>• Combina letras y números.</li>
                <li>• Evita datos personales.</li>
                <li>• Actualízala periódicamente.</li>
              </ul>

            </div>

            {/* BOTON */}

            <button
              onClick={guardar}
              className="
                w-full
                bg-slate-900
                hover:bg-slate-800
                text-white
                py-4
                rounded-2xl
                font-semibold
                transition
              "
            >
              Actualizar Contraseña
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}