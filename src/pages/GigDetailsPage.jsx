import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGig, claimGig, updateGigStatus } from '../firebase/gigs';
import { getUserData } from '../firebase/users';
import FeedbackModal from '../components/FeedbackModal';

const GigDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [gig, setGig] = useState(null);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    setLoading(true);
    const result = await getGig(id);
    if (result.success) {
      setGig(result.data);
      // Load poster info
      if (result.data.postedBy) {
        const posterResult = await getUserData(result.data.postedBy);
        if (posterResult.success) {
          setPoster(posterResult.data);
        }
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleClaimGig = async () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    setActionLoading(true);
    const result = await claimGig(id, currentUser.uid);
    if (result.success) {
      await loadGig();
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setActionLoading(false);
  };

  const handleMarkComplete = async () => {
    setActionLoading(true);
    const result = await updateGigStatus(id, 'completed');
    if (result.success) {
      await loadGig();
      setShowFeedbackModal(true);
    } else {
      setError(result.error);
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Gig not found'}</p>
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPoster = currentUser && gig.postedBy === currentUser.uid;
  const isClaimer = currentUser && gig.claimedBy === currentUser.uid;
  const canClaim = userData?.role === 'seeker' && gig.status === 'open' && !isPoster;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {gig.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {gig.category}
                </span>
                <span>{gig.location}</span>
                <span className="font-semibold text-blue-600 text-lg">
                  ${gig.pay}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                gig.status === 'open'
                  ? 'bg-green-100 text-green-800'
                  : gig.status === 'claimed'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {gig.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
          </div>

          {gig.subcategory && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Subcategory</h2>
              <p className="text-gray-700">{gig.subcategory}</p>
            </div>
          )}

          {poster && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Posted By</h2>
              <p className="text-gray-700">{poster.name}</p>
              {poster.email && (
                <p className="text-sm text-gray-600">{poster.email}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            {canClaim && (
              <button
                onClick={handleClaimGig}
                disabled={actionLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Claiming...' : 'Claim This Gig'}
              </button>
            )}

            {isPoster && gig.status === 'claimed' && (
              <button
                onClick={handleMarkComplete}
                disabled={actionLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Processing...' : 'Mark as Complete'}
              </button>
            )}

            {isClaimer && gig.status === 'completed' && (
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Leave Feedback
              </button>
            )}
          </div>
        </div>
      </div>

      {showFeedbackModal && (
        <FeedbackModal
          gig={gig}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={loadGig}
        />
      )}
    </div>
  );
};

export default GigDetailsPage;
