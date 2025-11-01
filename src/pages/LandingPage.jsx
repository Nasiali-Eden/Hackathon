import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoriesData from '../assets/categories.json';

const LandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-24 sm:pt-32 pb-20 sm:pb-28">
          <div className="text-center space-y-8 sm:space-y-10">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GigMap</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Connect with local micro-gigs and empower youth through skill-building opportunities.
              Find gigs that match your skills or post jobs that need help.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="w-full sm:w-auto bg-white text-blue-600 px-12 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="py-24 sm:py-32">
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Discover opportunities across diverse fields
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {categoriesData.categories.slice(0, 8).map((category, index) => (
              <div
                key={index}
                className="group bg-white p-10 lg:p-12 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-6xl lg:text-7xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {category.subcategories.length} subcategories
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="py-24 sm:py-32 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
            <div className="text-center space-y-8 p-10 rounded-2xl hover:bg-white/50 transition-all duration-300">
              <div className="text-8xl lg:text-9xl mb-8 inline-block transform hover:scale-110 transition-transform duration-300">
                🔍
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Discover Gigs
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed font-light max-w-xs mx-auto">
                Browse local opportunities that match your skills and interests
              </p>
            </div>
            
            <div className="text-center space-y-8 p-10 rounded-2xl hover:bg-white/50 transition-all duration-300">
              <div className="text-8xl lg:text-9xl mb-8 inline-block transform hover:scale-110 transition-transform duration-300">
                💼
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Post Jobs
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed font-light max-w-xs mx-auto">
                Need help with a task? Post it and connect with skilled youth
              </p>
            </div>
            
            <div className="text-center space-y-8 p-10 rounded-2xl hover:bg-white/50 transition-all duration-300">
              <div className="text-8xl lg:text-9xl mb-8 inline-block transform hover:scale-110 transition-transform duration-300">
                ⭐
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Build Reputation
              </h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed font-light max-w-xs mx-auto">
                Earn ratings and build your professional profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;