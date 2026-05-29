import { Link } from "react-router-dom";

function Sidebar({ logout }) {

  const rol = localStorage.getItem("rol");

  return (

    <div
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        p-5
      "
    >

      <h1 className="text-2xl font-bold mb-10">
        Condominio
      </h1>

      <div className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="
            hover:bg-slate-700
            p-3
            rounded-lg
          "
        >
          Dashboard
        </Link>

        <Link
          to="/reservas"
          className="
            hover:bg-slate-700
            p-3
            rounded-lg
          "
        >
          Reservas
        </Link>

        <Link
          to="/calendario"
          className="
            hover:bg-slate-700
            p-3
            rounded-lg
          "
        >
          Calendario
        </Link>

        {/* SOLO ADMIN */}
        {rol === "ADMIN" && (
          <Link to="/usuarios" className="hover:bg-slate-700 p-3 rounded-lg">
            Panel Admin
          </Link>
        )}

        {rol === "ADMIN" && (
          <Link
            to="/auditoria"
            className="hover:bg-slate-700 p-3 rounded-lg"
          >
            Auditoría
          </Link>
        )}

        {rol === "ADMIN" && (
          <Link
            to="/gestion-reservas"
            className="hover:bg-slate-700 p-3 rounded-lg"
          >
            Gestión Reservas
          </Link>
        )}

        <button
          onClick={logout}
          className="
            bg-red-500
            mt-10
            p-3
            rounded-lg
          "
        >
          Cerrar Sesión
        </button>

        {/* DISPONIBILIDAD */}
        <Link
          to="/disponibilidad"
          className="
            hover:bg-slate-700
            p-3
            rounded-lg
          "
        >
          Disponibilidad
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;