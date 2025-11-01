import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToGigs, getUserGigs } from '../firebase/gigs';
import categoriesData from '../assets/categories.json';
import { getUserData } from '../firebase/users';

const DashboardPage = () => {
  const { currentUser, userData } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to available gigs
    const unsubscribe = subscribeToGigs(selectedCategory || null, (gigsList) => {
      // Show only open gigs not posted by current user in "Available Gigs" tab
      const available = gigsList.filter(
        (gig) => gig.status === 'open' && gig.postedBy !== currentUser.uid
      );
      setGigs(available);
      setLoading(false);
    });

    // Load user's gigs
    loadMyGigs();

    return unsubscribe;
  }, [currentUser, selectedCategory, userData]);

  const loadMyGigs = async () => {
    if (!currentUser) return;
    const result = await getUserGigs(currentUser.uid, 'all');
    if (result.success) {
      setMyGigs(result.data);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.categories.find(
      (cat) => cat.name === categoryName
    );
    return category?.icon || '📌';
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      claimed: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            {userData?.role === 'seeker'
              ? 'Discover gigs that match your skills'
              : 'Manage your posted gigs and discover opportunities'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('available')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Gigs
            </button>
            <button
              onClick={() => setActiveTab('my-gigs')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-gigs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Gigs
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categoriesData.categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gig List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading gigs...</div>
          </div>
        ) : activeTab === 'available' ? (
          gigs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No gigs available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gig/${gig.id}`}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{getCategoryIcon(gig.category)}</div>
                    {getStatusBadge(gig.status)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {gig.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{gig.location}</span>
                    <span className="font-semibold text-blue-600">
                      ${gig.pay}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div>
            {myGigs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">You haven't posted or claimed any gigs yet</p>
                {userData?.role === 'poster' && (
                  <Link
                    to="/post"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Post Your First Gig
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGigs.map((gig) => (
                  <Link
                    key={gig.id}
                    to={`/gig/${gig.id}`}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{getCategoryIcon(gig.category)}</div>
                      <div className="flex flex-col items-end space-y-1">
                        {getStatusBadge(gig.status)}
                        <span className="text-xs text-gray-500">
                          {gig.type === 'posted' ? 'Posted' : 'Claimed'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {gig.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {gig.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{gig.location}</span>
                      <span className="font-semibold text-blue-600">
                        ${gig.pay}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
