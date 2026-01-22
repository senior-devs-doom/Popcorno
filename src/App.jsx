import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import CircularProgress from '@mui/joy/CircularProgress';
import Switch from '@mui/joy/Switch';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';

export function useSwipeRail({
  threshold = 120,
  maxAngle = 12,
  onLeft,
  onRight,
}) {
  const ref = useRef(null)

  let startX = 0
  let currentX = 0
  let active = false

  const onPointerDown = (e) => {
    startX = e.clientX
    active = true
    ref.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!active || !ref.current) return

    currentX = e.clientX - startX
    const progress = currentX / threshold
    const angle = Math.max(-1, Math.min(1, progress)) * maxAngle
    const yOffset = Math.abs(currentX) * 0.08;

    ref.current.style.transform = `
      translate(${currentX}px, ${yOffset}px)
      rotate(${angle}deg)
    `;
  }

  const onPointerUp = () => {
    if (!active || !ref.current) return
    active = false

    if (currentX > threshold) onRight?.()
    else if (currentX < -threshold) onLeft?.()

    // snap back
    ref.current.style.transition = 'transform 200ms ease'
    ref.current.style.transform = 'translateX(0) rotate(0deg)'

    setTimeout(() => {
      if (ref.current) ref.current.style.transition = ''
    }, 200)

    currentX = 0
  }

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}

const veryweirdscr = 'f933cff296149f7459a50c0384cada32';
const PROVIDERS = [
  { id: 8, name: 'Netflix' },
  { id: 9, name: 'Amazon' },
  { id: 384, name: 'HBO Max' },
  { id: 337, name: 'Disney+' },
  { id: 2, name: 'Apple TV' },
];

export const theme = extendTheme({
  defaultMode: 'dark',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#FF9900',
          solidHoverBg: '#E68700',
          solidActiveBg: '#CC7800',
          plainColor: '#FF9900',
          outlinedColor: '#FF9900',
          outlinedBorder: '#FF9900',
        },
        background: { body: '#000', surface: '#111' },
        text: { primary: '#fff', secondary: 'rgba(255,255,255,0.85)' },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: '#FF9900',
          solidHoverBg: '#E68700',
          solidActiveBg: '#CC7800',
          plainColor: '#FF9900',
          outlinedColor: '#FF9900',
          outlinedBorder: '#FF9900',
        },
        neutral: {
          solidBg: '#0D0D0D',
          softBg: '#1A1A1A',
          softHoverBg: '#222',
          outlinedBorder: 'rgba(255,255,255,0.18)',
          plainHoverBg: 'rgba(255,255,255,0.1)',
        },
        background: { body: '#000', surface: '#111', popup: '#141414' },
        text: {
          primary: '#FFF',
          secondary: 'rgba(255,255,255,0.85)',
          tertiary: 'rgba(255,255,255,0.65)',
        },
      },
    },
  },

  fontFamily: {
    body: 'Poppins, Inter, Segoe UI, system-ui, sans-serif',
  },

  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        solid: {
          backgroundColor: '#FF9900',
          color: '#000',
          '&:hover': { backgroundColor: '#E68700' },
        },
        plain: {
          color: '#FFF',
          '&:hover': { backgroundColor: 'rgba(255,153,0,0.12)' },
        },
        outlined: {
          borderColor: '#FF9900',
          color: '#FF9900',
          '&:hover': { backgroundColor: 'rgba(255,153,0,0.15)' },
        },
      },
    },

    JoyChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
        outlined: {
          borderColor: 'rgba(255,255,255,0.25)',
          color: '#fff',
          '&:hover': {
            borderColor: '#FF9900',
            color: '#FF9900',
            backgroundColor: 'rgba(255,153,0,0.1)',
          },
        },
        solid: {
          backgroundColor: '#FF9900',
          color: '#000',
          '&:hover': { backgroundColor: '#E68700' },
        },
      },
    },

    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
  },
});

const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
     
    }
  },
};

const LS_KEYS = {
  LIKED: 'popcornoLikedMovieIds',
  FAV_RUNTIME: 'popcornoSessionFavorites',
  DISLIKED: 'popcornoDisliked',
  GENRES: 'popcornoGenres',
  PROVIDERS: 'popcornoProviders',
};

// ─────────────────────────────────────────────
// MEDIA CONTAINER (Poster/Trailer)
// ─────────────────────────────────────────────
function MediaContainer({
  useTrailer,
  trailerKey,
  posterPath,
  onSwipeLeft,
  onSwipeRight,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);
  const swipe = useSwipeRail({
  onLeft: onSwipeLeft,
  onRight: onSwipeRight,
});

  useEffect(() => setImgLoaded(false), [posterPath, useTrailer, trailerKey]);
  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, [posterPath, useTrailer, trailerKey]);

  return (
    <Box
      ref={swipe.ref}
      {...swipe.handlers}
      sx={{
        width: '100%',
        height: '60vh',
        maxHeight: 520,
        position: 'relative',
        borderRadius: useTrailer ? '8px' : '20px',
        overflow: 'hidden',
        background: useTrailer ? '#000' : 'transparent',
        mb: 2,

        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      {useTrailer && trailerKey ? (
        <iframe
          title="Trailer"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      ) : (
        <>
          {posterPath && !imgLoaded && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          {posterPath && (
            <img
              ref={imgRef}
              src={`https://image.tmdb.org/t/p/w780${posterPath}`}
              alt="Poster"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity .25s ease',
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────
// FAVORITES CAROUSEL
// ─────────────────────────────────────────────
function FavoritesCarousel({ favorites }) {
  const containerRef = useRef(null);
  const scroll = (d) =>
    containerRef.current?.scrollBy({
      left: d * (containerRef.current.offsetWidth || 320),
      behavior: 'smooth',
    });

  return (
    <Box sx={{ position: 'relative', my: 2 }}>
      <IconButton
        onClick={() => scroll(-1)}
        sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 1 }}
      >
        <ChevronLeftIcon sx={{ color: '#fff' }} />
      </IconButton>

      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          gap: 2,
          p: 1,
        }}
      >
        {favorites.map((f) => (
          <Card
            key={f.id}
            sx={{
              flex: { xs: '0 0 80%', md: '0 0 auto' },
              scrollSnapAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <Box sx={{ width: '100%', height: { xs: '20vh', sm: '6rem' }, overflow: 'hidden', borderRadius: 1 }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${f.poster_path}`}
                alt={f.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Typography level="body2" sx={{ color: 'white', textAlign: 'center', mt: 1 }}>
              {f.title}
            </Typography>
          </Card>
        ))}
      </Box>

      <IconButton
        onClick={() => scroll(1)}
        sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}
      >
        <ChevronRightIcon sx={{ color: '#fff' }} />
      </IconButton>
    </Box>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
export default function App() {
  const getRandomPage = () => Math.floor(Math.random() * 10) + 1;

  // routing (client-only)
  const [screen, setScreen] = useState('home');

  // game state
  const [genres, setGenres] = useState({});
  const [selectedGenres, setSelectedGenres] = useState(() => LS.get(LS_KEYS.GENRES, []));
  const [selectedProviders, setSelectedProviders] = useState(() => LS.get(LS_KEYS.PROVIDERS, []));
  const [favorites, setFavorites] = useState(() => LS.get(LS_KEYS.FAV_RUNTIME, []));
  const [finals, setFinals] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [useTrailer, setUseTrailer] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', variant: 'solid' });
  const [noResults, setNoResults] = useState(false);
  const [page, setPage] = useState(() => getRandomPage());
  const [totalPages, setTotalPages] = useState(null);
  const [moviePool, setMoviePool] = useState([]);
  const [poolIndex, setPoolIndex] = useState(0);
  const [isPoolReady, setIsPoolReady] = useState(false);
  const [dislikedIds, setDislikedIds] = useState(() => LS.get(LS_KEYS.DISLIKED, []));

  // likes (persistent, local only)
  const [likedIds, setLikedIds] = useState(() => LS.get(LS_KEYS.LIKED, []));
  const [likedDetails, setLikedDetails] = useState([]);

  // computed
  const dbGenresList = useMemo(
    () => Object.entries(genres).map(([id, name]) => ({ id: Number(id), name })),
    [genres]
  );

  // persist to localStorage
  useEffect(() => LS.set(LS_KEYS.GENRES, selectedGenres), [selectedGenres]);
  useEffect(() => LS.set(LS_KEYS.PROVIDERS, selectedProviders), [selectedProviders]);
  useEffect(() => LS.set(LS_KEYS.FAV_RUNTIME, favorites), [favorites]);
  useEffect(() => LS.set(LS_KEYS.DISLIKED, dislikedIds), [dislikedIds]);
  useEffect(() => LS.set(LS_KEYS.LIKED, likedIds), [likedIds]);

  // fetch TMDb genres
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${veryweirdscr}&language=pl-PL`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (data.genres || []).forEach((g) => (map[g.id] = g.name));
        setGenres(map);
      })
      .catch(() => {});
  }, []);

  // simple hash routing
  useEffect(() => {
    window.history.replaceState({ screen }, '');
  }, []);
  useEffect(() => {
    window.history.pushState({ screen }, '', `#${screen}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);
  useEffect(() => {
    const onPop = (e) => setScreen(e.state?.screen || 'home');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // build pool when entering game (only TMDb API)
  useEffect(() => {
    if (screen !== 'game') return;
    if (!selectedGenres.length) {
      setMoviePool([]);
      setPoolIndex(0);
      setIsPoolReady(false);
      return;
    }
    (async () => {
      setIsPoolReady(false);
      try {
        const providerParam = selectedProviders.join('|');

        const fetchMovies = async (useRegion) => {
          const promises = [];
          selectedGenres.forEach((gid) => {
            for (let p = 1; p <= 3; p++) {
              let url =
                `https://api.themoviedb.org/3/discover/movie?` +
                `api_key=${veryweirdscr}&language=pl-PL&include_adult=false` +
                `&sort_by=popularity.desc&with_genres=${gid}` +
                `&with_watch_providers=${providerParam}` +
                `&page=${p}`;
              if (useRegion) url += `&watch_region=PL`;
              promises.push(
                fetch(url)
                  .then((res) => {
                    if (!res.ok) throw new Error('TMDb error');
                    return res.json();
                  })
                  .then((d) => d.results || [])
              );
            }
          });
          const pages = await Promise.all(promises);
          return pages.flat();
        };

        const dedupe = (arr) => {
          const seen = new Set();
          return arr.filter(
            (m) => m && !seen.has(m.id) && !dislikedIds.includes(m.id) && seen.add(m.id)
          );
        };

        let pool = dedupe(await fetchMovies(true));
        if (pool.length === 0) pool = dedupe(await fetchMovies(false));

        // shuffle
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        setMoviePool(pool);
        setPoolIndex(0);
        setIsPoolReady(true);
      } catch (e) {
        setSnack({ open: true, message: 'Nie udało się załadować filmów', variant: 'danger' });
        setMoviePool([]);
        setPoolIndex(0);
        setIsPoolReady(true);
      }
    })();
  }, [screen, selectedGenres, selectedProviders, dislikedIds]);

  // load trailer for current movie
  useEffect(() => {
    const cm = moviePool[poolIndex];
    if (!cm) {
      setTrailer(null);
      return;
    }
    setTrailer(null);
    fetch(`https://api.themoviedb.org/3/movie/${cm.id}/videos?api_key=${veryweirdscr}&language=pl-PL`)
      .then((r) => r.json())
      .then((d) => {
        const t = (d.results || []).find((v) => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(t ? t.key : null);
      })
      .catch(() => setTrailer(null));
  }, [moviePool, poolIndex]);

  // build liked details for Likes screen (local likedIds only)
  useEffect(() => {
    if (!likedIds.length) {
      setLikedDetails([]);
      return;
    }
    Promise.all(
      likedIds.map((id) =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${veryweirdscr}&language=pl-PL`)
          .then((r) => r.json())
          .catch(() => null)
      )
    )
      .then((ms) => setLikedDetails(ms.filter(Boolean)))
      .catch(() => {});
  }, [likedIds, screen]);

  // helpers
  const currentMovie = moviePool[poolIndex];
  const renderGenres = (ids) => ids?.map((id) => genres[id]).filter(Boolean).join(', ');

 const resetGame = ({
  keepPrefs = true,   // zostaw wybrane gatunki / platformy
  keepLikes = true,   // zostaw lokalne ❤️
} = {}) => {
  setFavorites([]);
  setFinals([]);
  setTrailer(null);
  setUseTrailer(false);
  setNoResults(false);
  setPage(getRandomPage());
  setMoviePool([]);
  setPoolIndex(0);

  // nowa gra nie powinna pamiętać „👎”
  setDislikedIds([]);

  if (!keepPrefs) {
    setSelectedGenres([]);
    setSelectedProviders([]);
  }
  if (!keepLikes) {
    setLikedIds([]);
  }
};

  const handleNext = (liked) => {
    if (!isPoolReady) return;
    const cm = currentMovie;
    if (!cm) return;

    if (!liked) setDislikedIds((prev) => [...prev, cm.id]);

    let newFavs = favorites;
    if (liked) {
      // avoid duplicates in session favorites
      const exists = favorites.some((f) => f.id === cm.id);
      newFavs = exists ? favorites : [...favorites, cm];
      setFavorites(newFavs);
    }

    // advance
    const next = poolIndex + 1 < moviePool.length ? poolIndex + 1 : 0;
    setPoolIndex(next);

    // if 5+ favorites → compute finals via TMDb recommendations
    if (newFavs.length >= 5) {
      (async () => {
        try {
          const recArrays = await Promise.all(
            newFavs.map((f) =>
              fetch(
                `https://api.themoviedb.org/3/movie/${f.id}/recommendations?api_key=${veryweirdscr}&language=pl-PL`
              )
                .then((r) => r.json())
                .then((d) => d.results || [])
            )
          );
          const allRecs = recArrays.flat();
          const freq = new Map();
          const byId = new Map();
          allRecs.forEach((r) => {
            if (!r?.id) return;
            byId.set(r.id, r);
            freq.set(r.id, (freq.get(r.id) || 0) + 1);
          });
          const result = [...freq.entries()]
            .map(([id, count]) => ({ movie: byId.get(id), count }))
            .sort(
              (a, b) =>
                b.count - a.count ||
                (b.movie?.vote_average || 0) - (a.movie?.vote_average || 0)
            )
            .map((x) => x.movie)
            .filter(
              (m) =>
                m &&
                !newFavs.some((f) => f.id === m.id) &&
                !dislikedIds.includes(m.id) &&
                m.genre_ids?.some((g) => selectedGenres.includes(g))
            )
            .slice(0, 3);

          setFinals(result);
          setScreen('final');
        } catch {
          setFinals([]);
          setScreen('final');
        }
      })();
    }
  };

  const handleHeart = (movie) => {
    setLikedIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    setSnack({ open: true, message: 'Dodano do ulubionych (lokalnie)', variant: 'primary' });
  };

  const handleUnlike = (id) => setLikedIds((prev) => prev.filter((x) => x !== id));

    // ─────────────────────────────────────────────
  // MOVIE CATALOG (TMDb-only: search/discover/popular)
  // ─────────────────────────────────────────────
  const [dbQuery, setDbQuery] = useState('');
  const [dbSelectedGenres, setDbSelectedGenres] = useState([]);
  const [dbResults, setDbResults] = useState([]);
  const [dbPage, setDbPage] = useState(1);
  const [dbTotalPages, setDbTotalPages] = useState(1);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    if (screen !== 'database') return;

    const fetchDbMovies = async () => {
      setDbLoading(true);
      setDbError(null);
      try {
        let url = '';

        if (dbQuery.trim().length > 0) {
          // search by title
          url =
            `https://api.themoviedb.org/3/search/movie?api_key=${veryweirdscr}` +
            `&language=pl-PL&query=${encodeURIComponent(dbQuery)}&page=${dbPage}`;
        } else if (dbSelectedGenres.length > 0) {
          // discover by genres
          const genreParam = dbSelectedGenres.join(',');
          url =
            `https://api.themoviedb.org/3/discover/movie?api_key=${veryweirdscr}` +
            `&language=pl-PL&with_genres=${genreParam}&sort_by=popularity.desc&page=${dbPage}`;
        } else {
          // popular fallback
          url =
            `https://api.themoviedb.org/3/movie/popular?api_key=${veryweirdscr}` +
            `&language=pl-PL&page=${dbPage}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setDbResults(data.results || []);
        setDbTotalPages(Math.max(1, data.total_pages || 1));
      } catch (err) {
        console.error('TMDb catalog fetch error:', err);
        setDbError('Nie udało się pobrać danych. Spróbuj ponownie.');
      } finally {
        setDbLoading(false);
      }
    };

    fetchDbMovies();
  }, [screen, dbQuery, dbSelectedGenres, dbPage]);

  // ─────────────────────────────────────────────
  // SETUP: horizontal scroll for genres
  // ─────────────────────────────────────────────
  const genreRef = useRef(null);
  const scrollGenres = (direction) => {
    if (!genreRef.current) return;
    const scrollAmount = genreRef.current.offsetWidth || 320;
    genreRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

    // ─────────────────────────────────────────────
  // MAIN UI STRUCTURE
  // ─────────────────────────────────────────────
  return (
    <CssVarsProvider theme={theme}>
      <Sheet
        sx={{
          minHeight: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 2, sm: 4 },
          py: 3,
          overflowX: 'hidden',
        }}
      >
        {/* HEADER */}
<Box
  sx={{
    width: '100%',
    maxWidth: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  }}
>
  {/* lewa strona: logo + tytuł */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
    <Box
  component="img"
  src="/logo.png"
  alt="Popcorno"
  loading="lazy"
  onClick={() => {
    resetGame();     // czyści bieżącą grę
    setScreen('home'); // przenosi na stronę główną
  }}
  sx={{
    width: 150,
    height: 150,
    objectFit: 'contain',
    borderRadius: 1,
    cursor: 'pointer',          // dodajemy "rączkę" przy hoverze
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)', // delikatne powiększenie przy hoverze
    },
  }}
/>

  </Box>

  {/* prawa strona: przyciski */}
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button
      size="sm"
      variant={screen === 'home' ? 'solid' : 'plain'}
      color="primary"
      onClick={() => {
        resetGame();
        setScreen('home');
      }}
    >
      Start
    </Button>
    <Button
      size="sm"
      variant={screen === 'database' ? 'solid' : 'plain'}
      color="primary"
      onClick={() => setScreen('database')}
    >
      Katalog
    </Button>
    <Button
      size="sm"
      variant={screen === 'likes' ? 'solid' : 'plain'}
      color="primary"
      onClick={() => setScreen('likes')}
    >
      Ulubione
    </Button>
  </Box>
</Box>

        {/* SNACKBAR */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          color={snack.variant}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Snackbar>

        {/* MAIN SCREEN RENDER */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {screen === 'home' && (
            <>
              <Typography
                level="h2"
                sx={{
                  fontWeight: 700,
                  color: '#ff9900',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Wybierz, co lubisz oglądać
              </Typography>
              <Typography level="body1" sx={{ mb: 2, textAlign: 'center', opacity: 0.7 }}>
                Zaznacz ulubione gatunki i platformy, a potem ruszaj do wyboru filmu 🎬
              </Typography>

              <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
                <IconButton
                  onClick={() => scrollGenres(-1)}
                  sx={{ position: 'absolute', left: -10, top: '40%', zIndex: 1 }}
                >
                  <ChevronLeftIcon sx={{ color: '#fff' }} />
                </IconButton>

                <Box
                  ref={genreRef}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': { display: 'none' },
                    px: 5,
                    py: 1,
                  }}
                >
                  {dbGenresList.map((g) => (
                    <Chip
                      key={g.id}
                      variant={selectedGenres.includes(g.id) ? 'solid' : 'outlined'}
                      color="primary"
                      onClick={() =>
                        setSelectedGenres((prev) =>
                          prev.includes(g.id)
                            ? prev.filter((x) => x !== g.id)
                            : [...prev, g.id]
                        )
                      }
                    >
                      {g.name}
                    </Chip>
                  ))}
                </Box>

                <IconButton
                  onClick={() => scrollGenres(1)}
                  sx={{ position: 'absolute', right: -10, top: '40%', zIndex: 1 }}
                >
                  <ChevronRightIcon sx={{ color: '#fff' }} />
                </IconButton>
              </Box>

              <Typography level="body2" sx={{ mb: 1 }}>
                Dostępne platformy:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {PROVIDERS.map((p) => (
                  <Chip
                    key={p.id}
                    variant={selectedProviders.includes(p.id) ? 'solid' : 'outlined'}
                    color="primary"
                    onClick={() =>
                      setSelectedProviders((prev) =>
                        prev.includes(p.id)
                          ? prev.filter((x) => x !== p.id)
                          : [...prev, p.id]
                      )
                    }
                  >
                    {p.name}
                  </Chip>
                ))}
              </Box>

              <Button
  size="lg"
  color="primary"
  onClick={() => {
    if (!selectedGenres.length) {
      setSnack({ open: true, message: 'Wybierz chociaż jeden gatunek!', variant: 'danger' });
      return;
    }
    resetGame();       // <— to robi „od początku”
    setScreen('game');
  }}
>
  🎥 Zaczynamy
</Button>
            </>
          )}

          {screen === 'game' && (
            <Box sx={{ display: ['block', 'flex'], gap: 2, width: '100%' }}>
              {/* LEFT: session favorites */}
              <Box sx={{ width: ['100%', '260px'] }}>
                <Typography level="h4" sx={{ mb: 1, color: '#ff9900' }}>
                  Twoje typy
                </Typography>

                {/* mobile: carousel */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <FavoritesCarousel favorites={favorites} />
                </Box>

                {/* desktop: grid list */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'grid' },
                    gridTemplateColumns: '1fr',
                    gap: 2,
                    overflowY: 'auto',
                    maxHeight: '60vh',
                    pr: 1,
                  }}
                >
                  {favorites.map((f) => (
                    <Card key={f.id} sx={{ background: 'rgba(255,255,255,0.04)' }}>
                      <Box sx={{ width: '100%', height: '6rem', overflow: 'hidden', borderRadius: 1 }}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${f.poster_path}`}
                          alt={f.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Typography level="body2" sx={{ color: 'white', textAlign: 'center', mt: 1 }}>
                        {f.title}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* CENTER: current movie card */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '60vh',
                }}
              >
                {!isPoolReady ? (
                  <CircularProgress color="primary" />
                ) : moviePool.length === 0 ? (
                  <Typography level="body1" sx={{ color: 'white', textAlign: 'center' }}>
                    Brak filmów do wyświetlenia dla wybranych gatunków. Zmień preferencje i spróbuj ponownie.
                  </Typography>
                ) : (
                  (() => {
                    const m = currentMovie;
                    return (
                      <Box sx={{ width: '100%', maxWidth: 560 }}>
                        {/* trailer toggle */}
                        <FormControl orientation="horizontal" sx={{ mb: 2, gap: 1, alignItems: 'center' }}>
                          <FormLabel sx={{ color: 'white' }}>Trailer zamiast plakatu</FormLabel>
                          <Switch checked={useTrailer} onChange={(e) => setUseTrailer(e.target.checked)} />
                        </FormControl>

                        <Card
                          sx={{
                            position: 'relative',
                            mx: 'auto',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '20px',
                            p: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <MediaContainer
                            key={m?.id}
                            useTrailer={useTrailer}
                            trailerKey={trailer}
                            posterPath={m?.poster_path}
                            onSwipeLeft={() => handleNext(false)}
                            onSwipeRight={() => handleNext(true)}
                          />

                          {m && likedIds.includes(m.id) && (
                            <Chip
                              startDecorator={<FavoriteIcon />}
                              variant="soft"
                              color="primary"
                              size="md"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                fontWeight: 700,
                                bgcolor: 'rgba(255,153,0,0.15)',
                                color: '#ff9900',
                                border: '1px solid rgba(255,153,0,0.35)',
                              }}
                            >
                              Ulubione
                            </Chip>
                          )}

                          <CardContent>
                            <Typography level="h3" sx={{ mb: 1, fontWeight: 800 }}>
                              {m?.title}
                            </Typography>
                            <Typography level="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                              Ocena: {m?.vote_average ?? '—'} &middot; {m?.release_date ?? '—'}
                            </Typography>
                            <Typography level="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                              Gatunki: {renderGenres(m?.genre_ids || []) || '—'}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                              {/* Dislike */}
                              <Button
                                size="lg"
                                variant="solid"
                                sx={{
                                  minWidth: 56,
                                  borderRadius: '999px',
                                  bgcolor: '#111',
                                  color: '#fff',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  '&:hover': { bgcolor: '#161616' },
                                }}
                                onClick={() => handleNext(false)}
                              >
                                👎
                              </Button>

                              {/* Like (adds to session favorites & drives finals) */}
                              <Button
                                size="lg"
                                color="primary"
                                variant="solid"
                                sx={{ minWidth: 56, borderRadius: '999px' }}
                                onClick={() => handleNext(true)}
                              >
                                👍
                              </Button>

                              {/* Heart (persistent local likes) */}
                              <Button
                                size="lg"
                                variant="solid"
                                sx={{
                                  minWidth: 56,
                                  borderRadius: '999px',
                                  bgcolor: likedIds.includes(m?.id) ? '#ff9900' : '#222',
                                  color: likedIds.includes(m?.id) ? '#000' : '#fff',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  '&:hover': { opacity: 0.9 },
                                }}
                                onClick={() => m && handleHeart(m)}
                              >
                                ❤️
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    );
                  })()
                )}
              </Box>
            </Box>
          )}

          {screen === 'database' && (
            <Box sx={{ width: '100%', mt: 1 }}>
              {/* SEARCH BAR */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDbPage(1);
                }}
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  width: '100%',
                }}
              >
                <Input
                  placeholder="Wpisz tytuł filmu…"
                  value={dbQuery}
                  onChange={(e) => setDbQuery(e.target.value)}
                  startDecorator={<SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                  sx={{
                    flex: 1,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    borderRadius: 12,
                    '--Input-placeholderOpacity': 0.6,
                    '& input': { color: '#fff' },
                  }}
                />
                <Button color="primary" type="submit" sx={{ px: 3 }}>
                  Szukaj
                </Button>
              </Box>

              {/* GENRE FILTERS */}
              <Typography level="body2" sx={{ mb: 1, opacity: 0.8 }}>
                Filtruj po gatunkach (max 3):
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)', md: 'repeat(6,1fr)' },
                  gap: 1,
                  mb: 2,
                }}
              >
                {dbGenresList.map(({ id, name }) => {
                  const checked = dbSelectedGenres.includes(id);
                  return (
                    <Chip
                      key={id}
                      variant={checked ? 'solid' : 'outlined'}
                      color="primary"
                      onClick={() =>
                        setDbSelectedGenres((prev) => {
                          if (prev.includes(id)) return prev.filter((x) => x !== id);
                          if (prev.length >= 3) return prev;
                          return [...prev, id];
                        })
                      }
                    >
                      {name}
                    </Chip>
                  );
                })}
              </Box>

              {/* RESULTS */}
              {dbLoading ? (
                <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : dbError ? (
                <Alert color="danger" variant="soft" sx={{ my: 2 }}>
                  {dbError}
                </Alert>
              ) : dbResults.length === 0 ? (
                <Typography level="body1" sx={{ textAlign: 'center', opacity: 0.7, py: 6 }}>
                  Brak wyników dla podanych kryteriów.
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3,1fr)' },
                      gap: 2,
                    }}
                  >
                    {dbResults.map((movie) => (
                      <Card
                        key={movie.id}
                        variant="outlined"
                        sx={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 16,
                          overflow: 'hidden',
                          transition: 'transform .2s, box-shadow .2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                              : 'https://via.placeholder.com/342x513?text=Brak+ok%C5%82adki'
                          }
                          alt={movie.title}
                          sx={{ width: '100%', height: 420, objectFit: 'cover', bgcolor: '#111' }}
                        />
                        <CardContent sx={{ p: 2,color: '#C0C0C0', }}>
                          <Typography level="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {movie.title}
                          </Typography>
                          <Typography level="body2" sx={{ opacity: 0.8 }}>
                            {movie.release_date || '—'} &middot; ⭐ {movie.vote_average ?? '—'}
                          </Typography>
                          {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 && (
                            <Typography level="body3" sx={{ opacity: 0.7, mt: 0.5 }}>
                              {renderGenres(movie.genre_ids)}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* PAGINATION */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1.5,
                      mt: 3,
                    }}
                  >
                    <Button
                      size="md"
                      variant="plain"
                      startDecorator={<ChevronLeftIcon />}
                      disabled={dbPage <= 1}
                      onClick={() => setDbPage((p) => Math.max(1, p - 1))}
                    >
                      Poprzednia
                    </Button>
                    <Typography level="body2" sx={{ opacity: 0.8 }}>
                      Strona {dbPage} z {dbTotalPages}
                    </Typography>
                    <Button
                      size="md"
                      variant="plain"
                      endDecorator={<ChevronRightIcon />}
                      disabled={dbPage >= dbTotalPages}
                      onClick={() => setDbPage((p) => Math.min(dbTotalPages, p + 1))}
                    >
                      Następna
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}

          {screen === 'likes' && (
            <Box sx={{ width: '100%' }}>
              <Typography level="h3" sx={{ mb: 2, color: '#ff9900', fontWeight: 800 }}>
                Twoje ulubione
              </Typography>

              {!likedIds.length ? (
                <Typography level="body1" sx={{ opacity: 0.75 }}>
                  Jeszcze nic tu nie ma. W trybie <strong>Game</strong> klikaj ❤️, aby dodać film do ulubionych.
                </Typography>
              ) : likedDetails.length === 0 ? (
                <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3,1fr)' },
                    gap: 2,
                  }}
                >
                  {likedDetails.map((m) => (
                    <Card
                      key={m.id}
                      sx={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          m.poster_path
                            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                            : 'https://via.placeholder.com/342x513?text=Brak+ok%C5%82adki'
                        }
                        alt={m.title}
                        sx={{ width: '100%', height: 420, objectFit: 'cover', bgcolor: '#111' }}
                      />
                      <CardContent sx={{ p: 2 ,color: '#C0C0C0',}}>
                        <Typography level="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {m.title}
                        </Typography>
                        <Typography level="body2" sx={{ opacity: 0.8 }}>
                          {m.release_date || '—'} &middot; ⭐ {m.vote_average ?? '—'}
                        </Typography>
                        {Array.isArray(m.genres) ? (
                          <Typography level="body3" sx={{ opacity: 0.7, mt: 0.5 }}>
                            {m.genres.map((g) => g.name).join(', ')}
                          </Typography>
                        ) : (
                          Array.isArray(m.genre_ids) && (
                            <Typography level="body3" sx={{ opacity: 0.7, mt: 0.5 }}>
                              {renderGenres(m.genre_ids)}
                            </Typography>
                          )
                        )}
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="plain"
                            color="primary"
                            onClick={() => handleUnlike(m.id)}
                          >
                            Usuń z ulubionych
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {screen === 'final' && (
            <Box sx={{ width: '100%', py: 2 }}>
              <Typography
                level="h3"
                sx={{ textAlign: 'center', mb: 1, color: '#ff9900', fontWeight: 800 }}
              >
                Podsumowanie
              </Typography>
              <Typography level="body1" sx={{ textAlign: 'center', opacity: 0.8, mb: 3 }}>
                Na podstawie Twoich wyborów proponujemy te tytuły:
              </Typography>

              {finals.length === 0 ? (
                <Typography level="body1" sx={{ textAlign: 'center', opacity: 0.75 }}>
                  Brak gotowych propozycji. Dodaj przynajmniej 5 „lubię” w trybie gry.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  {finals.map((f) => (
                    <Card
                      key={f.id}
                      variant="plain"
                      sx={{
                        width: 240,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 16,
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ width: '100%', height: 320, overflow: 'hidden', bgcolor: '#111' }}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${f.poster_path}`}
                          alt={f.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2 ,color: '#C0C0C0',}}>
                        <Typography level="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
                          {f.title}
                        </Typography>
                        <Typography level="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                          ⭐ {f.vote_average ?? '—'}
                        </Typography>
                        <Typography level="body3" sx={{ opacity: 0.7 }}>
                          {Array.isArray(f.genre_ids) ? renderGenres(f.genre_ids) : '—'}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button variant="plain" onClick={() => setScreen('home')}>
                  Wróć do startu
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    resetGame();
                    setScreen('game');
                  }}
                >
                  Zagraj ponownie
                </Button>
              </Box>

              {/* Twoje typy (z sesji) */}
              {favorites.length > 0 && (
                <>
                  <Typography
                    level="h4"
                    sx={{ mt: 4, mb: 1, textAlign: 'center', color: '#ff9900', fontWeight: 800 }}
                  >
                    Twoje typy
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {favorites.map((f) => (
                      <Card
                        key={f.id}
                        variant="plain"
                        sx={{
                          width: 200,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 16,
                          overflow: 'hidden',
                        }}
                      >
                        <Box sx={{ width: '100%', height: 280, overflow: 'hidden', bgcolor: '#111' }}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${f.poster_path}`}
                            alt={f.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography level="h6" sx={{ mb: 0.5, fontWeight: 700 }}>
                            {f.title}
                          </Typography>
                          <Typography level="body3" sx={{ opacity: 0.75 }}>
                            {renderGenres(f.genre_ids || [])}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* FOOTER */}
          <Box
            component="footer"
            sx={{
              width: '100%',
              maxWidth: 900,
              mt: 'auto',
              py: 4,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Box
              sx={{
                display: { xs: 'block', md: 'flex' },
                justifyContent: 'space-between',
                gap: 4,
                mb: 2,
              }}
            >
              <Box>
                <Typography level="h5" sx={{ color: '#ff9900', mb: 1, fontWeight: 800 }}>
                  Popcorno
                </Typography>
                <Typography level="body2" sx={{ lineHeight: 1.8 }}>
                  O projekcie<br />
                  Korzystamy z TMDb API<br />
                </Typography>
              </Box>

              <Box>
                <Typography level="h6" sx={{ color: '#ff9900', mb: 1 }}>
                  Pomoc
                </Typography>
                <Typography level="body2" sx={{ lineHeight: 1.8 }}>
                  FAQ<br />
                  Prywatność i cookies<br />
                  Kontakt
                </Typography>
              </Box>

            
            </Box>

            <Typography
              level="body3"
              sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}
            >
              © {new Date().getFullYear()} Popcorno. Wszelkie prawa zastrzeżone.
            </Typography>
          </Box>
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}


