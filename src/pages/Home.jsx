import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, TrendingUp, Users, Shield } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Local Opportunities',
      description: 'Find gigs right in your neighborhood. No long commutes, just local connections.'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Flexible Schedule',
      description: 'Work on your own time. Perfect for students and those balancing multiple commitments.'
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Quick Earnings',
      description: 'Get paid fast for short-term gigs. Build your skills while earning money.'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Skill Building',
      description: 'Develop real-world skills through diverse gig opportunities.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Focus',
      description: 'Connect with local people and build relationships in your area.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Verified',
      description: 'Trusted platform with verified users and secure transactions.'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-brown mb-6">
            Empower Youth Through
            <span className="text-accent"> Local Gigs</span>
          </h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Connect young people with short-term, skill-building opportunities in their community. 
            Find gigs, build skills, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="btn-primary text-lg px-8 py-3">
              Browse Gigs
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brown mb-4">Why GigMap?</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need to start earning and building skills in your local community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-brown mb-2">{feature.title}</h3>
              <p className="text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brown text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-muted2">
            Join thousands of youth finding opportunities and building skills in their communities.
          </p>
          <Link to="/register" className="bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent/90 transition-colors inline-block shadow-md">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}

