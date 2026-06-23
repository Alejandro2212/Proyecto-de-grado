import { useState } from "react";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  cambiarPassword
} from "../services/passwordService";

export default function ResetPassword() {

  const navigate =
    useNavigate();

  const [params] =
    useSearchParams();

  const token =
    params.get("token");

  const [password,
    setPassword] =
    useState("");

  const [confirmar,
    setConfirmar] =
    useState("");

  const guardar = async () => {

    if (!password) {

      toast.error(
        "Ingrese contraseña"
      );

      return;
    }

    if (password !== confirmar) {

      toast.error(
        "Las contraseñas no coinciden"
      );

      return;
    }

    try {

      await cambiarPassword(
        token,
        password
      );

      toast.success(
        "Contraseña actualizada"
      );

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (error) {

      toast.error(
        error.response?.data ||
        "Error al actualizar contraseña"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">

          Nueva Contraseña

        </h1>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          className="
            border
            p-3
            rounded-xl
            w-full
            mb-4
          "
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e)=>
            setConfirmar(
              e.target.value
            )
          }
          className="
            border
            p-3
            rounded-xl
            w-full
          "
        />

        <button
          onClick={guardar}
          className="
            mt-5
            w-full
            bg-green-600
            text-white
            p-3
            rounded-xl
            font-bold
          "
        >

          Guardar contraseña

        </button>

      </div>

    </div>
  );
}