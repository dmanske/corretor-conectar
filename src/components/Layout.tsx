
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { 
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";
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
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className="flex flex-col flex-1 transition-all duration-300" 
           style={{ marginLeft: sidebarCollapsed ? "64px" : "250px" }}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-4"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-semibold text-slate-800 flex-1">
            Corretor Conecta
          </h1>
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Sair"
              className="ml-2"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-slate-500 border-t border-slate-200">
          © 2025 Sistema de Gestão Imobiliária. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
