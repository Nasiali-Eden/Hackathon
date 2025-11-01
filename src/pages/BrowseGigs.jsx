import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGigs } from '../utils/firestore';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Calendar, Search, Filter } from 'lucide-react';

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const categories = ['all', 'Yard Work', 'Pet Care', 'Tutoring', 'Delivery', 'Tech Help', 'Event Help', 'Other'];
  const locations = ['all', 'Downtown', 'North Side', 'South Side', 'East Side', 'West Side'];

  useEffect(() => {
    loadGigs();
  }, [filterCategory, filterLocation]);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const filters = { status: 'open' };
      if (filterCategory !== 'all') filters.category = filterCategory;
      if (filterLocation !== 'all') filters.location = filterLocation;
      
      const gigsData = await getGigs(filters);
      setGigs(gigsData);
    } catch (error) {
      console.error('Error loading gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-brown mb-2">Browse Gigs</h1>
        <p className="text-lg text-muted">Find opportunities that match your skills and interests</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-5 w-5" />
            <input
              type="text"
              placeholder="Search gigs..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted" />
            <span className="text-sm font-medium text-brown">Category:</span>
            <select
              className="input-field text-sm py-1"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-muted" />
            <span className="text-sm font-medium text-brown">Location:</span>
            <select
              className="input-field text-sm py-1"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredGigs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted">No gigs found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Link to={`/gig/${gig.id}`}>
                <div className="mb-4">
                  <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-xl">
                    {gig.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brown mb-2">{gig.title}</h3>
                <p className="text-muted text-sm mb-4 line-clamp-2">{gig.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-muted text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${gig.payment} {gig.paymentType === 'hourly' ? '/hour' : 'total'}
                  </div>
                  <div className="flex items-center text-muted text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {gig.location}
                  </div>
                  <div className="flex items-center text-muted text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {gig.duration} {gig.durationType}
                  </div>
                  {gig.date && (
                    <div className="flex items-center text-muted text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(gig.date)}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-muted2/30">
                  <span className="text-accent font-semibold text-sm hover:underline">
                    View Details →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

