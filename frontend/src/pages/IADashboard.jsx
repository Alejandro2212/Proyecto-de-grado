import { useEffect, useState } from "react";
import { obtenerPrediccionIA } from "../services/iaService";

export default function IADashboard() {

    const [data, setData] = useState(null);

    const cargarIA = async () => {

        try {

            const res = await obtenerPrediccionIA();

            setData(res);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        cargarIA();

    }, []);

    if (!data) {

        return <h2>Cargando IA...</h2>;
    }

    return (

        <div className="container mt-4">

            <h2>Panel Inteligente IA</h2>

            <div className="card p-4 mt-3">

                <h4>
                    Área más usada:
                </h4>

                <p>
                    {data.areaMasUsada}
                </p>

                <h4>
                    Horario más usado:
                </h4>

                <p>
                    {data.horarioMasUsado}
                </p>

                <h4>
                    Día más reservado:
                </h4>

                <p>
                    {data.diaMasReservado}
                </p>

                <h4>
                    Recomendación IA:
                </h4>

                <p>
                    {data.recomendacion}
                </p>

            </div>

        </div>
    );
}