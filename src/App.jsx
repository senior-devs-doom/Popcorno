import React, { useState } from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
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
  fontFamily: { body: "Poppins, Segoe UI, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif" },
  components: { JoyButton: { styleOverrides: { root: { borderRadius: 999 } } } },
});

export default function App() {
  const [screen, setScreen] = useState("home");

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
        {/* HEADER */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            level="h3"
            sx={{
              fontWeight: 800,
              color: "#ff9900",
              letterSpacing: -0.5,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            🍿 Popcorno
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Button variant={screen === "home" ? "solid" : "plain"} color="primary" size="sm" onClick={() => setScreen("home")}>
              Start
            </Button>
            <Button variant={screen === "database" ? "solid" : "plain"} color="primary" size="sm" onClick={() => setScreen("database")}>
              Katalog
            </Button>
            <Button variant={screen === "likes" ? "solid" : "plain"} color="primary" size="sm" onClick={() => setScreen("likes")}>
              Ulubione
            </Button>
          </Box>
        </Box>

        {/* MAIN */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            pb: { xs: 4, sm: 6 },
            display: "grid",
            placeItems: "center",
          }}
        >
          {screen === "home" && (
            <Box sx={{ textAlign: "center", maxWidth: 720, width: "100%", px: { xs: 1, sm: 0 } }}>
              <Typography
                level="h2"
                sx={{ color: "#ff9900", fontWeight: 700, fontSize: { xs: "1.8rem", sm: "2.2rem" } }}
              >
                Witaj w Popcorno!
              </Typography>
              <Typography level="body1" sx={{ mt: 1.5, opacity: 0.85, fontSize: { xs: 14, sm: 16 } }}>
                To będzie Twoja baza filmowych inspiracji 🍿
              </Typography>
              <Button sx={{ mt: 3 }} size="md" color="primary" onClick={() => setScreen("database")}>
                Zaczynamy 🎬
              </Button>
            </Box>
          )}

          {screen === "database" && (
            <Box sx={{ textAlign: "center", maxWidth: 720, width: "100%" }}>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700, fontSize: { xs: "1.8rem", sm: "2.2rem" } }}>
                Katalog filmów
              </Typography>
              <Typography level="body1" sx={{ mt: 1.5, opacity: 0.85, fontSize: { xs: 14, sm: 16 } }}>
                Tu wkrótce podłączymy TMDb.
              </Typography>
            </Box>
          )}

          {screen === "likes" && (
            <Box sx={{ textAlign: "center", maxWidth: 720, width: "100%" }}>
              <Typography level="h2" sx={{ color: "#ff9900", fontWeight: 700, fontSize: { xs: "1.8rem", sm: "2.2rem" } }}>
                Ulubione
              </Typography>
              <Typography level="body1" sx={{ mt: 1.5, opacity: 0.85, fontSize: { xs: 14, sm: 16 } }}>
                Twoje zapisane typy pojawią się tutaj ❤️
              </Typography>
            </Box>
          )}
        </Box>

        {/* FOOTER */}
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
