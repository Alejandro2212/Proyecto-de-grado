function Login({
  email,
  setEmail,
  password,
  setPassword,
  mensaje,
  login
}) {

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login Condominio
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={login}
            className="
              bg-slate-900
              text-white
              p-3
              rounded-lg
              hover:bg-slate-700
            "
          >
            Iniciar Sesión
          </button>

          <p className="text-red-500 text-center">
            {mensaje}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;