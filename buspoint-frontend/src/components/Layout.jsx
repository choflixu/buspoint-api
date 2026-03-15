import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Ticket, LayoutDashboard, LogOut } from 'lucide-react'
import Logo from "./Logo";

const navItems = [
  { path: '/routes', label: 'Routes', icon: MapPin },
  { path: '/tickets', label: 'My Tickets', icon: Ticket },
  { path: '/admin', label: 'Admin', icon: LayoutDashboard },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/routes" className="flex items-center gap-2">
                <Logo size={32} />
              <span className="font-bold text-gray-900">BusPoint</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
                {user?.photoURL ? (
                    <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="avatar" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                    </div>
                )}
              <span className="text-sm text-gray-600 hidden md:block">
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}