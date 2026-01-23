import React from 'react';
import { Box, Typography, Card, Chip } from '@mui/joy';

export default function AboutScreen() {
  const team = [
    { name: 'Damian Chymkowski', role: 'Cloud Engineer' },
    { name: 'Ada Konarska', role: 'Coordinator' },
    { name: 'Adrian Muniak', role: 'QA Tester' },
    { name: 'Karol Chruzik', role: 'Back-end Developer' },
    { name: 'Łukasz Balwierz', role: 'Front-end Developer' },
    { name: 'Kacper Gorlewicz', role: 'Front-end Developer' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        level="h3"
        sx={{ mb: 1, color: '#ff9900', fontWeight: 900, textAlign: 'center', letterSpacing: 0.5 }}
      >
        O nas
      </Typography>

      <Typography level="body1" sx={{ opacity: 0.9, textAlign: 'center', mb: 3, color: 'rgba(255,255,255,0.85)' }}>
        Poznaj ekipę, która go zrobiła.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {team.map((p) => (
          <Card
            key={p.name}
            sx={{
              p: 2.2,
              borderRadius: 18,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,153,0,0.18)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(600px 200px at 20% 0%, rgba(255,153,0,0.14), transparent 60%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography
                level="h4"
                sx={{
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 0.2,
                  textShadow: '0 8px 18px rgba(0,0,0,0.6)',
                }}
              >
                <Box component="span" sx={{ color: '#ff9900' }}>
                  {p.name}
                </Box>
              </Typography>

              <Typography
                level="body2"
                sx={{
                  mt: 0.5,
                  color: 'rgba(255,255,255,0.92)',
                  fontWeight: 700,
                }}
              >
                {p.role}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Typography
        level="body3"
        sx={{
          mt: 3,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.65)',
        }}
      >
      </Typography>
    </Box>
  );
}
