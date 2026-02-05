import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const data = await login({ email, password });
            setUser(data.user);
            navigate('/dashboard');
        } catch(err) {
            setError(err.response?.data?.error || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold ">
            CYA
          </h2>
          <p className="mt-2 text-center text-sm text-soft-periwinkle">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-slate-blue focus:border-slate-blue"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-slate-blue focus:border-slate-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-blue hover:bg-lavender-veil focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <p className="text-center text-sm text-soft-periwinkle">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/about" className="text-blue-600 hover:text-blue-500">
            Learn more about C-ya
          </Link>
        </p>
        
      </div>
    </div>
  );
}

export default Login;