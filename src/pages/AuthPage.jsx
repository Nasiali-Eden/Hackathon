import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signUpWithEmail, signInWithEmail } from '../firebase/auth';
import { updateUserRole } from '../firebase/auth';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userData) {
      if (!userData.role) {
        setNeedsRoleSelection(true);
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (!name || !role) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const result = await signUpWithEmail(email, password, name, role);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const handleRoleSelection = async () => {
    if (!role) {
      setError('Please select a role');
      return;
    }
    setLoading(true);
    const result = await updateUserRole(currentUser.uid, role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (needsRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Select Your Role</h2>
          <div className="space-y-4">
            <button
              onClick={() => setRole('seeker')}
              className={`w-full p-4 rounded-lg border-2 transition ${
                role === 'seeker'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold">Gig Seeker</div>
              <div className="text-sm text-gray-600">I want to find and claim gigs</div>
            </button>
            <button
              onClick={() => setRole('poster')}
              className={`w-full p-4 rounded-lg border-2 transition ${
                role === 'poster'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold">Gig Poster</div>
              <div className="text-sm text-gray-600">I want to post gigs and find help</div>
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <button
            onClick={handleRoleSelection}
            disabled={loading || !role}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className={isSignUp ? 'pb-2' : 'pb-4'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div className="pt-3 pb-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to...
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="seeker"
                    checked={role === 'seeker'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-3"
                    required
                  />
                  <span>Find and claim gigs</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="poster"
                    checked={role === 'poster'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-3"
                  />
                  <span>Post gigs and find help</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full pt-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
