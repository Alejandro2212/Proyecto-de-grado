import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Reservas() {

  const [areas, setAreas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [form, setForm] = useState({
    usuarioId: "",
    areaId: "",
    fecha: "",
    horaInicio: "",
    horaFin: ""
  });

  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const areaRes = await api.get("/areas");
      const userRes = await api.get("/usuarios");

      setAreas(areaRes.data);
      setUsuarios(userRes.data);
    };

    cargar();
  }, []);

  const validar = async () => {

    if (!form.areaId || !form.fecha || !form.horaInicio || !form.horaFin) return;

    try {

      const res = await api.get("/reservas/validar", {
        params: {
          areaId: form.areaId,
          fecha: form.fecha,
          horaInicio: form.horaInicio,
          horaFin: form.horaFin
        }
      });

      setOcupado(!res.data);

      if (!res.data) {
        toast.error("Horario ocupado");
      }

    } catch (error) {
      console.log(error);
    }
  };

        const guardar = async () => {

        if (!form.usuarioId || !form.areaId) {
            toast.error("Completa todos los campos");
            return;
        }

        if (ocupado) {
            toast.error("Horario ocupado");
            return;
        }

        try {

            await api.post("/reservas", {
            usuarioId: Number(form.usuarioId),
            areaId: Number(form.areaId),
            fecha: form.fecha,
            horaInicio: form.horaInicio,
            horaFin: form.horaFin
            });

            toast.success("Reserva creada");

            setForm({
            usuarioId: "",
            areaId: "",
            fecha: "",
            horaInicio: "",
            horaFin: ""
            });

            setOcupado(false);

        } catch (error) {
            console.log(error.response?.data || error);
            toast.error("Error al crear reserva");
        }
        };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Reservas</h1>

      <div className="bg-white p-6 grid gap-4">

        <select onChange={e => setForm({ ...form, usuarioId: e.target.value })}>
          <option>Usuario</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>

        <select onChange={e => setForm({ ...form, areaId: e.target.value })}>
          <option>Área</option>
          {areas.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        <input type="date" onChange={e => setForm({ ...form, fecha: e.target.value })} />

        <input type="time" onChange={e => setForm({ ...form, horaInicio: e.target.value })} onBlur={validar} />

        <input type="time" onChange={e => setForm({ ...form, horaFin: e.target.value })} onBlur={validar} />

        <button
          onClick={guardar}
          disabled={ocupado}
          className="bg-green-600 text-white p-2 rounded"
        >
          Guardar
        </button>

      </div>
    </div>
  );
}

export default Reservas;