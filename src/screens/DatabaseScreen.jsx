import React from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Input, CircularProgress, Alert } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function DatabaseScreen({
  dbQuery,
  setDbQuery,
  dbSelectedGenres,
  setDbSelectedGenres,
  dbResults,
  dbPage,
  setDbPage,
  dbTotalPages,
  dbLoading,
  dbError,
  dbGenresList,
  renderGenres,
}) {
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          setDbPage(1);
        }}
        sx={{ display: 'flex', gap: 1, mb: 2, width: '100%' }}
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
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 24px rgba(0,0,0,0.45)' },
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
                <CardContent sx={{ p: 2, color: '#C0C0C0' }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, mt: 3 }}>
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
  );
}
