import { Link } from 'react-router-dom';
import { Film, Mail, Phone, MapPin, Share2, Camera, PlayCircle, Code2 } from 'lucide-react';
import Logo from './Logo';

const footerLinks = {
  Movies: [
    { label: 'Now Showing', path: '/movies' },
    { label: 'Coming Soon', path: '/movies?status=upcoming' },
    { label: 'Top Rated', path: '/movies?sort=-rating' },
    { label: 'Trending', path: '/movies?trending=true' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Blog', path: '/blog' },
  ],
  Support: [
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Refund Policy', path: '/refunds' },
    { label: 'Privacy Policy', path: '/privacy' },
  ],
};

const socials = [
  { icon: Share2, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: PlayCircle, href: '#', label: 'YouTube' },
  { icon: Code2, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="bg-cinema-dark border-t border-cinema-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo height={32} />
            </Link>
            <p className="text-cinema-muted text-sm leading-relaxed mb-6 max-w-xs">
              Experience cinema like never before. Book your tickets seamlessly and enjoy the magic of movies.
            </p>
            <div className="space-y-2 text-sm text-cinema-muted">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-cinema-red" /><span>support@cineflow.com</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-cinema-red" /><span>+91 1800-CINEFLOW</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cinema-red" /><span>Mumbai, India</span></div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-cinema-red font-semibold text-sm uppercase tracking-widest mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link to={path} className="text-cinema-muted hover:text-cinema-off-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-cinema-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cinema-muted text-sm">
            © {new Date().getFullYear()} CineFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-cinema-card border border-cinema-border flex items-center justify-center text-cinema-muted hover:text-cinema-red hover:border-cinema-red transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
