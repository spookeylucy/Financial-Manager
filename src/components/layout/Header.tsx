import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, User, Bell } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Header: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-600 to-red-600 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ksh</span>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900">FinanceKE</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{user?.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}