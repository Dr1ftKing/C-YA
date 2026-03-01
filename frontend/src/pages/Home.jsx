import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto px-8 py-16">
                <div 
                    className="bg-white border-2 border-gray-800 min-h-[500px] relative overflow-hidden"
                    style={{ minHeight: '500px' }}
                >
                    <div 
                        className="absolute inset-0"
                        style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#3B82F6',
                            backgroundImage: 'url(/pexels-pressmaster-3851857.jpg)', 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}
                    >
                        <div 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(245, 240, 240, 0.6)'
                            }}
                        ></div>
                    </div>
                    
                    <div className="relative z-10 p-16 flex items-center min-h-[500px]" style={{ position: 'relative', zIndex: 10, padding: '4rem' }}>
                        <div className="max-w-md">
                            <h1 className="text-4xl font-normal text-gray-900 leading-tight mb-6">
                                Find time<br />
                                <span className="font-bold">Together</span>
                            </h1>

                            <div className="space-y-2 text-gray-700">
                                <p>Making 'c-ya' soon actually happen</p>
                                <p>Because finding time shouldn't be hard</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-3 bg-soft-periwinkle text-white font-medium rounded-md hover:bg-slate-blue transition text-lg"
                    >
                        Get Started
                    </Link>
                    <p className="mt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;