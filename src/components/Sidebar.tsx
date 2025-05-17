import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Home,
  Calendar,
  Settings,
  CircleDollarSign
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/"
    },
    {
      title: "Clientes",
      icon: <Users className="h-5 w-5" />,
      path: "/clientes"
    },
    {
      title: "Vendas",
      icon: <Home className="h-5 w-5" />,
      path: "/vendas"
    },
    {
      title: "Comissões",
      icon: <CircleDollarSign className="h-5 w-5" />,
      path: "/comissoes"
    },
    {
      title: "Aniversários",
      icon: <Calendar className="h-5 w-5" />,
      path: "/aniversarios"
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-screen bg-white border-r border-slate-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-slate-200 transition-all duration-300",
        collapsed ? "justify-center px-2" : "px-6"
      )}>
        {collapsed ? (
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            CC
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
              CC
            </div>
            <span className="text-xl font-bold text-slate-800">Corretor Conecta</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
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
      
      {/* Configurações no rodapé da sidebar */}
      <div className={cn(
        "absolute bottom-6 w-full px-2",
        collapsed ? "" : ""
      )}>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg px-3 py-2.5 font-medium transition-all duration-200",
              isActive 
                ? "bg-blue-50 text-blue-700" 
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600",
              collapsed ? "justify-center" : ""
            )
          }
        >
          <span className={cn(collapsed ? "mx-auto" : "mr-3")}>
            <Settings className="h-5 w-5" />
          </span>
          {!collapsed && <span>Configurações</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
