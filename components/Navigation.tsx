import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, Calendar, Users, BarChart3 } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: Calendar, label: 'Dashboard' },
    { href: '/clients', icon: Users, label: 'Clients' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' }
  ]

  return (
    <nav className="nav-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = router.pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 py-4 px-3 border-b-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30'
                } rounded-t-lg`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}