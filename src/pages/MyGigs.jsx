import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getGigs, getApplicationsByUser } from '../utils/firestore';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Calendar, Eye, PlusCircle, Briefcase } from 'lucide-react';

export default function MyGigs() {
  const { currentUser, userProfile } = useAuth();
  const [myPostedGigs, setMyPostedGigs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('posted');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Load gigs I posted
      const postedGigs = await getGigs({ providerId: currentUser.uid });
      setMyPostedGigs(postedGigs);
      
      // Load gigs I applied to
      const applications = await getApplicationsByUser(currentUser.uid);
      setMyApplications(applications);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-brown mb-2">My Gigs</h1>
        <p className="text-lg text-muted">Manage your posted gigs and track your applications</p>
      </div>

      {/* Tabs */}
      {(myPostedGigs.length > 0 || myApplications.length > 0 || userProfile?.userType === 'gigProvider') && (
        <div className="flex space-x-4 mb-6 border-b border-muted2/30">
          {(userProfile?.userType === 'gigProvider' || myPostedGigs.length > 0) && (
            <button
              onClick={() => setActiveTab('posted')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'posted'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted hover:text-text'
              }`}
            >
              My Posted Gigs ({myPostedGigs.length})
            </button>
          )}
          {(userProfile?.userType === 'gigSeeker' || myApplications.length > 0) && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'applications'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted hover:text-text'
              }`}
            >
              My Applications ({myApplications.length})
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {activeTab === 'posted' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/create-gig"
              className="inline-flex items-center space-x-2 btn-primary"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Post a New Gig</span>
            </Link>
          </div>

          {myPostedGigs.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="h-12 w-12 text-muted2 mx-auto mb-4" />
              <p className="text-xl text-muted mb-4">You haven't posted any gigs yet</p>
              <Link to="/create-gig" className="btn-primary inline-block">
                Post Your First Gig
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPostedGigs.map((gig, index) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-muted2/30 text-muted'
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brown mb-2">{gig.title}</h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{gig.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm text-muted">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${gig.payment} {gig.paymentType === 'hourly' ? '/hour' : 'total'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {gig.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {gig.duration} {gig.durationType}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-muted2/30">
                    <Link
                      to={`/gig/${gig.id}`}
                      className="text-accent font-semibold text-sm hover:underline flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div>
          {myApplications.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="h-12 w-12 text-muted2 mx-auto mb-4" />
              <p className="text-xl text-muted mb-4">You haven't applied to any gigs yet</p>
              <Link to="/browse" className="btn-primary inline-block">
                Browse Available Gigs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          application.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {application.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-muted text-sm mb-2">
                        Applied on {formatDate(application.appliedAt)}
                      </p>
                      {application.message && (
                        <p className="text-text text-sm italic">
                          "{application.message}"
                        </p>
                      )}
                    </div>
                    {application.gigId && (
                      <Link
                        to={`/gig/${application.gigId}`}
                        className="btn-secondary text-sm"
                      >
                        View Gig
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

