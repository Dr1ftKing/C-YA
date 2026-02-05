import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateProposal from './pages/CreateProposal';
import ProposalDetail from './pages/ProposalDetail';
import InviteResponse from './pages/InviteResponse';
import About from './pages/About';
import { getCurrentUser } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Only check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (err) {
        // Token invalid or expired, remove it
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" /> : <Signup setUser={setUser} />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/create-proposal" 
        element={user ? <CreateProposal /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/proposal/:id" 
        element={user ? <ProposalDetail user={user} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/invite/:id" 
        element={<InviteResponse />} 
      />
      <Route
         path="/about"
         element={<About />}
      />
    </Routes>
  );
}

export default App;