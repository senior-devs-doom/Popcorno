import React from 'react';
import { Box, Typography, Link } from '@mui/joy';

export default function Footer({ setScreen }) {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        maxWidth: 900,
        mt: 'auto',
        pb: 4,
        pt: 3,
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
            <Link
              component="button"
              onClick={() => setScreen?.('about')}
              sx={{
                p: 0,
                m: 0,
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                '&:hover': { color: '#ff9900', textDecoration: 'underline' },
              }}
            >
              O nas
            </Link>
            <br />
 {/* TMDb (subtelny link na zewnątrz) */}
            <Typography
              level="body3"
              sx={{ mt: 0.6, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}
            >
             Korzystamy z:{' '}
              <Link
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  '&:hover': { color: '#8be9ff', textDecoration: 'underline' },
                }}
              >
                TMDb API
              </Link>{' '}
            </Typography>
            <br />
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
