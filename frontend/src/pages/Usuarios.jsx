import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function Usuarios() {

  const [usuarios, setUsuarios] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [mostrarModal,
    setMostrarModal] =
    useState(false);

  const [nuevoUsuario,
    setNuevoUsuario] = useState({
      nombre: "",
      apellido: "",
      ci: "",
      telefono: "",
      email: "",
      password: "",
      rol: "RESIDENTE"
  });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // CARGAR USUARIOS
  // =========================
  const cargarUsuarios = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/usuarios");

      setUsuarios(res.data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al cargar usuarios"
      );

    } finally {

      setLoading(false);
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

      await api.put(
        `/usuarios/${id}/estado`
      );

      toast.success(
        "Estado actualizado"
      );

      cargarUsuarios();

    } catch (error) {

      toast.error(
        "Error al actualizar"
      );
    }
  };

  // =========================
  // CAMBIAR ROL
  // =========================
  const cambiarRol = async (
    id,
    rol
  ) => {

    try {

      await api.put(
        `/usuarios/${id}/rol?rol=${rol}`
      );

      toast.success(
        "Rol actualizado"
      );

      cargarUsuarios();

    } catch (error) {

      toast.error(
        "Error al cambiar rol"
      );
    }
  };

  // =========================
  // CREAR USUARIO
  // =========================
  const crearUsuario = async () => {

    if (
      !nuevoUsuario.nombre ||
      !nuevoUsuario.apellido ||
      !nuevoUsuario.ci ||
      !nuevoUsuario.telefono ||
      !nuevoUsuario.email ||
      !nuevoUsuario.password
    ) {

      toast.error(
        "Completa todos los campos"
      );

      return;
    }

    try {

      await api.post(
        "/usuarios",
        nuevoUsuario
      );

      toast.success(
        "Usuario creado"
      );

      setMostrarModal(false);

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        ci: "",
        telefono: "",
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

    const confirm =
      await Swal.fire({

        title:
          "¿Eliminar usuario?",

        text:
          "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Sí, eliminar",

        cancelButtonText:
          "Cancelar"
      });

    if (!confirm.isConfirmed) return;

    try {

      await api.delete(
        `/usuarios/${id}`
      );

      toast.success(
        "Usuario eliminado"
      );

      cargarUsuarios();

    } catch (error) {

      toast.error(
        "Error al eliminar"
      );
    }
  };

  // =========================
  // FILTRAR
  // =========================
    const usuariosFiltrados =
      usuarios.filter((u) => {

        const texto =
          busqueda.toLowerCase();

        return (
          `${u.nombre} ${u.apellido}`
            .toLowerCase()
            .includes(texto)

          ||

          u.email
            .toLowerCase()
            .includes(texto)

          ||

          (u.ci || "")
            .toLowerCase()
            .includes(texto)
        );
      });

  return (

    <div className="p-6">

      {/* HEADER */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >

        <div>

          <h1 className="text-4xl font-bold">
            Gestión de Usuarios
          </h1>

          <p className="text-gray-500 mt-2">
            Administración completa del sistema
          </p>

        </div>

        <button
          onClick={() =>
            setMostrarModal(true)
          }
          className="
            bg-slate-900
            hover:bg-slate-700
            text-white
            px-6
            py-3
            rounded-xl
            shadow-lg
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
            setBusqueda(
              e.target.value
            )
          }
          className="
            w-full
            border
            p-4
            rounded-2xl
            shadow-sm
          "
        />

      </div>

      {/* TABLA */}
      <div
        className="
          bg-white
          rounded-3xl
          shadow
          overflow-hidden
        "
      >

        {

          loading ? (

            <div className="p-10 text-center">

              <h2 className="text-2xl font-bold">
                Cargando usuarios...
              </h2>

            </div>

          ) : (

            <table className="w-full">

              <thead
                className="
                  bg-slate-900
                  text-white
                "
              >

                <tr>

                  <th className="p-4 text-left">
                    Nombre Completo
                  </th>

                  <th className="p-4 text-left">
                    CI
                  </th>

                  <th className="p-4 text-left">
                    Teléfono
                  </th>

                  <th className="p-4 text-left">
                    Correo
                  </th>

                  <th className="p-4 text-left">
                    Fecha Registro
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

                {

                  usuariosFiltrados.map((u) => (

                    <tr
                      key={u.id}
                      className="
                        border-b
                        hover:bg-slate-50
                      "
                    >

                      {/* NOMBRE */}
                  <td className="p-4 font-semibold">
                    {u.nombre} {u.apellido}
                  </td>

                  <td className="p-4">
                    {u.ci}
                  </td>

                  <td className="p-4">
                    {u.telefono}
                  </td>

                  <td className="p-4">
                    {u.email}
                  </td>

                  <td className="p-4">
                    {
                      u.fechaRegistro
                        ? new Date(
                            u.fechaRegistro
                          ).toLocaleDateString()
                        : "-"
                    }
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
                            rounded-xl
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
                            font-bold

                            ${
                              u.activo
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          `}
                        >

                          {
                            u.activo
                              ? "Activo"
                              : "Inactivo"
                          }

                        </span>

                      </td>

                      {/* ACCIONES */}
                      <td className="p-4 flex gap-2">

                        <button
                          onClick={() =>
                            cambiarEstado(
                              u.id
                            )
                          }
                          className={`
                            px-4
                            py-2
                            rounded-xl
                            text-white

                            ${
                              u.activo
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }
                          `}
                        >

                          {
                            u.activo
                              ? "Desactivar"
                              : "Activar"
                          }

                        </button>

                        <button
                          onClick={() =>
                            eliminarUsuario(
                              u.id
                            )
                          }
                          className="
                            bg-red-600
                            text-white
                            px-4
                            py-2
                            rounded-xl
                          "
                        >

                          Eliminar

                        </button>

                      </td>

                    </tr>

                  ))
                }

              </tbody>

            </table>

          )
        }

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
              z-50
            "
          >

            <div
              className="
                bg-white
                p-8
                rounded-3xl
                w-[450px]
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  mb-6
                "
              >

                Nuevo Usuario

              </h2>

              <div className="grid gap-4">

                <input
                  type="text"
                  placeholder="Nombre"
                  value={
                    nuevoUsuario.nombre
                  }
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      nombre:
                        e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <input
                  type="text"
                  placeholder="Apellido"
                  value={nuevoUsuario.apellido}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      apellido: e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <input
                  type="text"
                  placeholder="CI"
                  value={nuevoUsuario.ci}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      ci: e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <input
                  type="text"
                  placeholder="Teléfono"
                  value={nuevoUsuario.telefono}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      telefono: e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={
                    nuevoUsuario.email
                  }
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      email:
                        e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={
                    nuevoUsuario.password
                  }
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      password:
                        e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                />

                <select
                  value={
                    nuevoUsuario.rol
                  }
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      rol:
                        e.target.value
                    })
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                  "
                >

                  <option value="RESIDENTE">
                    RESIDENTE
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>

                </select>

                <div
                  className="
                    flex
                    gap-3
                    mt-4
                  "
                >

                  <button
                    onClick={
                      crearUsuario
                    }
                    className="
                      flex-1
                      bg-slate-900
                      text-white
                      p-3
                      rounded-xl
                    "
                  >

                    Crear

                  </button>

                  <button
                    onClick={() =>
                      setMostrarModal(
                        false
                      )
                    }
                    className="
                      flex-1
                      bg-gray-300
                      p-3
                      rounded-xl
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