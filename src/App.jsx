import React, { useState, useEffect } from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
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

export default function App() {
  const [screen, setScreen] = useState("home");
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedGenres");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`)
      .then((r) => r.json())
      .then((data) => {
        setGenres(data.genres || []);
      })
      .catch(() => console.log("nie działa tmdb :("));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedGenres", JSON.stringify(selected));
  }, [selected]);

  const toggleGenre = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
          </Box>
        </Box>

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
            <>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700 }}>
                Witaj w Popcorno!
              </Typography>
              <Typography sx={{ mt: 2, opacity: 0.8 }}>
                Tu wybierzesz gatunki i zrobisz swój filmowy profil 🍿
              </Typography>
              <Button sx={{ mt: 3 }} color="primary" onClick={() => setScreen("genres")}>
                Wybierz gatunki
              </Button>
            </>
          )}

          {screen === "genres" && (
            <Box sx={{ width: "100%", maxWidth: 600, textAlign: "left" }}>
              <Typography level="h3" sx={{ mb: 2, color: "#ff9900" }}>
                Wybierz gatunki, które lubisz
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

              <Box sx={{ mt: 3 }}>
                <Button color="primary" onClick={() => setScreen("home")}>
                  Zapisz i wróć
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}
