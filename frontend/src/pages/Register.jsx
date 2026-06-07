import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
    email: "",
    password: ""
  });

  const registrar = async () => {

    try {

      await api.post(
        "/auth/register",
        form
      );

      toast.success(
        "Usuario registrado correctamente"
      );

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Error al registrarse"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[500px]">

        <h1 className="text-3xl font-bold text-center mb-6">

          Registro de Residente

        </h1>

        <div className="space-y-3">

          <input
            placeholder="Nombre"
            className="w-full border p-3 rounded-xl"
            value={form.nombre}
            onChange={(e)=>
              setForm({
                ...form,
                nombre:e.target.value
              })
            }
          />

          <input
            placeholder="Apellido"
            className="w-full border p-3 rounded-xl"
            value={form.apellido}
            onChange={(e)=>
              setForm({
                ...form,
                apellido:e.target.value
              })
            }
          />

          <input
            placeholder="CI"
            className="w-full border p-3 rounded-xl"
            value={form.ci}
            onChange={(e)=>
              setForm({
                ...form,
                ci:e.target.value
              })
            }
          />

          <input
            placeholder="Teléfono"
            className="w-full border p-3 rounded-xl"
            value={form.telefono}
            onChange={(e)=>
              setForm({
                ...form,
                telefono:e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Correo"
            className="w-full border p-3 rounded-xl"
            value={form.email}
            onChange={(e)=>
              setForm({
                ...form,
                email:e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-3 rounded-xl"
            value={form.password}
            onChange={(e)=>
              setForm({
                ...form,
                password:e.target.value
              })
            }
          />

          <button
            onClick={registrar}
            className="
              w-full
              bg-slate-900
              text-white
              p-3
              rounded-xl
            "
          >
            Registrarse
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              w-full
              bg-gray-300
              p-3
              rounded-xl
            "
          >
            Volver al Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;