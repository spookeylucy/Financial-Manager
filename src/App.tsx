// import React, { useState } from 'react'
// import { Toaster } from 'react-hot-toast'
// import { useAuth } from './hooks/useAuth'
// import { AuthForm } from './components/auth/AuthForm'
// import { Header } from './components/layout/Header'
// import { Sidebar } from './components/layout/Sidebar'
// import { DashboardOverview } from './components/dashboard/DashboardOverview'
// import { TransactionList } from './components/transactions/TransactionList'
// import { AIAdvisor } from './components/ai/AIAdvisor'
// import { MpesaIntegration } from './components/mpesa/MpesaIntegration'

// function App() {
//   const { user, loading } = useAuth()
//   const [currentView, setCurrentView] = useState('dashboard')

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <>
//         <AuthForm />
//         <Toaster position="top-right" />
//       </>
//     )
//   }

//   const renderContent = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return <DashboardOverview />
//       case 'transactions':
//         return <TransactionList />
//       case 'ai-advisor':
//         return <AIAdvisor />
//       case 'mpesa':
//         return <MpesaIntegration />
//       default:
//         return <DashboardOverview />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="flex">
//         <Sidebar currentView={currentView} onViewChange={setCurrentView} />
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderContent()}
//         </main>
//       </div>
//       <Toaster position="top-right" />
//     </div>
//   )
// }

// export default App

import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/auth/AuthForm'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardOverview } from './components/dashboard/DashboardOverview'
import { TransactionList } from './components/transactions/TransactionList'
import { AIAdvisor } from './components/ai/AIAdvisor'
import { MpesaIntegration } from './components/mpesa/MpesaIntegration'
import { BudgetSection } from './components/budgets/BudgetSection'
import { GoalsSection } from './components/goals/GoalsSection'
// import { AnalyticsSection } from './components/analytics/AnalyticsSection'
import { SettingsPanel } from './components/settings/SettingsPanel'

function App() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-right" />
      </>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'transactions':
        return <TransactionList />
      case 'budgets':
        return <BudgetSection />
      case 'goals':
        return <GoalsSection />
      // case 'analytics':
      //   return <AnalyticsSection />
      case 'settings':
        return <SettingsPanel />
      case 'ai-advisor':
        return <AIAdvisor />
      case 'mpesa':
        return <MpesaIntegration />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
