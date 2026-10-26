import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './lib/auth'
import Login from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout'
import OrderList from './pages/OrderList'
import OrderForm from './pages/OrderForm'
import OrderDetail from './pages/OrderDetail'
import ReminderList from './pages/ReminderList'
import ReminderForm from './pages/ReminderForm'
import ReportPage from './pages/ReportPage'
import NotificationSettings from './pages/NotificationSettings'
import BudgetPage from './pages/BudgetPage'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/pedidos" element={<OrderList />} />
            <Route path="/pedidos/novo" element={<OrderForm />} />
            <Route path="/pedidos/:id" element={<OrderDetail />} />
            <Route path="/pedidos/:id/editar" element={<OrderForm />} />
            <Route path="/lembretes" element={<ReminderList />} />
            <Route path="/lembretes/novo" element={<ReminderForm />} />
            <Route path="/lembretes/:id/editar" element={<ReminderForm />} />
            <Route path="/relatorio" element={<ReportPage />} />
            <Route path="/notificacoes" element={<NotificationSettings />} />
            <Route path="/orcamento" element={<BudgetPage />} />
            <Route path="/" element={<Navigate to="/pedidos" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}