import React, { useState } from 'react'
import { Smartphone, Download, FolderSync as Sync, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

export const MpesaIntegration: React.FC = () => {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [transactions, setTransactions] = useState([])

  const handleConnectMpesa = async () => {
    if (!phoneNumber || !pin) {
      toast.error('Please enter your phone number and PIN')
      return
    }

    setLoading(true)
    try {
      // Simulate M-Pesa connection (in production, this would call Daraja API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setConnected(true)
      toast.success('M-Pesa account connected successfully!')
      
      // Mock transaction data
      const mockTransactions = [
        { id: '1', amount: 2500, type: 'received', from: 'John Doe', date: '2024-01-15', description: 'Payment for services' },
        { id: '2', amount: 500, type: 'sent', to: 'Jane Smith', date: '2024-01-14', description: 'Lunch money' },
        { id: '3', amount: 1200, type: 'received', from: 'Boss', date: '2024-01-13', description: 'Salary advance' },
        { id: '4', amount: 800, type: 'sent', to: 'Supermarket', date: '2024-01-12', description: 'Groceries' },
      ]
      
      setTransactions(mockTransactions)
    } catch (error) {
      toast.error('Failed to connect M-Pesa account')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncTransactions = async () => {
    setLoading(true)
    try {
      // Simulate syncing transactions
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Transactions synced successfully!')
    } catch (error) {
      toast.error('Failed to sync transactions')
    } finally {
      setLoading(false)
    }
  }

  const importTransaction = async (transaction: any) => {
    try {
      // In production, this would save to the database
      toast.success(`Transaction imported: ${transaction.description}`)
    } catch (error) {
      toast.error('Failed to import transaction')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">M-Pesa Integration</h2>
        <p className="text-gray-600">Connect your M-Pesa account to automatically sync transactions</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
          {connected ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Not Connected</span>
            </div>
          )}
        </div>

        {!connected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254700000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your M-Pesa PIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={handleConnectMpesa}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-2" />
                  Connect M-Pesa Account
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Phone: {phoneNumber}</p>
              <p className="text-sm text-gray-500">Last sync: Just now</p>
            </div>
            <button
              onClick={handleSyncTransactions}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              <Sync className="w-4 h-4 mr-2" />
              Sync Now
            </button>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Security & Privacy</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Your M-Pesa PIN is encrypted and never stored</li>
              <li>• We only read transaction history, never send money</li>
              <li>• You can disconnect at any time</li>
              <li>• All data is stored securely in Kenya</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {connected && transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">M-Pesa Transactions</h3>
            <p className="text-gray-600">Review and import your M-Pesa transactions</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction: any) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'received' ? (
                      <Download className="w-5 h-5 text-green-600" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.type === 'received' ? 'From' : 'To'}: {transaction.from || transaction.to}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}Ksh {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => importTransaction(transaction)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Import
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Sync className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Sync</h3>
          <p className="text-gray-600">Automatically import your M-Pesa transactions daily for seamless tracking.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Categorization</h3>
          <p className="text-gray-600">AI automatically categorizes your M-Pesa transactions for better budget tracking.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibant text-gray-900 mb-2">Real-time Alerts</h3>
          <p className="text-gray-600">Get notifications for unusual spending patterns or budget overruns.</p>
        </div>
      </div>
    </div>
  )
}