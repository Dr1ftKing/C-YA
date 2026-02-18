import { Link } from 'react-router-dom';
import { logout } from '../services/auth';


function Navbar({ user, setUser }) {
    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className='text-2xl font-bold text-slate-blue'>
                        C-ya
                    </Link>
                    
                    <div className='flex gap-8'>
                        <Link
                          to="/about"
                          className='text-gray-700 hover:text-blue-600 font-medium transition'
                        >
                         About Us
                        </Link>
                        <Link
                         to="/contact"
                         className='text-gray-700 hover:text-blue-600 font-medium transition'
                         >
                            Contact
                         </Link>
                    </div>
                    <div className='flex items-center gap-4'>
                        {user ? (
                           <>
                            <span className='text-gray-700'>
                                Hi, {user.name}!
                            </span>
                            
                            <button
                               onClick={handleLogout}
                               className='px-6 py-2 bg-soft-periwinkle text-white rounded-lg hover:bg-slate-blue font-medium transition'
                               >
                              Logout
                            </button>
                          </>
                        ) : (
                            <Link
                              to="/login"
                              className='px-6 py-2 bg-soft-periwinkle text-white rounded-lg hover:bg-slate-blue font-medium transition'
                            >
                              Login
                            </Link>
                        )}

                        

                    
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;