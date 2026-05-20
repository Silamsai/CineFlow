import { useRef } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, LogOut, Camera, Heart, Film, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const favMovies = user.favoriteMovies || [];
  const favActors = user.favoriteActors || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-display text-4xl font-bold text-cinema-off-white">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card text-center py-10 px-6">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full rounded-full bg-cinema-dark border-4 border-cinema-red overflow-hidden shadow-[0_0_20px_rgba(229,9,20,0.3)]">
                {user.profileImage || user.picture ? (
                  <img src={user.profileImage || user.picture} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-cinema-off-white">
                    {user.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
              >
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-xs text-white font-medium">Change</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-cinema-off-white mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-cinema-muted mb-6 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>

            <button 
              onClick={handleLogout}
              className="w-full border border-cinema-red/50 text-cinema-red hover:bg-cinema-red hover:text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2">
          <div className="card h-full">
            <h3 className="font-display text-xl font-bold text-cinema-off-white mb-6 border-b border-cinema-border pb-4">
              Account Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-cinema-dark/50 border border-cinema-border/50">
                <div className="w-10 h-10 rounded-lg bg-cinema-black flex items-center justify-center text-cinema-red">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-cinema-muted text-sm mb-1">Full Name</p>
                  <p className="text-cinema-off-white font-medium text-lg">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-cinema-dark/50 border border-cinema-border/50">
                <div className="w-10 h-10 rounded-lg bg-cinema-black flex items-center justify-center text-cinema-red">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-cinema-muted text-sm mb-1">Email Address</p>
                  <p className="text-cinema-off-white font-medium text-lg">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-cinema-dark/50 border border-cinema-border/50">
                <div className="w-10 h-10 rounded-lg bg-cinema-black flex items-center justify-center text-cinema-red">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-cinema-muted text-sm mb-1">Member Since</p>
                  <p className="text-cinema-off-white font-medium text-lg">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favorite Movies */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6 border-b border-cinema-border pb-4">
            <Film className="w-6 h-6 text-cinema-red" />
            <h3 className="font-display text-xl font-bold text-cinema-off-white">Favorite Movies</h3>
          </div>
          
          {favMovies.length === 0 ? (
            <div className="text-center py-8 text-cinema-muted">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven't liked any movies yet.</p>
              <Link to="/movies" className="text-cinema-red hover:underline text-sm mt-2 inline-block">Explore Movies</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favMovies.map((movie, idx) => (
                <Link key={idx} to={`/movies/${movie.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cinema-dark transition-colors group">
                  <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded shadow-lg group-hover:scale-105 transition-transform" />
                  <div>
                    <h4 className="text-cinema-off-white font-medium group-hover:text-cinema-red transition-colors">{movie.title}</h4>
                    <p className="text-cinema-muted text-xs">{movie.genre}</p>
                  </div>
                  <Heart className="w-5 h-5 text-cinema-red ml-auto fill-cinema-red" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Actors */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6 border-b border-cinema-border pb-4">
            <Star className="w-6 h-6 text-cinema-red" />
            <h3 className="font-display text-xl font-bold text-cinema-off-white">Favorite Actors</h3>
          </div>
          
          {favActors.length === 0 ? (
            <div className="text-center py-8 text-cinema-muted">
              <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven't liked any actors yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favActors.map((actor, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-cinema-dark/50 border border-cinema-border/30">
                  <div className="w-10 h-10 rounded-full bg-cinema-card flex items-center justify-center overflow-hidden">
                    {actor.image ? (
                      <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-cinema-muted" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-cinema-off-white text-sm font-medium truncate">{actor.name}</p>
                  </div>
                  <Heart className="w-4 h-4 text-cinema-red ml-auto flex-shrink-0 fill-cinema-red" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
