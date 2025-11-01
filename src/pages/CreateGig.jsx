import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createGig } from '../utils/firestore';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

export default function CreateGig() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Yard Work',
    location: '',
    payment: '',
    paymentType: 'total',
    duration: '',
    durationType: 'hours',
    date: '',
    requirements: ''
  });

  const categories = ['Yard Work', 'Pet Care', 'Tutoring', 'Delivery', 'Tech Help', 'Event Help', 'Other'];
  const locations = ['Downtown', 'North Side', 'South Side', 'East Side', 'West Side'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create a gig');
      }

      const gigData = {
        ...formData,
        providerId: currentUser.uid,
        providerName: currentUser.displayName || 'Anonymous',
        payment: parseFloat(formData.payment),
        duration: parseInt(formData.duration)
      };

      await createGig(gigData);
      navigate('/my-gigs');
    } catch (error) {
      setError(error.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <PlusCircle className="h-8 w-8 text-accent" />
          <h1 className="text-4xl font-bold text-brown">Post a Gig</h1>
        </div>
        <p className="text-lg text-muted">Create an opportunity for youth in your community</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="card space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
              <label htmlFor="title" className="block text-sm font-medium text-brown mb-1">
            Gig Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="input-field"
            placeholder="e.g., Help with yard cleanup"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
              <label htmlFor="description" className="block text-sm font-medium text-brown mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="input-field"
            placeholder="Describe the gig in detail..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-brown mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="input-field"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-brown mb-1">
              Location *
            </label>
            <select
              id="location"
              name="location"
              required
              className="input-field"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="payment" className="block text-sm font-medium text-brown mb-1">
              Payment Amount ($) *
            </label>
            <input
              id="payment"
              name="payment"
              type="number"
              min="0"
              step="0.01"
              required
              className="input-field"
              placeholder="50"
              value={formData.payment}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium text-brown mb-1">
              Payment Type *
            </label>
            <select
              id="paymentType"
              name="paymentType"
              required
              className="input-field"
              value={formData.paymentType}
              onChange={handleChange}
            >
              <option value="total">Total</option>
              <option value="hourly">Per Hour</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-brown mb-1">
              Duration *
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              required
              className="input-field"
              placeholder="2"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="durationType" className="block text-sm font-medium text-brown mb-1">
              Duration Type *
            </label>
            <select
              id="durationType"
              name="durationType"
              required
              className="input-field"
              value={formData.durationType}
              onChange={handleChange}
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-brown mb-1">
            Preferred Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input-field"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-brown mb-1">
            Requirements/Skills Needed
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={3}
            className="input-field"
            placeholder="e.g., Must be 16+, have transportation, basic tools..."
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Creating...' : 'Post Gig'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}

