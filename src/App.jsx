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
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(() => JSON.parse(localStorage.getItem("selectedGenres") || "[]"));
  const [pickedProviders, setPickedProviders] = useState(() => JSON.parse(localStorage.getItem("selectedProviders") || "[]"));

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
            <Box sx={{ width: "100%", maxWidth: 650, textAlign: "left" }}>
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
            <Box sx={{ width: "100%", maxWidth: 650, textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Gdzie oglądasz
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)" }, gap: 8 }}>
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
                  wyczyść
                </Button>
              </Box>
            </Box>
          )}

          {screen === "game" && (
            <Box sx={{ maxWidth: 700, textAlign: "center" }}>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700 }}>
                🎬 Tryb gry
              </Typography>
              <Typography sx={{ mt: 2, opacity: 0.8 }}>
                Gatunki:{" "}
                {selected.length
                  ? selected.map((id) => genres.find((g) => g.id === id)?.name).join(", ")
                  : "nic nie wybrałeś xd"}
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.8 }}>
                Platformy:{" "}
                {pickedProviders.length
                  ? pickedProviders
                      .map((id) => PROVIDERS.find((p) => p.id === id)?.name)
                      .join(", ")
                  : "brak"}
              </Typography>

              <Button sx={{ mt: 3 }} color="primary" size="lg">
                Losuj film 🍿
              </Button>
            </Box>
          )}
        </Box>

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
