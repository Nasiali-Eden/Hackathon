import { MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brown text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">GigMap</span>
            </div>
            <p className="text-muted2">
              Empowering youth through local micro gigs. Connect, learn, and grow with opportunities in your community.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-muted2">
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">
                  Browse Gigs
                </Link>
              </li>
              <li>
                <Link to="/create-gig" className="hover:text-white transition-colors">
                  Post a Gig
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-muted2">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted2/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted2 text-sm">
            © {new Date().getFullYear()} GigMap. All rights reserved.
          </p>
          <p className="text-muted2 text-sm mt-2 sm:mt-0 flex items-center space-x-1">
            Made with <Heart className="h-4 w-4 text-accent" /> for youth empowerment
          </p>
        </div>
      </div>
    </footer>
  );
}

