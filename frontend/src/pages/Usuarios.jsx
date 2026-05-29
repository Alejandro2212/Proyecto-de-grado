import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "RESIDENTE"
  });

  // =========================
  // CARGAR USUARIOS
  // =========================
  const cargarUsuarios = async () => {

    try {

      const res = await api.get("/usuarios");

      setUsuarios(res.data);

    } catch (error) {

      console.log(error);

      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {

    cargarUsuarios();

  }, []);

  // =========================
  // CAMBIAR ESTADO
  // =========================
  const cambiarEstado = async (id) => {

    try {

      await api.put(`/usuarios/${id}/estado`);

      toast.success("Estado actualizado");

      cargarUsuarios();

    } catch (error) {

      toast.error("Error al actualizar");
    }
  };

  // =========================
  // CAMBIAR ROL
  // =========================
  const cambiarRol = async (id, rol) => {

    try {

      await api.put(
        `/usuarios/${id}/rol?rol=${rol}`
      );

      toast.success("Rol actualizado");

      cargarUsuarios();

    } catch (error) {

      toast.error("Error al cambiar rol");
    }
  };

  // =========================
  // CREAR USUARIO
  // =========================
  const crearUsuario = async () => {

    if (
      !nuevoUsuario.nombre ||
      !nuevoUsuario.email ||
      !nuevoUsuario.password
    ) {

      toast.error("Completa todos los campos");

      return;
    }

    try {

      await api.post(
        "/usuarios",
        nuevoUsuario
      );

      toast.success("Usuario creado");

      setMostrarModal(false);

      setNuevoUsuario({
        nombre: "",
        email: "",
        password: "",
        rol: "RESIDENTE"
      });

      cargarUsuarios();

    } catch (error) {

      toast.error(
        error.response?.data ||
        "Error al crear usuario"
      );
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminarUsuario = async (id) => {

    const confirmar = window.confirm(
      "¿Eliminar usuario?"
    );

    if (!confirmar) return;

    try {

      await api.delete(`/usuarios/${id}`);

      toast.success("Usuario eliminado");

      cargarUsuarios();

    } catch (error) {

      toast.error("Error al eliminar");
    }
  };

  // =========================
  // FILTRADO
  // =========================
  const usuariosFiltrados = usuarios.filter((u) =>

    u.nombre.toLowerCase()
      .includes(busqueda.toLowerCase())

    ||

    u.email.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Panel Administrativo
        </h1>

        <button
          onClick={() => setMostrarModal(true)}
          className="
            bg-slate-900
            text-white
            px-5
            py-3
            rounded-lg
          "
        >
          + Nuevo Usuario
        </button>

      </div>

      {/* BUSCADOR */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          className="
            w-full
            border
            p-3
            rounded-lg
          "
        />

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Nombre
              </th>

              <th className="p-4 text-left">
                Correo
              </th>

              <th className="p-4 text-left">
                Rol
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

              <th className="p-4 text-left">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {usuariosFiltrados.map((u) => (

              <tr
                key={u.id}
                className="border-b hover:bg-slate-50"
              >

                {/* NOMBRE */}
                <td className="p-4 font-medium">
                  {u.nombre}
                </td>

                {/* EMAIL */}
                <td className="p-4">
                  {u.email}
                </td>

                {/* ROL */}
                <td className="p-4">

                  <select
                    value={u.rol?.nombre}
                    onChange={(e) =>
                      cambiarRol(
                        u.id,
                        e.target.value
                      )
                    }
                    className="
                      border
                      p-2
                      rounded-lg
                    "
                  >

                    <option value="ADMIN">
                      ADMIN
                    </option>

                    <option value="RESIDENTE">
                      RESIDENTE
                    </option>

                  </select>

                </td>

                {/* ESTADO */}
                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-white
                      text-sm
                      ${
                        u.activo
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    `}
                  >

                    {u.activo
                      ? "Activo"
                      : "Inactivo"}

                  </span>

                </td>

                {/* ACCIONES */}
                <td className="p-4 flex gap-2">

                  <button
                    onClick={() =>
                      cambiarEstado(u.id)
                    }
                    className={`
                      px-4
                      py-2
                      rounded-lg
                      text-white
                      ${
                        u.activo
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }
                    `}
                  >

                    {u.activo
                      ? "Desactivar"
                      : "Activar"}

                  </button>

                  <button
                    onClick={() =>
                      eliminarUsuario(u.id)
                    }
                    className="
                      bg-red-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {
        mostrarModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                bg-white
                p-8
                rounded-2xl
                w-[400px]
              "
            >

              <h2 className="text-2xl font-bold mb-6">
                Nuevo Usuario
              </h2>

              <div className="grid gap-4">

                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevoUsuario.nombre}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      nombre: e.target.value
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={nuevoUsuario.email}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      email: e.target.value
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={nuevoUsuario.password}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      password: e.target.value
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <select
                  value={nuevoUsuario.rol}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      rol: e.target.value
                    })
                  }
                  className="border p-3 rounded-lg"
                >

                  <option value="RESIDENTE">
                    RESIDENTE
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>

                </select>

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={crearUsuario}
                    className="
                      flex-1
                      bg-slate-900
                      text-white
                      p-3
                      rounded-lg
                    "
                  >
                    Crear
                  </button>

                  <button
                    onClick={() =>
                      setMostrarModal(false)
                    }
                    className="
                      flex-1
                      bg-gray-300
                      p-3
                      rounded-lg
                    "
                  >
                    Cancelar
                  </button>

                </div>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
}

export default Usuarios;