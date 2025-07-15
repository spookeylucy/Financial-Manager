// File: src/components/budgets/BudgetSection.tsx

import React from 'react'
import { Wallet, Calendar, BarChart2 } from 'lucide-react'

export const BudgetSection: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🧾 Budget Management</h2>
        <p className="text-gray-600">Set your monthly and weekly spending targets by category to stay on track.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Food</p>
              <p className="text-2xl font-bold text-green-600">Ksh 10,000</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transport</p>
              <p className="text-2xl font-bold text-blue-600">Ksh 4,500</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings</p>
              <p className="text-2xl font-bold text-purple-600">Ksh 5,000</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
