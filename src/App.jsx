import React, { useState, useEffect } from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
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
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedGenres");
    return saved ? JSON.parse(saved) : [];
  });

  // platformy
  const [pickedProviders, setPickedProviders] = useState(() => {
    const saved = localStorage.getItem("selectedProviders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`)
      .then((r) => r.json())
      .then((data) => setGenres(data.genres || []))
      .catch(() => console.log("nie działa tmdb :("));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedGenres", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    localStorage.setItem("selectedProviders", JSON.stringify(pickedProviders));
  }, [pickedProviders]);

  const toggleGenre = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleProvider = (id) => {
    setPickedProviders((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <CssVarsProvider theme={theme}>
      <Sheet
        sx={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            <Button
              size="sm"
              variant={screen === "home" ? "solid" : "plain"}
              color="primary"
              onClick={() => setScreen("home")}
            >
              Start
            </Button>
            <Button
              size="sm"
              variant={screen === "genres" ? "solid" : "plain"}
              color="primary"
              onClick={() => setScreen("genres")}
            >
              Gatunki
            </Button>
            <Button
              size="sm"
              variant={screen === "providers" ? "solid" : "plain"}
              color="primary"
              onClick={() => setScreen("providers")}
            >
              Platformy
            </Button>
          </Box>
        </Box>

        {/* środek */}
        <Box
          sx={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            px: 2,
            textAlign: "center",
          }}
        >
          {screen === "home" && (
            <Box sx={{ maxWidth: 720 }}>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700 }}>
                Witaj w Popcorno!
              </Typography>
              <Typography sx={{ mt: 2, opacity: 0.8 }}>
                Masz już wybrane: {selected.length} gatunków, {pickedProviders.length} platform
              </Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                <Button color="primary" onClick={() => setScreen("genres")}>
                  Wybierz gatunki
                </Button>
                <Button color="primary" variant="outlined" onClick={() => setScreen("providers")}>
                  Wybierz platformy
                </Button>
              </Box>
            </Box>
          )}

          {screen === "genres" && (
            <Box sx={{ width: "100%", maxWidth: 650, textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Wybierz gatunki
              </Typography>

              {genres.length === 0 ? (
                <Typography sx={{ opacity: 0.7 }}>ładowanie...</Typography>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
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
                <Button
                  variant="plain"
                  onClick={() => setSelected([])}
                >
                  wyczyść gatunki
                </Button>
              </Box>
            </Box>
          )}

          {screen === "providers" && (
            <Box sx={{ width: "100%", maxWidth: 650, textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Gdzie oglądasz
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)" },
                  gap: 8,
                }}
              >
                {PROVIDERS.map((p) => {
                  const active = pickedProviders.includes(p.id);
                  return (
                    <Chip
                      key={p.id}
                      variant={active ? "solid" : "outlined"}
                      color="primary"
                      onClick={() => toggleProvider(p.id)}
                    >
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
                  wyczyść platformy
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* dół */}
        <Box
          component="footer"
          sx={{
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 2,
            opacity: 0.6,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Popcorno
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}
