import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

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
              <div className="mt-1 relative">                
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-slate-blue focus:border-slate-blue"
                  />
                <button 
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                  {showPassword ? (
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap='round' strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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