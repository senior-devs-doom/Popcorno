import React, { useState, useEffect, useMemo, useRef } from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import Snackbar from "@mui/joy/Snackbar";
import "./App.css";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { solidBg: "#ff9900", solidHoverBg: "#e68900", plainColor: "#ff9900" },
        background: { body: "#000" },
        text: { primary: "#fff" },
      },
    },
  },
});

const API_KEY = "f933cff296149f7459a50c0384cada32";
const PROVIDERS = [
  { id: 8, name: "Netflix" },
  { id: 9, name: "Amazon" },
  { id: 384, name: "HBO Max" },
  { id: 337, name: "Disney+" },
  { id: 2, name: "Apple TV" },
];

export default function App() {
  const [screen, setScreen] = useState("home");

  // gatunki
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(() => JSON.parse(localStorage.getItem("selectedGenres") || "[]"));

  // platformy
  const [pickedProviders, setPickedProviders] = useState(() =>
    JSON.parse(localStorage.getItem("selectedProviders") || "[]")
  );

  // gra
  const [loading, setLoading] = useState(false);
  const [pool, setPool] = useState([]);
  const [poolIdx, setPoolIdx] = useState(0);
  const [movie, setMovie] = useState(null);
  const [dislikedIds, setDislikedIds] = useState(() => JSON.parse(localStorage.getItem("dislikedIds") || "[]"));
  const [sessionFavs, setSessionFavs] = useState(() => JSON.parse(localStorage.getItem("sessionFavs") || "[]"));
  const [likedIds, setLikedIds] = useState(() => JSON.parse(localStorage.getItem("likedIds") || "[]"));
  const [snack, setSnack] = useState({ open: false, message: "", color: "neutral" });

  // zapisy
  useEffect(() => localStorage.setItem("selectedGenres", JSON.stringify(selected)), [selected]);
  useEffect(() => localStorage.setItem("selectedProviders", JSON.stringify(pickedProviders)), [pickedProviders]);
  useEffect(() => localStorage.setItem("dislikedIds", JSON.stringify(dislikedIds)), [dislikedIds]);
  useEffect(() => localStorage.setItem("sessionFavs", JSON.stringify(sessionFavs)), [sessionFavs]);
  useEffect(() => localStorage.setItem("likedIds", JSON.stringify(likedIds)), [likedIds]);

  // pobranie listy gatunków
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`)
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []))
      .catch(() => {});
  }, []);

  const toggleGenre = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleProvider = (id) => {
    setPickedProviders((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // z nazwami gatunków do wyświetlania
  const genreName = (id) => genres.find((g) => g.id === id)?.name || "";
  const movieGenres = (ids = []) => ids.map(genreName).filter(Boolean).join(", ");

  // budowa puli filmów
  const buildPool = async () => {
    if (!selected.length) {
      setSnack({ open: true, message: "Wybierz chociaż jeden gatunek :)", color: "danger" });
      return;
    }
    setLoading(true);
    try {
      const providerParam = pickedProviders.join("|"); // jak nic wybrane, TMDb i tak pokaże wszystko
      const pagesToHit = [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 10)); // pseudo los
      const urls = selected.flatMap((gid) =>
        pagesToHit.map(
          (p) =>
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pl-PL` +
            `&include_adult=false&sort_by=popularity.desc&with_genres=${gid}` +
            `&page=${p}` +
            (providerParam ? `&with_watch_providers=${providerParam}&watch_region=PL` : `&watch_region=PL`)
        )
      );

      const chunks = await Promise.all(
        urls.map((u) =>
          fetch(u)
            .then((r) => (r.ok ? r.json() : { results: [] }))
            .then((d) => d.results || [])
            .catch(() => [])
        )
      );
      const flat = chunks.flat();

      // deduplikacja + wyrzucamy dislike
      const seen = new Set();
      const cleaned = flat.filter((m) => m?.id && !seen.has(m.id) && !dislikedIds.includes(m.id) && seen.add(m.id));

      // tasowanie
      for (let i = cleaned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cleaned[i], cleaned[j]] = [cleaned[j], cleaned[i]];
      }

      setPool(cleaned);
      setPoolIdx(0);
      setMovie(cleaned[0] || null);
      if (!cleaned.length) setSnack({ open: true, message: "Nie mam nic dla tego zestawu :(", color: "warning" });
    } finally {
      setLoading(false);
    }
  };

  // next/prev w puli
  const nextMovie = () => {
    if (!pool.length) return;
    const n = (poolIdx + 1) % pool.length;
    setPoolIdx(n);
    setMovie(pool[n]);
  };

  // akcje
  const onDislike = () => {
    if (!movie) return;
    setDislikedIds((prev) => [...prev, movie.id]);
    setSnack({ open: true, message: "meh 😐", color: "neutral" });
    nextMovie();
  };

  const onLike = () => {
    if (!movie) return;
    // do sesji bez duplikatów
    setSessionFavs((prev) => (prev.some((x) => x.id === movie.id) ? prev : [...prev, movie]));
    setSnack({ open: true, message: "dodane do sesji 👍", color: "primary" });
    nextMovie();
  };

  const onHeart = () => {
    if (!movie) return;
    setLikedIds((prev) => (prev.includes(movie.id) ? prev : [...prev, movie.id]));
    setSnack({ open: true, message: "ulubione (lokalnie) ❤️", color: "primary" });
  };

  // mini pasek ulubionych z sesji
  const FavStrip = () => (
    <Box
      sx={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": { height: 6 },
      }}
    >
      {sessionFavs.map((m) => (
        <Card key={m.id} variant="outlined" sx={{ minWidth: 120, background: "rgba(255,255,255,.05)" }}>
          <Box
            component="img"
            src={m.poster_path ? `https://image.tmdb.org/t/p/w185${m.poster_path}` : ""}
            alt={m.title}
            sx={{ width: "100%", height: 160, objectFit: "cover", background: "#111" }}
          />
          <CardContent sx={{ p: 1 }}>
            <Typography level="body3" sx={{ textAlign: "center" }}>
              {m.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <CssVarsProvider theme={theme}>
      <Sheet sx={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", flexDirection: "column" }}>
        {/* góra */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography level="h3" sx={{ color: "#ff9900", fontWeight: 800 }}>
            🍿 Popcorno
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button size="sm" variant={screen === "home" ? "solid" : "plain"} onClick={() => setScreen("home")}>
              Start
            </Button>
            <Button size="sm" variant={screen === "genres" ? "solid" : "plain"} onClick={() => setScreen("genres")}>
              Gatunki
            </Button>
            <Button size="sm" variant={screen === "providers" ? "solid" : "plain"} onClick={() => setScreen("providers")}>
              Platformy
            </Button>
            <Button size="sm" variant={screen === "game" ? "solid" : "plain"} onClick={() => setScreen("game")}>
              Gra
            </Button>
          </Box>
        </Box>

        {/* środek */}
        <Box sx={{ flex: 1, px: { xs: 2, sm: 3 } }}>
          {screen === "home" && (
            <Box sx={{ maxWidth: 1100, mx: "auto", textAlign: "center" }}>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700 }}>
                Witaj w Popcorno!
              </Typography>
              <Typography sx={{ mt: 2, opacity: 0.85 }}>
                Wybrane: {selected.length} gat., {pickedProviders.length} platform
              </Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                <Button color="primary" onClick={() => setScreen("genres")}>
                  Gatunki
                </Button>
                <Button color="primary" onClick={() => setScreen("providers")}>
                  Platformy
                </Button>
                <Button color="primary" variant="solid" onClick={() => setScreen("game")}>
                  Start gry 🎬
                </Button>
              </Box>
            </Box>
          )}

          {screen === "genres" && (
            <Box sx={{ width: "100%", maxWidth: 650, mx: "auto", textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Wybierz gatunki
              </Typography>
              {genres.length === 0 ? (
                <Typography sx={{ opacity: 0.7 }}>ładowanie...</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {genres.map((g) => (
                    <Checkbox
                      key={g.id}
                      label={g.name}
                      color="primary"
                      checked={selected.includes(g.id)}
                      onChange={() => toggleGenre(g.id)}
                    />
                  ))}
                </Box>
              )}
              <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button color="primary" onClick={() => setScreen("home")}>
                  Zapisz i wróć
                </Button>
                <Button variant="plain" onClick={() => setSelected([])}>
                  wyczyść
                </Button>
              </Box>
            </Box>
          )}

          {screen === "providers" && (
            <Box sx={{ width: "100%", maxWidth: 650, mx: "auto", textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Gdzie oglądasz
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)" }, gap: 8 }}>
                {PROVIDERS.map((p) => {
                  const active = pickedProviders.includes(p.id);
                  return (
                    <Chip key={p.id} variant={active ? "solid" : "outlined"} color="primary" onClick={() => toggleProvider(p.id)}>
                      {p.name}
                    </Chip>
                  );
                })}
              </Box>
              <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button color="primary" onClick={() => setScreen("home")}>
                  Zapisz i wróć
                </Button>
                <Button variant="plain" onClick={() => setPickedProviders([])}>
                  wyczyść
                </Button>
              </Box>
            </Box>
          )}

          {screen === "game" && (
            <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2, flexWrap: "wrap" }}>
                <Typography level="h3" sx={{ color: "#ff9900", fontWeight: 700 }}>
                  Tryb gry
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button size="sm" variant="outlined" onClick={() => setSessionFavs([])}>
                    wyczyść sesję
                  </Button>
                  <Button size="sm" onClick={buildPool}>
                    załaduj pulę
                  </Button>
                  <Button size="sm" color="primary" onClick={movie ? nextMovie : buildPool}>
                    {movie ? "następny" : "losuj"}
                  </Button>
                </Box>
              </Box>

              {sessionFavs.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <FavStrip />
                </Box>
              )}

              <Card
                variant="outlined"
                sx={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {!movie && !loading && (
                  <CardContent sx={{ py: 6 }}>
                    <Typography sx={{ textAlign: "center", opacity: 0.8 }}>
                      kliknij „załaduj pulę” albo „losuj”
                    </Typography>
                  </CardContent>
                )}

                {loading && (
                  <CardContent sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="primary" />
                  </CardContent>
                )}

                {movie && !loading && (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: 360, sm: 420 },
                        background: "#111",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                          alt={movie.title}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Typography>brak plakatu</Typography>
                      )}
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography level="h3" sx={{ mb: 0.5, fontWeight: 800 }}>
                        {movie.title}
                      </Typography>
                      <Typography level="body2" sx={{ opacity: 0.85, mb: 0.5 }}>
                        ⭐ {movie.vote_average ?? "—"} · {movie.release_date || "—"}
                      </Typography>
                      {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 && (
                        <Typography level="body2" sx={{ opacity: 0.75, mb: 2 }}>
                          {movieGenres(movie.genre_ids)}
                        </Typography>
                      )}

                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button onClick={onDislike}>👎</Button>
                        <Button color="primary" onClick={onLike}>
                          👍
                        </Button>
                        <Button variant="outlined" onClick={onHeart}>
                          ❤️
                        </Button>
                      </Box>
                    </CardContent>
                  </>
                )}
              </Card>
            </Box>
          )}
        </Box>

        {/* dół */}
        <Box component="footer" sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: { xs: 2, sm: 3 }, py: 2, opacity: 0.6, fontSize: 12, textAlign: "center" }}>
          © {new Date().getFullYear()} Popcorno
        </Box>

        <Snackbar open={snack.open} autoHideDuration={2200} color={snack.color} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Snackbar>
      </Sheet>
    </CssVarsProvider>
  );
}
