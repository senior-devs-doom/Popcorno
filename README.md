POP CORNO

Popcorno to webowa aplikacja typu „Tinder dla filmów”, stworzona w ramach projektu semestralnego
Alibaba Cloud – WSB 2025/2026.

Aplikacja pomaga szybko wybrać film „na dziś” – użytkownik ocenia filmy za pomocą like / dislike,
a system na tej podstawie proponuje 3 najlepiej dopasowane tytuły.


JAK DZIAŁA POPCORNO?

1. Użytkownik przegląda filmy w formie kart
2. Każdy film może zostać:
   - polubiony (like)
   - odrzucony (dislike)
3. Na podstawie historii ocen aplikacja:
   - analizuje preferencje użytkownika
   - proponuje 3 rekomendacje filmowe na dziś

Aplikacja inspirowana jest mechaniką Tindera, ale w wersji filmowej.


TECHNOLOGIE

Projekt został zrealizowany z wykorzystaniem:

- React
- Vite
- JavaScript (ES6+)
- HTML5 / CSS3
- ESLint
- Alibaba Cloud (hosting)


STRUKTURA PROJEKTU

Popcorno/
│
├── public/          - pliki statyczne
├── src/             - kod źródłowy
│   ├── components/  - komponenty React
│   ├── pages/       - widoki / strony
│   ├── App.jsx      - główny komponent
│   └── main.jsx     - punkt wejścia
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.txt


INSTALACJA I URUCHOMIENIE

1. Klonowanie repozytorium:
   git clone https://github.com/senior-devs-doom/Popcorno.git

2. Przejście do katalogu projektu:
   cd Popcorno

3. Instalacja zależności:
   npm install

4. Uruchomienie aplikacji:
   npm run dev

5. Build produkcyjny:
   npm run build


LINTOWANIE

Projekt wykorzystuje ESLint do kontroli jakości kodu:
npm run lint


CEL PROJEKTU

Celem aplikacji Popcorno jest:
- stworzenie nowoczesnej aplikacji React
- wykorzystanie mechanizmu rekomendacji
- ułatwienie wyboru filmu na wieczór
- wdrożenie projektu w chmurze Alibaba Cloud


AUTORZY

Projekt zespołowy realizowany w ramach zajęć na WSB
Rok akademicki 2025/2026


LICENCJA

Projekt edukacyjny – do użytku niekomercyjnego.
