import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Home,
  Calendar,
  CircleDollarSign,
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  user: any;
  handleLogout: (e: React.MouseEvent) => void;
}

const Sidebar = ({ collapsed, toggleSidebar, sidebarCollapsed, user, handleLogout }: SidebarProps) => {
  const { logout } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/app"
    },
    {
      title: "Clientes",
      icon: <Users className="h-5 w-5" />,
      path: "/app/clientes"
    },
    {
      title: "Vendas",
      icon: <Home className="h-5 w-5" />,
      path: "/app/vendas"
    },
    {
      title: "Comissões",
      icon: <CircleDollarSign className="h-5 w-5" />,
      path: "/app/comissoes"
    },
    {
      title: "Aniversários",
      icon: <Calendar className="h-5 w-5" />,
      path: "/app/aniversarios"
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + Minimizar */}
      <div className={cn(
        "h-16 flex items-center border-b border-slate-200 transition-all duration-300 shrink-0",
        collapsed ? "justify-center px-2" : "justify-between px-6"
      )}>
        {collapsed ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="p-0"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              CC
            </div>
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                CC
              </div>
              <span className="text-xl font-bold text-slate-800">ConectaPro</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg px-3 py-2.5 font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600",
                    collapsed ? "justify-center" : ""
                  )
                }
                end={item.path === "/"}
              >
                <span className={cn(collapsed ? "mx-auto" : "mr-3")}>{item.icon}</span>
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Informações do Usuário e Logout no rodapé */}
      <div className={cn(
        "mt-auto p-2 border-t border-slate-200 shrink-0",
        collapsed ? "py-3" : "py-3 px-3"
      )}>
        {collapsed ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Sair"
            className="w-full flex justify-center"
          >
            <LogOut className="h-5 w-5 text-slate-700" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Foto do usuário"
                className="w-8 h-8 rounded-full border border-slate-300 object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Users className="h-5 w-5" /> 
              </div>
            )}
            <span className="text-sm text-slate-800 font-medium truncate">
              {user?.user_metadata?.name || user?.email || "Usuário"}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Sair"
              className="shrink-0"
            >
              <LogOut className="h-5 w-5 text-slate-800" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
