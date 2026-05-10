import { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Info, Heart, Globe, Droplets } from 'lucide-react';
import './App.css';

interface CatData {
  id: number;
  name: string;
  temperament: string;
  origin: string;
  description: string;
  life_span: string;
  image: string;
  weight: {
    imperial: string;
    metric: string;
  };
}

function App() {
  const [cat, setCat] = useState<CatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchCat = async () => {
    setLoading(true);
    setError(null);
    setImageLoaded(false);
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random');
      if (!response.ok) throw new Error('Failed to fetch cat');
      const data = await response.json();
      if (data.success && data.data) {
        setCat(data.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError('Oops! Failed to load a cat. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <nav className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white/50 dark:bg-darkCard/50 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1.1-3.48 0 0-1.9-6.42-.5-7 1.4-.58 4.6.26 6.38 2.26A9.49 9.49 0 0 1 12 5z"/></svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Cat Explorer
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="w-full max-w-4xl flex-1 flex flex-col gap-6 lg:gap-8 items-center justify-start">
        {/* Image Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="relative w-full h-[50vh] sm:h-[65vh] min-h-[400px] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800/50 ring-1 ring-black/5 dark:ring-white/10 group flex items-center justify-center">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Info className="w-12 h-12 text-red-500 mb-4 opacity-80" />
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            ) : cat ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
                    <Heart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                <div 
                  className={`absolute inset-0 bg-cover bg-center blur-3xl opacity-30 dark:opacity-20 scale-110 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`relative z-10 w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:scale-105'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            ) : null}
          </div>

          <button
            onClick={fetchCat}
            disabled={loading}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Finding a Cat...' : 'Discover New Cat'}
          </button>
        </div>

        {/* Info Section */}
        <div className="w-full flex flex-col gap-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              </div>
            </div>
          ) : cat ? (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 opacity-0 fade-in duration-700 fill-mode-forwards">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                  {cat.name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.temperament?.split(', ').map((temp, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {temp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-darkCard p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Origin</p>
                    <p className="font-semibold">{cat.origin || 'Unknown'}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                  <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-500">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Life Span</p>
                    <p className="font-semibold">{cat.life_span} years</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 sm:col-span-2">
                  <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Weight</p>
                    <p className="font-semibold">{cat.weight?.metric} kg ({cat.weight?.imperial} lbs)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
