import { useState } from "react";

import { Toaster } from "react-hot-toast";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import api from "./services/api";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Reservas from "./pages/Reservas";
import Calendario from "./pages/Calendario";
import Usuarios from "./pages/Usuarios";
import Disponibilidad from "./pages/Disponibilidad";
import Auditoria from "./pages/Auditoria";
import GestionReservas from "./pages/GestionReservas";
import IADashboard from "./pages/IADashboard";
import MisReservas from "./pages/MisReservas";
import Areas from "./pages/Areas";
import Reportes from "./pages/Reportes";
import Perfil from "./pages/Perfil";
import CambiarPassword from "./pages/CambiarPassword";
import AdminAvisos from "./pages/AdminAvisos";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./index.css";

// =========================
// PROTECTED
// =========================
function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("token");

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// =========================
// ROLE
// =========================
function RoleProtectedRoute({
  children,
  roleRequired
}) {

  const token =
    localStorage.getItem("token");

  const rol =
    localStorage.getItem("rol");

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (rol !== roleRequired) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

function App() {

  const [email,
    setEmail] = useState("");

  const [password,
    setPassword] = useState("");

  const [mensaje,
    setMensaje] = useState("");

  // =========================
  // LOGIN
  // =========================
  const login = async () => {

    try {

      console.log(
        "URL API:",
        api.defaults.baseURL
      );

      console.log(
        "EMAIL:",
        email
      );

      console.log(
        "PASSWORD:",
        password
      );
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      console.log(
        "LOGIN OK",
        response.data
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "usuarioId",
        response.data.usuarioId
      );

      localStorage.setItem(
        "rol",
        response.data.rol
      );

      window.location.href =
        "/dashboard";

    } 
    
    catch (error) {

      console.error(error);

      if (error.message === "Network Error") {

        setMensaje(
          "No se pudo conectar con el servidor"
        );

      } else {

        setMensaje(
          "Credenciales incorrectas"
        );
      }
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.clear();

    window.location.href =
      "/login";
  };

  return (

    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              mensaje={mensaje}
              login={login}
            />
          }
        />

        {/* REGISTRO */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* RUTAS PROTEGIDAS */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>

              <Layout logout={logout}>

                <Routes>

                  <Route
                    path="/dashboard"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/reservas"
                    element={<Reservas />}
                  />

                  <Route
                    path="/calendario"
                    element={<Calendario />}
                  />

                  <Route
                    path="/disponibilidad"
                    element={<Disponibilidad />}
                  />

                  <Route
                    path="/ia"
                    element={<IADashboard />}
                  />

                  <Route
                    path="/mis-reservas"
                    element={<MisReservas />}
                  />

                  {/* ADMIN */}

                  <Route
                    path="/usuarios"
                    element={
                      <RoleProtectedRoute roleRequired="ADMIN">
                        <Usuarios />
                      </RoleProtectedRoute>
                    }
                  />

                  <Route
                    path="/areas"
                    element={
                      <RoleProtectedRoute roleRequired="ADMIN">
                        <Areas />
                      </RoleProtectedRoute>
                    }
                  />

                  <Route
                    path="/auditoria"
                    element={
                      <RoleProtectedRoute roleRequired="ADMIN">
                        <Auditoria />
                      </RoleProtectedRoute>
                    }
                  />

                  <Route
                    path="/gestion-reservas"
                    element={
                      <RoleProtectedRoute roleRequired="ADMIN">
                        <GestionReservas />
                      </RoleProtectedRoute>
                    }
                  />

                  <Route
                    path="/reportes"
                    element={
                      <RoleProtectedRoute roleRequired="ADMIN">
                        <Reportes />
                      </RoleProtectedRoute>
                    }
                  />

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/dashboard"
                        replace
                      />
                    }
                  />

                  <Route
                    path="/cambiar-password"
                    element={
                      <ProtectedRoute>
                        <CambiarPassword />
                      </ProtectedRoute>
                    }
                  />

                </Routes>

              </Layout>

            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/avisos"
          element={<AdminAvisos />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;