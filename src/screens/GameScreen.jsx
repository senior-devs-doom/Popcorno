import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, CircularProgress, FormControl, FormLabel, Switch } from '@mui/joy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MediaContainer from '../components/MediaContainer';
import FavoritesCarousel from '../components/FavoritesCarousel';

export default function GameScreen({
  favorites,
  isPoolReady,
  moviePool,
  currentMovie,
  useTrailer,
  setUseTrailer,
  trailer,
  handleNext,
  likedIds,
  handleHeart,
  renderGenres,
}) {
  return (
    <Box sx={{ display: ['block', 'flex'], gap: 2, width: '100%' }}>
      {/* LEFT */}
      <Box sx={{ width: ['100%', '260px'] }}>
        <Typography level="h4" sx={{ mb: 1, color: '#ff9900' }}>
          Twoje typy
        </Typography>

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <FavoritesCarousel favorites={favorites} />
        </Box>

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

      {/* CENTER */}
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

                      <Button
                        size="lg"
                        color="primary"
                        variant="solid"
                        sx={{ minWidth: 56, borderRadius: '999px' }}
                        onClick={() => handleNext(true)}
                      >
                        👍
                      </Button>

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
  );
}
