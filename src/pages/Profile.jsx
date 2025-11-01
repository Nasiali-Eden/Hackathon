import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Award, Star } from 'lucide-react';

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bio: bio
      });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-brown mb-8">My Profile</h1>

        <div className="card mb-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-brown mb-2">
                {userProfile?.displayName || currentUser?.displayName || 'User'}
              </h2>
              <div className="space-y-2 text-muted">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  {currentUser?.email}
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {userProfile?.userType === 'gigSeeker' ? 'Gig Seeker' : 'Gig Provider'}
                </div>
                {userProfile?.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-brown">Bio</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <textarea
                className="input-field"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
              />
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  Profile updated successfully!
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setBio(userProfile?.bio || '');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-text whitespace-pre-line">
              {userProfile?.bio || 'No bio yet. Click Edit to add one!'}
            </p>
          )}
        </div>

        {userProfile?.userType === 'gigSeeker' && (
          <div className="card mt-6">
            <h3 className="text-xl font-semibold text-brown mb-4">Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  {userProfile?.completedGigs || 0}
                </div>
                <div className="text-sm text-muted">Completed Gigs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent flex items-center justify-center">
                  <Star className="h-6 w-6 mr-1" />
                  {userProfile?.rating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-muted">Rating</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

