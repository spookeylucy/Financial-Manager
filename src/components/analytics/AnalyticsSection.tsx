// import React, { useEffect, useState } from 'react'
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
// import { supabase } from '../../lib/supabase'
// import { useAuth } from '../../hooks/useAuth'
// import { format } from 'date-fns'

// interface Transaction {
//   amount: number
//   category: string
//   type: 'income' | 'expense'
//   date: string
// }

// const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316']

// export const AnalyticsSection: React.FC = () => {
//   const { user } = useAuth()
//   const [transactions, setTransactions] = useState<Transaction[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase
//         .from('transactions')
//         .select('*')
//         .eq('user_id', user?.id)

//       if (!error) {
//         setTransactions(data || [])
//       }
//     }

//     if (user) {
//       fetchData()
//     }
//   }, [user])

//   const monthlySpending = transactions
//     .filter(t => t.type === 'expense')
//     .reduce((acc, t) => {
//       const month = format(new Date(t.date), 'MMM yyyy')
//       acc[month] = (acc[month] || 0) + t.amount
//       return acc
//     }, {} as Record<string, number>)

//   const categorySpending = transactions
//     .filter(t => t.type === 'expense')
//     .reduce((acc, t) => {
//       acc[t.category] = (acc[t.category] || 0) + t.amount
//       return acc
//     }, {} as Record<string, number>)

//   const monthlyData = Object.entries(monthlySpending).map(([month, amount]) => ({
//     month,
//     amount
//   }))

//   const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
//     name,
//     value
//   }))

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

//       {/* Monthly Spending */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Expenses</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip formatter={(value) => [`Ksh ${value}`, 'Amount']} />
//             <Bar dataKey="amount" fill="#EF4444" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Category Breakdown */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">Spending by Category</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={categoryData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//               outerRadius={100}
//               dataKey="value"
//             >
//               {categoryData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip formatter={(value) => [`Ksh ${value}`, 'Amount']} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'

interface Transaction {
  id: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  description?: string
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316']

export const AnalyticsSection: React.FC = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching transactions:', error)
        return
      }

      setTransactions(data || [])
    }

    fetchData()
  }, [user])

  const monthlySpending = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const month = format(new Date(t.date), 'MMM yyyy')
      acc[month] = (acc[month] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const categorySpending = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const monthlyData = Object.entries(monthlySpending).map(([month, amount]) => ({ month, amount }))
  const categoryData = Object.entries(categorySpending).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      {/* Monthly Expenses */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Expenses</h3>
        {monthlyData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`Ksh ${value}`, 'Amount']} />
              <Bar dataKey="amount" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Spending by Category */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Spending by Category</h3>
        {categoryData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`Ksh ${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}


