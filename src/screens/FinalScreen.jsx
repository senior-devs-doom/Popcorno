import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/joy';

export default function FinalScreen({ finals, favorites, renderGenres, resetGame, setScreen }) {
  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Typography level="h3" sx={{ textAlign: 'center', mb: 1, color: '#ff9900', fontWeight: 800 }}>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
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
              <CardContent sx={{ p: 2, color: '#C0C0C0' }}>
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

      {favorites.length > 0 && (
        <>
          <Typography level="h4" sx={{ mt: 4, mb: 1, textAlign: 'center', color: '#ff9900', fontWeight: 800 }}>
            Twoje typy
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
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
  );
}
