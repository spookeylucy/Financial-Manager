import React from 'react'
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  Target, 
  Settings, 
  BarChart3,
  PiggyBank,
  Smartphone
} from 'lucide-react'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'goals', label: 'Financial Goals', icon: Target },
    { id: 'mpesa', label: 'M-Pesa Sync', icon: Smartphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-advisor', label: 'AI Advisor', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}