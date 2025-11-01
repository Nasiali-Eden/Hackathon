import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getGig, applyToGig } from '../utils/firestore';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Calendar, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function GigDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    try {
      setLoading(true);
      const gigData = await getGig(id);
      if (!gigData) {
        navigate('/browse');
        return;
      }
      
      setGig(gigData);
      
      // Check if user has already applied
      if (currentUser && gigData.applicants?.includes(currentUser.uid)) {
        setHasApplied(true);
      }
    } catch (error) {
      console.error('Error loading gig:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (hasApplied) {
      return;
    }

    setError('');
    setApplying(true);

    try {
      await applyToGig(id, currentUser.uid, {
        message: 'I am interested in this gig!'
      });
      setSuccess(true);
      setHasApplied(true);
      // Reload gig to update applicants
      await loadGig();
    } catch (error) {
      setError(error.message || 'Failed to apply to gig');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!gig) {
    return null;
  }

  const isOwner = currentUser?.uid === gig.providerId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/browse"
        className="inline-flex items-center text-muted hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Browse
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="mb-4">
              <span className="inline-block bg-accent/10 text-accent text-sm font-semibold px-3 py-1 rounded-xl">
                {gig.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-brown mb-4">{gig.title}</h1>
            <div className="flex items-center text-muted mb-6">
              <User className="h-5 w-5 mr-2" />
              <span>Posted by {gig.providerName}</span>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-brown mb-2">Description</h2>
              <p className="text-muted whitespace-pre-line">{gig.description}</p>
            </div>

            {gig.requirements && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-brown mb-2">Requirements</h2>
                <p className="text-muted whitespace-pre-line">{gig.requirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-text">
                <DollarSign className="h-5 w-5 mr-3 text-accent" />
                <div>
                  <p className="text-sm text-muted">Payment</p>
                  <p className="font-semibold text-lg">
                    ${gig.payment} {gig.paymentType === 'hourly' ? '/hour' : 'total'}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-text">
                <MapPin className="h-5 w-5 mr-3 text-accent" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{gig.location}</p>
                </div>
              </div>

              <div className="flex items-center text-text">
                <Clock className="h-5 w-5 mr-3 text-accent" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">
                    {gig.duration} {gig.durationType}
                  </p>
                </div>
              </div>

              {gig.date && (
                <div className="flex items-center text-text">
                  <Calendar className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{formatDate(gig.date)}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-muted2/30">
                <p className="text-sm text-muted mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  gig.status === 'open' 
                    ? 'bg-teal/20 text-teal' 
                    : 'bg-muted2/30 text-muted'
                }`}>
                  {gig.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>

            {currentUser && !isOwner && gig.status === 'open' && (
              <div>
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-teal/20 border-2 border-teal text-teal px-4 py-2 rounded-xl mb-4 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Application submitted!
                  </div>
                )}

                <button
                  onClick={handleApply}
                  disabled={applying || hasApplied}
                  className="w-full btn-primary"
                >
                  {hasApplied ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Applied
                    </span>
                  ) : applying ? (
                    'Applying...'
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            )}

            {!currentUser && (
              <Link to="/login" className="block w-full btn-primary text-center">
                Login to Apply
              </Link>
            )}

            {isOwner && (
              <Link to="/my-gigs" className="block w-full btn-secondary text-center">
                Manage Your Gigs
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

