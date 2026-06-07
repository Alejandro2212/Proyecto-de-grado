import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({
  children,
  logout
}) {

  return (

    <div className="flex bg-slate-100">

      {/* SIDEBAR */}
      <Sidebar logout={logout} />

      {/* CONTENIDO */}
      <div className="flex-1 p-6">

        <Navbar logout={logout} />

        {children}

      </div>

    </div>
  );
}