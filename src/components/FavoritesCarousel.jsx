import React, { useRef } from 'react';
import { Box, Card, IconButton, Typography } from '@mui/joy';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function FavoritesCarousel({ favorites }) {
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
