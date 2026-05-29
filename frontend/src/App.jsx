import { useState } from "react";
import { Toaster } from "react-hot-toast";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import api from "./services/api";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Reservas from "./pages/Reservas";
import Calendario from "./pages/Calendario";
import Usuarios from "./pages/Usuarios";
import Disponibilidad from "./pages/Disponibilidad";
import Auditoria from "./pages/Auditoria";
import GestionReservas from "./pages/GestionReservas";
import IADashboard from "./pages/IADashboard";

import "./index.css";

// =========================
// PROTECTED ROUTE
// =========================
function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// =========================
// ROLE PROTECTED ROUTE
// =========================
function RoleProtectedRoute({ children, roleRequired }) {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rol !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [logueado, setLogueado] = useState(
    !!localStorage.getItem("token")
  );

  // =========================
  // LOGIN
  // =========================
  const login = async () => {

    try {

      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuarioId", response.data.usuarioId);
      localStorage.setItem("rol", response.data.rol);

      setLogueado(true);

    } catch (error) {
      setMensaje("Credenciales incorrectas");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.clear();
    setLogueado(false);
  };

  // =========================
  // LOGIN VIEW
  // =========================
  if (!logueado) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="bg-white p-10 rounded-2xl shadow-lg w-96">

          <h1 className="text-3xl font-bold mb-8 text-center">
            Login Condominio
          </h1>

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={login}
            className="w-full bg-slate-900 text-white p-3 rounded-lg"
          >
            Iniciar Sesión
          </button>

          <p className="text-red-500 mt-4 text-center">
            {mensaje}
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // APP PRINCIPAL
  // =========================
  return (

    <BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000
          }}
        />

      <div className="flex">

        {/* SIDEBAR */}
        <Sidebar logout={logout} />

        {/* CONTENIDO */}
        <div className="flex-1 bg-slate-100 min-h-screen p-6">

          <Routes>
            {/* AUDITORÍA */}
            <Route
              path="/auditoria"
              element={
                <RoleProtectedRoute roleRequired="ADMIN">
                  <Auditoria />
                </RoleProtectedRoute>
              }
            />

          <Route
              path="/ia"
              element={<IADashboard />}
          />

          <Route
            path="/gestion-reservas"
            element={
              <RoleProtectedRoute roleRequired="ADMIN">
                <GestionReservas />
              </RoleProtectedRoute>
            }
          />

            {/* REDIRECCIÓN INICIAL */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* RESERVAS */}
            <Route
              path="/reservas"
              element={
                <ProtectedRoute>
                  <Reservas />
                </ProtectedRoute>
              }
            />

            {/* CALENDARIO */}
            <Route
              path="/calendario"
              element={
                <ProtectedRoute>
                  <Calendario />
                </ProtectedRoute>
              }
            />

            {/* USUARIOS (ADMIN) */}
            <Route
              path="/usuarios"
              element={
                <RoleProtectedRoute roleRequired="ADMIN">
                  <Usuarios />
                </RoleProtectedRoute>
              }
            />

              {/* DISPONIBILIDAD */}
            <Route
              path="/disponibilidad"
              element={
                <ProtectedRoute>
                  <Disponibilidad />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;