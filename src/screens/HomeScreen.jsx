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

<Box
  sx={{
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
    py: 1,
    mb: 2,
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
  variant="solid"
  sx={{
    px: 4,
    py: 1.3,
    borderRadius: 999,
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',

    background: 'linear-gradient(180deg, #FFB13B 0%, #FF9900 55%, #E68700 100%)',
    color: '#000',
    boxShadow: '0 14px 30px rgba(255,153,0,0.22), 0 0 0 1px rgba(255,153,0,0.35) inset',

    '&:hover': {
      filter: 'brightness(1.05)',
      boxShadow: '0 18px 40px rgba(255,153,0,0.28), 0 0 0 1px rgba(255,153,0,0.45) inset',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0px)',
      filter: 'brightness(0.98)',
    },
  }}
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
