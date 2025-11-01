import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserData } from '../firebase/users';
import { getUserGigs } from '../firebase/gigs';
import { getUserFeedback } from '../firebase/feedback';
import { getUserData } from '../firebase/users';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, userData, setUserData } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: ''
  });
  const [myGigs, setMyGigs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills || ''
      });
      loadUserData();
    }
  }, [userData, currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;

    // Load user's gigs
    const gigsResult = await getUserGigs(currentUser.uid, 'all');
    if (gigsResult.success) {
      setMyGigs(gigsResult.data);
    }

    // Load feedback
    const feedbackResult = await getUserFeedback(currentUser.uid);
    if (feedbackResult.success) {
      setFeedback(feedbackResult.data);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result = await updateUserData(currentUser.uid, {
      name: formData.name,
      skills: skillsArray
    });

    if (result.success) {
      // Reload user data
      const userResult = await getUserData(currentUser.uid);
      if (userResult.success) {
        setUserData(userResult.data);
      }
      setEditMode(false);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const calculateAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, f) => acc + (f.rating || 0), 0);
    return (sum / feedback.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={userData?.role || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Graphic Design, Photography, Web Development"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: userData?.name || '',
                      skills: Array.isArray(userData?.skills)
                        ? userData.skills.join(', ')
                        : userData?.skills || ''
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium">{userData?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{userData?.email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-medium capitalize">
                  {userData?.role || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(userData?.skills) && userData.skills.length > 0 ? (
                    userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-medium">
                  {userData?.joinedAt
                    ? new Date(userData.joinedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* My Gigs Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Gigs Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {myGigs.filter((g) => g.postedBy === currentUser.uid).length}
              </p>
              <p className="text-sm text-gray-600">Posted</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {myGigs.filter((g) => g.claimedBy === currentUser.uid).length}
              </p>
              <p className="text-sm text-gray-600">Claimed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {myGigs.filter((g) => g.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard"
              className="text-blue-600 hover:underline"
            >
              View all my gigs →
            </Link>
          </div>
        </div>

        {/* Feedback & Ratings */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Feedback & Ratings</h2>
          {feedback.length === 0 ? (
            <p className="text-gray-500">No feedback received yet</p>
          ) : (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-blue-600">
                  {calculateAverageRating()} / 5.0
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {feedback.length} review{feedback.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          Rating: {item.rating ? '⭐'.repeat(item.rating) : 'N/A'}
                        </p>
                        {item.comment && (
                          <p className="text-gray-700 mt-2">{item.comment}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
