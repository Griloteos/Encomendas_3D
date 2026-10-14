import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './lib/auth'
import Login from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            {/* Routes will be added in next phases */}
            <Route path="/" element={<Navigate to="/pedidos" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}