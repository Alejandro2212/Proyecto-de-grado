import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CambiarPassword() {

  const [passwordActual,
    setPasswordActual] = useState("");

  const [passwordNueva,
    setPasswordNueva] = useState("");

  const [confirmacion,
    setConfirmacion] = useState("");

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
        "Contraseña actualizada"
      );

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmacion("");

    } catch (error) {

      toast.error(
        error.response?.data ||
        "Error al actualizar"
      );
    }
  };

  return (

    <div className="p-6">

      <div
        className="
          bg-white
          p-8
          rounded-3xl
          shadow
          max-w-2xl
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Cambiar Contraseña
        </h1>

        <div className="grid gap-4">

          <input
            type="password"
            placeholder="Contraseña actual"
            value={passwordActual}
            onChange={(e)=>
              setPasswordActual(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={passwordNueva}
            onChange={(e)=>
              setPasswordNueva(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmacion}
            onChange={(e)=>
              setConfirmacion(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-xl
            "
          />

          <button
            onClick={guardar}
            className="
              mt-4
              bg-slate-900
              text-white
              py-3
              rounded-xl
            "
          >
            Actualizar Contraseña
          </button>

        </div>

      </div>

    </div>
  );
}