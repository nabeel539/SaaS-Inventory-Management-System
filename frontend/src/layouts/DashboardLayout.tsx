import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-sidebar min-h-screen">
        <div className="max-w-container mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
