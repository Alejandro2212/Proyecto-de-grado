import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Reportes() {

  const [areas, setAreas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [areaId, setAreaId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  // =========================
  // CARGAR COMBOS
  // =========================
  useEffect(() => {

    cargarAreas();
    cargarUsuarios();

  }, []);

  const cargarAreas = async () => {

    try {

      const res = await api.get("/areas");

      setAreas(res.data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error cargando áreas"
      );
    }
  };

  const cargarUsuarios = async () => {

    try {

      const res = await api.get("/usuarios");

      setUsuarios(res.data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error cargando usuarios"
      );
    }
  };

  // =========================
  // DESCARGAR PDF
  // =========================
  const descargarPDF = async (
    endpoint,
    nombreArchivo
  ) => {

    try {

      const response = await api.get(
        endpoint,
        {
          responseType: "blob"
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        nombreArchivo
      );

      document.body.appendChild(link);

      link.click();

      toast.success(
        "Reporte generado correctamente"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Error al generar reporte"
      );
    }
  };

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Centro de Reportes
        </h1>

        <p className="text-gray-500 mt-2">
          Generación de reportes PDF profesionales
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REPORTE GENERAL */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >

          <h2 className="text-xl font-bold mb-4">
            Reporte General
          </h2>

          <p className="text-gray-500 mb-6">
            Estadísticas globales del sistema.
          </p>

          <button
            onClick={() =>
              descargarPDF(
                "/reportes/general",
                "ReporteGeneral.pdf"
              )
            }
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              text-white
              py-3
              rounded-xl
            "
          >
            Descargar PDF
          </button>

        </div>

        {/* REPORTE POR ÁREA */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >

          <h2 className="text-xl font-bold mb-4">
            Reporte por Área
          </h2>

          <select
            value={areaId}
            onChange={(e) =>
              setAreaId(e.target.value)
            }
            className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
            "
          >

            <option value="">
              Seleccione un área
            </option>

            {areas.map((area) => (

              <option
                key={area.id}
                value={area.id}
              >
                {area.nombre}
              </option>

            ))}

          </select>

          <button
            disabled={!areaId}
            onClick={() =>
              descargarPDF(
                `/reportes/area/${areaId}`,
                `ReporteArea_${areaId}.pdf`
              )
            }
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-gray-400
              text-white
              py-3
              rounded-xl
            "
          >
            Descargar PDF
          </button>

        </div>

        {/* REPORTE POR USUARIO */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >

          <h2 className="text-xl font-bold mb-4">
            Reporte por Usuario
          </h2>

          <select
            value={usuarioId}
            onChange={(e) =>
              setUsuarioId(
                e.target.value
              )
            }
            className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
            "
          >

            <option value="">
              Seleccione un usuario
            </option>

            {usuarios.map((usuario) => (

              <option
                key={usuario.id}
                value={usuario.id}
              >
                {usuario.nombre} {usuario.apellido}
              </option>

            ))}

          </select>

          <button
            disabled={!usuarioId}
            onClick={() =>
              descargarPDF(
                `/reportes/usuario/${usuarioId}`,
                `ReporteUsuario_${usuarioId}.pdf`
              )
            }
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-400
              text-white
              py-3
              rounded-xl
            "
          >
            Descargar PDF
          </button>

        </div>

      </div>

    </div>
  );
}

export default Reportes;