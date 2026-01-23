import React from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress } from '@mui/joy';

export default function LikesScreen({ likedIds, likedDetails, handleUnlike, renderGenres }) {
  return (
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
              <CardContent sx={{ p: 2, color: '#C0C0C0' }}>
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
                  <Button variant="plain" color="primary" onClick={() => handleUnlike(m.id)}>
                    Usuń z ulubionych
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
