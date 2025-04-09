import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-black text-white">
          <Sidebar />
          <div className="flex flex-1 flex-col md:pl-64">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1a202c', color: '#fff' } }} />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;