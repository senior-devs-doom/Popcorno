import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Snackbar from '@mui/joy/Snackbar';

import { TMDB_API_KEY } from './constants/tmdb';
import { theme } from './theme/theme';
import { LS } from './utils/localStorage';
import { LS_KEYS } from './constants/lsKeys';

import Header from './components/Header';
import Footer from './components/Footer';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import DatabaseScreen from './screens/DatabaseScreen';
import LikesScreen from './screens/LikesScreen';
import FinalScreen from './screens/FinalScreen';

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
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=pl-PL`)
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
                `api_key=${TMDB_API_KEY}&language=pl-PL&include_adult=false` +
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
    fetch(`https://api.themoviedb.org/3/movie/${cm.id}/videos?api_key=${TMDB_API_KEY}&language=pl-PL`)
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
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=pl-PL`)
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
                `https://api.themoviedb.org/3/movie/${f.id}/recommendations?api_key=${TMDB_API_KEY}&language=pl-PL`
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
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}` +
            `&language=pl-PL&query=${encodeURIComponent(dbQuery)}&page=${dbPage}`;
        } else if (dbSelectedGenres.length > 0) {
          // discover by genres
          const genreParam = dbSelectedGenres.join(',');
          url =
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}` +
            `&language=pl-PL&with_genres=${genreParam}&sort_by=popularity.desc&page=${dbPage}`;
        } else {
          // popular fallback
          url =
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}` +
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
<Header screen={screen} setScreen={setScreen} resetGame={resetGame} />

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
            <HomeScreen
              dbGenresList={dbGenresList}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              scrollGenres={scrollGenres}
              genreRef={genreRef}
              setSnack={setSnack}
              resetGame={resetGame}
              setScreen={setScreen}
            />
          )}

          {screen === 'game' && (
            <GameScreen
              favorites={favorites}
              isPoolReady={isPoolReady}
              moviePool={moviePool}
              currentMovie={currentMovie}
              useTrailer={useTrailer}
              setUseTrailer={setUseTrailer}
              trailer={trailer}
              handleNext={handleNext}
              likedIds={likedIds}
              handleHeart={handleHeart}
              renderGenres={renderGenres}
            />
          )}

          {screen === 'database' && (
            <DatabaseScreen
              dbQuery={dbQuery}
              setDbQuery={setDbQuery}
              dbSelectedGenres={dbSelectedGenres}
              setDbSelectedGenres={setDbSelectedGenres}
              dbResults={dbResults}
              dbPage={dbPage}
              setDbPage={setDbPage}
              dbTotalPages={dbTotalPages}
              dbLoading={dbLoading}
              dbError={dbError}
              dbGenresList={dbGenresList}
              renderGenres={renderGenres}
            />
          )}

          {screen === 'likes' && (
            <LikesScreen
              likedIds={likedIds}
              likedDetails={likedDetails}
              handleUnlike={handleUnlike}
              renderGenres={renderGenres}
            />
          )}

          {screen === 'final' && (
            <FinalScreen
              finals={finals}
              favorites={favorites}
              renderGenres={renderGenres}
              resetGame={resetGame}
              setScreen={setScreen}
            />
          )}

          <Footer />
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}
