import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Building2,
  ShieldCheck
} from "lucide-react";

function Login({
  email,
  setEmail,
  password,
  setPassword,
  mensaje,
  login
}) {

  const [showPassword, setShowPassword] =
    useState(false);

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-slate-950
        px-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-md
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            bg-slate-900
            text-white
            p-8
            text-center
          "
        >

          <div
            className="
              flex
              justify-center
              mb-4
            "
          >

            <div
              className="
                bg-white/10
                p-4
                rounded-full
              "
            >

              <Building2 size={42} />

            </div>

          </div>

          <h1 className="text-3xl font-bold">

            Condominio Horizonte

          </h1>

          <p className="text-slate-300 mt-2">

            Sistema Inteligente de Reservas

          </p>

        </div>

        {/* FORM */}
        <div className="p-8">

          <div className="space-y-5">

            {/* EMAIL */}
            <div>

              <label className="text-sm font-semibold text-slate-600">
                Correo Electrónico
              </label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  border
                  border-slate-300
                  p-3
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-700
                "
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-sm font-semibold text-slate-600">
                Contraseña
              </label>

              <div className="relative mt-2">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="********"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    w-full
                    border
                    border-slate-300
                    p-3
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-700
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-3.5
                    text-slate-500
                  "
                >

                  {
                    showPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }

                </button>

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={login}
              className="
                w-full
                bg-slate-900
                hover:bg-slate-700
                transition
                text-white
                py-3
                rounded-xl
                font-bold
                shadow-lg
              "
            >

              Iniciar Sesión

            </button>

            <div className="text-center mt-4">
              <span className="text-gray-500">
                ¿No tienes una cuenta?
              </span>
              <Link
                to="/register"
                className="text-blue-600 font-semibold"
              >
                Regístrate
              </Link>
            </div>

            {/* MENSAJE */}
            {

              mensaje && (

                <div
                  className="
                    bg-red-100
                    text-red-700
                    p-3
                    rounded-xl
                    text-center
                    font-medium
                  "
                >

                  {mensaje}

                </div>

              )
            }

          </div>

          {/* FOOTER */}
          <div
            className="
              mt-8
              flex
              items-center
              justify-center
              gap-2
              text-slate-500
              text-sm
            "
          >

            <ShieldCheck size={16} />

            <span>
              Plataforma segura y protegida
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;