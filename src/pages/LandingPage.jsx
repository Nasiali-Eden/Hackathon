import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoriesData from '../assets/categories.json';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">GigMap</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with local micro-gigs and empower youth through skill-building opportunities.
            Find gigs that match your skills or post jobs that need help.
          </p>
          
          <div className="flex justify-center gap-4">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* All Categories as Filter Buttons */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Browse All Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
              }`}
            >
              All Categories
            </button>
            {categoriesData.categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(index)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Details */}
          {selectedCategory !== null && (
            <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {categoriesData.categories[selectedCategory].name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesData.categories[selectedCategory].subcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                  >
                    <p className="text-gray-700 font-medium">{subcategory}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Categories Grid */}
          {selectedCategory === null && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesData.categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCategory(index)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-600"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.subcategories.length} subcategories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Discover Gigs</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse local opportunities that match your skills and interests
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Post Jobs</h3>
            <p className="text-gray-600 leading-relaxed">
              Need help with a task? Post it and connect with skilled youth
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Build Reputation</h3>
            <p className="text-gray-600 leading-relaxed">
              Earn ratings and build your professional profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
