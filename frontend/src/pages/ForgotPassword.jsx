import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  solicitarRecuperacion
} from "../services/passwordService";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const enviar = async () => {

    if (!email) {

      toast.error(
        "Ingrese un correo"
      );

      return;
    }

    try {

      setLoading(true);

      await solicitarRecuperacion(
        email
      );

      toast.success(
        "Se envió un enlace de recuperación"
      );

      setEmail("");

    } catch (error) {

      toast.error(
        error.response?.data ||
        "Error al enviar correo"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-4">

          Recuperar Contraseña

        </h1>

        <p className="text-gray-500 mb-6">

          Introduce tu correo electrónico.

        </p>

        <input
          type="email"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
          placeholder="correo@ejemplo.com"
          className="
            border
            p-3
            rounded-xl
            w-full
          "
        />

        <button
          onClick={enviar}
          disabled={loading}
          className="
            mt-5
            w-full
            bg-slate-900
            text-white
            p-3
            rounded-xl
            font-bold
          "
        >

          {
            loading
              ? "Enviando..."
              : "Enviar enlace"
          }

        </button>

        <Link
          to="/login"
          className="
            block
            text-center
            mt-5
            text-blue-600
          "
        >
          Volver al Login
        </Link>

      </div>

    </div>
  );
}