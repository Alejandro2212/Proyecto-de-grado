import { useState } from "react";

function NotificationBell({

  notifications = []

}) {

  const [abierto, setAbierto] =
    useState(false);

  return (

    <div className="relative">

      {/* BOTÓN */}
      <button
        onClick={() =>
          setAbierto(!abierto)
        }
        className="
          relative
          bg-white
          p-3
          rounded-full
          shadow
          hover:bg-slate-100
        "
      >

        🔔

        {/* CONTADOR */}
        {notifications.length > 0 && (

          <span
            className="
              absolute
              -top-2
              -right-2
              bg-red-500
              text-white
              text-xs
              px-2
              py-1
              rounded-full
            "
          >

            {notifications.length}

          </span>
        )}

      </button>

      {/* PANEL */}
      {abierto && (

        <div
          className="
            absolute
            right-0
            mt-3
            w-80
            bg-white
            rounded-2xl
            shadow-2xl
            z-50
            overflow-hidden
          "
        >

          <div
            className="
              bg-slate-900
              text-white
              p-4
              font-bold
            "
          >

            Notificaciones

          </div>

          <div
            className="
              max-h-96
              overflow-y-auto
            "
          >

            {notifications.length === 0 ? (

              <div className="p-4 text-gray-500">

                No hay notificaciones

              </div>

            ) : (

              notifications.map((n, index) => (

                <div
                  key={index}
                  className="
                    p-4
                    border-b
                    hover:bg-slate-50
                  "
                >

                  <p className="font-medium">

                    {n.mensaje}

                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >

                    {n.fecha}

                  </p>

                </div>

              ))
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default NotificationBell;