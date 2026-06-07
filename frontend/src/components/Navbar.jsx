import {
  Bell,
  User,
  KeyRound,
  LogOut
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePerfil from "../hooks/usePerfil";
import NotificationBell from "./NotificationBell";

export default function Navbar({ logout }) {

  const navigate = useNavigate();

    const {
      perfil,
      loading
    } = usePerfil();

  const rol =
    localStorage.getItem("rol");

  const [menuAbierto,
    setMenuAbierto] =
    useState(false);

  // =========================
  // INICIALES AVATAR
  // =========================
  const obtenerIniciales = () => {

    if (!perfil) return "?";

    const nombre =
      perfil.nombre || "";

    const apellido =
      perfil.apellido || "";

    return (
      nombre.charAt(0) +
      apellido.charAt(0)
    ).toUpperCase();
  };

  return (

    <div
      className="
        bg-white
        shadow
        rounded-2xl
        px-6
        py-4
        flex
        justify-between
        items-center
        mb-6
      "
    >

      {/* IZQUIERDA */}
      <div>

        <h2 className="text-2xl font-bold">

          Bienvenido

          {
            perfil
              ? ` ${perfil.nombre}`
              : ""
          }

        </h2>

        <p className="text-gray-500">
          Sistema de Gestión Inteligente
        </p>

      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-5">

        {/* CAMPANA */}
        <NotificationBell />

        {/* USUARIO */}
        <div className="relative">

          <button
            onClick={() =>
              setMenuAbierto(
                !menuAbierto
              )
            }
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* AVATAR */}
            <div
              className="
                w-11
                h-11
                rounded-full
                bg-slate-900
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-sm
              "
            >

              {obtenerIniciales()}

            </div>

            <div className="text-left">

              <p className="font-bold">

                {
                  perfil
                    ? `${perfil.nombre} ${perfil.apellido}`
                    : "Cargando..."
                }

              </p>

              <p className="text-sm text-gray-500">
                {rol}
              </p>

            </div>

          </button>

          {
            menuAbierto && (

              <div
                className="
                  absolute
                  right-0
                  top-14
                  bg-white
                  shadow-xl
                  rounded-2xl
                  w-72
                  overflow-hidden
                  z-50
                "
              >

                {/* CABECERA */}
                <div
                  className="
                    p-5
                    border-b
                    bg-slate-50
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-slate-900
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >

                      {obtenerIniciales()}

                    </div>

                    <div>

                      <h3 className="font-bold">

                        {
                          perfil
                            ? `${perfil.nombre} ${perfil.apellido}`
                            : "Usuario"
                        }

                      </h3>

                      <p className="text-sm text-gray-500">

                        {
                          perfil
                            ? perfil.email
                            : ""
                        }

                      </p>

                      <p className="text-xs text-slate-500">

                        {rol}

                      </p>

                    </div>

                  </div>

                </div>

                {/* PERFIL */}
                <button
                  onClick={() => {
                    navigate("/perfil");
                    setMenuAbierto(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-4
                    hover:bg-slate-100
                  "
                >

                  <User size={18} />

                  Mi Perfil

                </button>

                {/* PASSWORD */}
                <button
                  onClick={() => {
                    navigate(
                      "/cambiar-password"
                    );

                    setMenuAbierto(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-4
                    hover:bg-slate-100
                  "
                >

                  <KeyRound size={18} />

                  Cambiar Contraseña

                </button>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-4
                    text-red-600
                    hover:bg-red-50
                  "
                >

                  <LogOut size={18} />

                  Cerrar Sesión

                </button>

              </div>

            )
          }

        </div>

      </div>

    </div>
  );
}