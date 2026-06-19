import { useEffect, useState } from "react";
import { GameHeader } from "./components/GameHeader";
import Card from "./components/Card";
import { playFlip, playMatch, resumeIfNeeded } from "./utils/sounds";

const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍊",
  "🥝",
  "🍍",
  "🥭",
  "🍍",
  "🍓",
  "🥝",
  "🍊",
  "🍎",
  "🥭",
  "🍇",
  "🍌",
];

let move = 0;
let score = 0;

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchCard, setMatchCard] = useState([]);
  const [isLock, setIsLock] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const toggleSound = () => setSoundOn((s) => !s);

  const initializeGame = () => {
    //suffle the card
    move = 0;
    score = 0;
    const finalCards = cardValues.map((value, idx) => ({
      id: idx,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    // console.log(finalCards)
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (card) => {
    // ensure audio context resumed on first user gesture (only if sound enabled)
    if (soundOn) resumeIfNeeded();

    move++;

    // don't allow click if card is alrady fliped/matched
    if (
      card.isFlipped ||
      card.isMatched ||
      isLock ||
      flippedCards.length === 2
    ) {
      return;
    }

    // play flip sound for the card turn
    if (soundOn) playFlip();

    //Update the card flip state...
    const newCards = cards.map((c) => {
      if (c.id == card.id) {
        return { ...c, isFlipped: true };
      } else {
        return c;
      }
    });

    setCards(newCards);

    const newFlippedCard = [...flippedCards, card.id];
    setFlippedCards(newFlippedCard);

    // check for match if two cards aare flipped
    if (flippedCards.length === 1) {
      setIsLock(true);
      const firstCard = cards[flippedCards[0]];

      if (firstCard.value === card.value) {
        score++;
        setTimeout(() => {
          if (soundOn) playMatch();
          setMatchCard((prev) => [...prev, firstCard.id, card.id]);

          setCards((prev) =>
            prev.map((c) => {
              if (c.id == card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              } else {
                return c;
              }
            }),
          );
          setIsLock(false);
          setFlippedCards([]);
        }, 500);
      } else {
        // flip back card 1 & 2
        setTimeout(() => {
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCard.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });
          setIsLock(false);
          setCards(flippedBackCard);
          setFlippedCards([]);
        }, 700);
      }
    }
  };

  return (
    <div className="app">
      <GameHeader
        score={score}
        move={move}
        onReset={initializeGame}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
