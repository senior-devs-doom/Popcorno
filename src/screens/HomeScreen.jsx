import React from 'react';
import { Typography, Button, Box, Chip, IconButton } from '@mui/joy';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PROVIDERS } from '../constants/providers';

export default function HomeScreen({
  dbGenresList,
  selectedGenres,
  setSelectedGenres,
  selectedProviders,
  setSelectedProviders,
  scrollGenres,
  genreRef,
  setSnack,
  resetGame,
  setScreen,
}) {
  return (
    <>
      <Typography
        level="h2"
        sx={{ fontWeight: 700, color: '#ff9900', textAlign: 'center', mb: 2 }}
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
                  prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id]
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
                prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
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
          resetGame();
          setScreen('game');
        }}
      >
        🎥 Zaczynamy
      </Button>
    </>
  );
}
