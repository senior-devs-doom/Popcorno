import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/joy';
import { useSwipeRail } from '../utils/useSwipeRail';

export default function MediaContainer({
  useTrailer,
  trailerKey,
  posterPath,
  onSwipeLeft,
  onSwipeRight,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  const swipe = useSwipeRail({
    onLeft: onSwipeLeft,
    onRight: onSwipeRight,
  });

  useEffect(() => setImgLoaded(false), [posterPath, useTrailer, trailerKey]);
  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, [posterPath, useTrailer, trailerKey]);

  return (
    <Box
      ref={swipe.ref}
      {...swipe.handlers}
      sx={{
        width: '100%',
        height: '60vh',
        maxHeight: 520,
        position: 'relative',
        borderRadius: useTrailer ? '8px' : '20px',
        overflow: 'hidden',
        background: useTrailer ? '#000' : 'transparent',
        mb: 2,

        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      {useTrailer && trailerKey ? (
        <iframe
          title="Trailer"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      ) : (
        <>
          {posterPath && !imgLoaded && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          {posterPath && (
            <img
              ref={imgRef}
              src={`https://image.tmdb.org/t/p/w780${posterPath}`}
              alt="Poster"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity .25s ease',
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}
    </Box>
  );
}
