import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  ShieldCheck,
  FileSearch,
  BrainCircuit,
  Building2,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { FileText } from "lucide-react";

function Sidebar({ logout }) {

  const rol = localStorage.getItem("rol");

  const linkClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      p-3
      rounded-xl
      transition
      duration-200
      ${
        isActive
          ? "bg-slate-700 text-white"
          : "hover:bg-slate-800 text-slate-300"
      }
    `;

  return (

    <div
      className="
        w-72
        min-h-screen
        bg-slate-950
        text-white
        flex
        flex-col
        justify-between
        shadow-2xl
      "
    >

      <div>

        {/* LOGO */}
        <div className="p-6 border-b border-slate-800">

          <h1 className="text-3xl font-bold">
            Horizonte
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Sistema Inteligente
          </p>

        </div>

        {/* MENU */}
        <div className="p-4 flex flex-col gap-2">

          <NavLink
            to="/dashboard"
            className={linkClass}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/reservas"
            className={linkClass}
          >
            <ClipboardList size={20} />
            Reservas
          </NavLink>

          <NavLink
            to="/mis-reservas"
            className={linkClass}
          >
            <ClipboardCheck size={20} />
            Mis Reservas
          </NavLink>

          <NavLink
            to="/calendario"
            className={linkClass}
          >
            <CalendarDays size={20} />
            Calendario
          </NavLink>

          <NavLink
            to="/disponibilidad"
            className={linkClass}
          >
            <FileSearch size={20} />
            Disponibilidad
          </NavLink>

          <NavLink
            to="/ia"
            className={linkClass}
          >
            <BrainCircuit size={20} />
            IA Predictiva
          </NavLink>

          {/* ADMIN */}
          {rol === "ADMIN" && (

            <>
              <div className="border-t border-slate-800 my-3"></div>

              <p className="text-xs text-slate-500 px-3">
                ADMINISTRACIÓN
              </p>

              <NavLink
                to="/usuarios"
                className={linkClass}
              >
                <Users size={20} />
                Usuarios
              </NavLink>

              {/* NUEVO MODULO AREAS */}
              <NavLink
                to="/areas"
                className={linkClass}
              >
                <Building2 size={20} />
                Áreas Comunes
              </NavLink>

              <NavLink
                to="/gestion-reservas"
                className={linkClass}
              >
                <ShieldCheck size={20} />
                Gestión Reservas
              </NavLink>

              <NavLink
                to="/auditoria"
                className={linkClass}
              >
                <ShieldCheck size={20} />
                Auditoría
              </NavLink>

              <NavLink
                to="/reportes"
                className={linkClass}
              >
                <FileText size={20} />
                Reportes
              </NavLink>

            </>

          )}

        </div>

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800">

        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-red-600
            hover:bg-red-700
            transition
            p-3
            rounded-xl
          "
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>

      </div>

    </div>
  );
}

export default Sidebar;