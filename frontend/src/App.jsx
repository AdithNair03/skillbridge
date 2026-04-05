import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Sessions from './pages/Sessions';
import RequestSession from './pages/RequestSession';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main style={{ overflow: 'auto', minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <PublicLayout><Register /></PublicLayout>} />
      <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/explore" element={<PrivateRoute><AppLayout><Explore /></AppLayout></PrivateRoute>} />
      <Route path="/profile/:id" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
      <Route path="/profile/edit" element={<PrivateRoute><AppLayout><EditProfile /></AppLayout></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute><AppLayout><Messages /></AppLayout></PrivateRoute>} />
      <Route path="/messages/:userId" element={<PrivateRoute><AppLayout><Messages /></AppLayout></PrivateRoute>} />
      <Route path="/sessions" element={<PrivateRoute><AppLayout><Sessions /></AppLayout></PrivateRoute>} />
      <Route path="/request-session/:providerId" element={<PrivateRoute><AppLayout><RequestSession /></AppLayout></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AppLayout><AdminPanel /></AppLayout></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
