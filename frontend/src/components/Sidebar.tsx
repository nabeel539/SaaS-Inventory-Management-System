import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../utils/constants';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar bg-white border-r border-surface-container-highest flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 pb-4">
        <h1 className="text-xl font-bold text-[#1b1b1b]">{APP_NAME}</h1>
        <p className="text-body-sm text-muted-foreground mt-0.5">Inventory Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-surface-container text-[#1b1b1b] border-l-2 border-primary'
                  : 'text-muted-foreground hover:bg-surface-container-low hover:text-[#1b1b1b]'
              }`
            }
          >
            <item.icon size={20} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-surface-container-highest">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-[#1b1b1b] truncate">
              {user?.organizationName || 'User'}
            </p>
            <button
              onClick={handleLogout}
              className="text-body-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
