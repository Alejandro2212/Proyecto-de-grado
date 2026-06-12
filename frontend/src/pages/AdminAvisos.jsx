import { useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminAvisos({ logout }) {

  const [titulo, setTitulo] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [tipo, setTipo] =
    useState("AVISO");

  const [respuesta, setRespuesta] =
    useState("");

  const enviarAviso =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/notificaciones/general",
          {
            titulo,
            mensaje,
            tipo
          }
        );

        setRespuesta(
          "Aviso enviado correctamente"
        );

        setTitulo("");
        setMensaje("");
        setTipo("AVISO");

      } catch (error) {

        console.error(error);

        setRespuesta(
          "Error al enviar aviso"
        );
      }
    };

  return (

    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <Sidebar logout={logout} />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE */}
        <div className="p-8">

          <div
            className="
              max-w-5xl
              mx-auto
            "
          >

            <div className="mb-8">

              <h1
                className="
                  text-4xl
                  font-bold
                  text-slate-800
                "
              >
                Centro Administrativo de Avisos
              </h1>

              <p className="text-slate-500 mt-2">
                Envíe comunicados oficiales a todos los residentes del condominio.
              </p>

            </div>

            <div
              className="
                bg-white
                rounded-3xl
                shadow-xl
                p-8
              "
            >

              <form
                onSubmit={enviarAviso}
                className="space-y-6"
              >

                {/* TITULO */}
                <div>

                  <label
                    className="
                      block
                      font-semibold
                      mb-2
                    "
                  >
                    Título
                  </label>

                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) =>
                      setTitulo(e.target.value)
                    }
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      p-4
                      focus:ring-2
                      focus:ring-slate-700
                    "
                    placeholder="Ingrese un título..."
                    required
                  />

                </div>

                {/* TIPO */}
                <div>

                  <label
                    className="
                      block
                      font-semibold
                      mb-2
                    "
                  >
                    Tipo
                  </label>

                  <select
                    value={tipo}
                    onChange={(e) =>
                      setTipo(e.target.value)
                    }
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      p-4
                    "
                  >

                    <option value="AVISO">
                      Aviso General
                    </option>

                    <option value="MANTENIMIENTO">
                      Mantenimiento
                    </option>

                    <option value="REUNION">
                      Reunión
                    </option>

                    <option value="EMERGENCIA">
                      Emergencia
                    </option>

                  </select>

                </div>

                {/* MENSAJE */}
                <div>

                  <label
                    className="
                      block
                      font-semibold
                      mb-2
                    "
                  >
                    Mensaje
                  </label>

                  <textarea
                    rows="8"
                    value={mensaje}
                    onChange={(e) =>
                      setMensaje(e.target.value)
                    }
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      p-4
                    "
                    placeholder="Escriba el aviso..."
                    required
                  />

                </div>

                {/* BOTON */}
                <button
                  type="submit"
                  className="
                    bg-slate-900
                    hover:bg-slate-700
                    text-white
                    px-8
                    py-4
                    rounded-xl
                    font-semibold
                    shadow-lg
                  "
                >
                  Enviar Aviso General
                </button>

              </form>

              {respuesta && (

                <div
                  className="
                    mt-6
                    bg-green-100
                    text-green-700
                    p-4
                    rounded-xl
                    font-medium
                  "
                >
                  {respuesta}
                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminAvisos;