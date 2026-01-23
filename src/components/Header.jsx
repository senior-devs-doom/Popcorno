import React from 'react';
import { Box, Button } from '@mui/joy';

export default function Header({ screen, setScreen, resetGame }) {
  return (
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
            resetGame(); // czyści bieżącą grę
            setScreen('home'); // przenosi na stronę główną
          }}
          sx={{
            width: 150,
            height: 150,
            objectFit: 'contain',
            borderRadius: 1,
            cursor: 'pointer', // dodajemy "rączkę" przy hoverze
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
  );
}
