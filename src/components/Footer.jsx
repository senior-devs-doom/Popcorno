import React from 'react';
import { Box, Typography } from '@mui/joy';

export default function Footer() {
  return (
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

      <Typography level="body3" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        © {new Date().getFullYear()} Popcorno. Wszelkie prawa zastrzeżone.
      </Typography>
    </Box>
  );
}
