
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import useAuth from "@/hooks/useAuth";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} user={user} handleLogout={handleLogout} />
      <div className="flex flex-col flex-1 transition-all duration-300" 
           style={{ marginLeft: sidebarCollapsed ? "64px" : "250px" }}>
        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-slate-500 border-t border-slate-200">
          © 2025 ConectaPro - Simplificando a gestão de vendas. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
