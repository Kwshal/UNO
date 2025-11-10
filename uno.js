const board = document.getElementById("board");
const startButton = document.getElementById("start-button");
const header = document.getElementById("header");
const numberOfPlayersEl = document.querySelector("#number-of-players #players-slider");
const numberOfPlayersOutput = document.querySelector("#number-of-players #players-num");
const numberOfCardsEl = document.querySelector("#number-of-cards #cards-slider");
const numberOfCardsOutput = document.querySelector("#number-of-cards #cards-num");
const house = document.getElementById("house");
const arena = document.getElementById("arena");
const playersEl = document.getElementById("players");

startButton.addEventListener("click", startGame);

let numberOfPlayers = 2;
let numberOfCards = 7;
numberOfPlayersEl.addEventListener("input", () => {
     numberOfPlayers = numberOfPlayersEl.value;
     numberOfPlayersOutput.textContent = numberOfPlayers;
});
numberOfCardsEl.addEventListener("input", () => {
     numberOfCards = numberOfCardsEl.value;
     numberOfCardsOutput.textContent = numberOfCards;
});

// all cards arr
let cards = [];

function startGame() {
     initializeGame();
     header.style.display = "none";
}

function initializeGame() {
     createCardsArray();
     renderCards(dealCards());
}
// initializeGame();
function createCardsArray() {
     let colors = ["red", "green", "blue", "yellow"];
     let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, "skip", "reverse", "draw2", "draw4", "wild"];
     for (let color of colors) {
          for (let value of values) {
               cards.push({ color, value });
          }
     }
     shuffleCards();
}
function shuffleCards() {
     for (let i = cards.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [cards[i], cards[j]] = [cards[j], cards[i]];
     }
     dealCards();
}

function dealCards() {
     let players = [];
     for (let i = 0; i < numberOfPlayers; i++) {
          players.push([]);
     }
     for (let i = 0; i < numberOfCards; i++) {
          for (let j = 0; j < numberOfPlayers; j++) {
               players[j].push(cards.pop());
          }
     }
     return players;
}
const cardFace = {
     1: "1",
     2: "2",
     3: "3",
     4: "4",
     5: "5",
     6: "6",
     7: "7",
     8: "8",
     9: "9",
     skip: "⊘",
     reverse: "⇄",
     draw2: "+2",
     draw4: "+4",
     wild: "✦"
}

function renderCards(players) {
     renderPlayers(players);
     renderDrawPile();
}

function renderPlayers(players) {
     let num = 1;
     players.forEach(player => {
          const playerDivEl = document.createElement("div");
          playerDivEl.classList.add("player");
          playerDivEl.id = `player-${num}`;
          playerDivEl.innerHTML = `<h1>Player ${num++}</h1>`;
          const cardsContainer = document.createElement("div");
          cardsContainer.classList.add("cards-container");
          playerDivEl.appendChild(cardsContainer);
          renderPlayerCards(player, cardsContainer);
          board.appendChild(playerDivEl);
     });
}

function renderPlayerCards(player, cardsContainer) {
     player.forEach(card => {
          const cardHolderEl = document.createElement("div");
          cardHolderEl.classList.add("card-holder");
          cardsContainer.appendChild(cardHolderEl);
          const cardEl = document.createElement("div");
          const type = Number(card.value) === NaN || card.value.length > 1 ? "action" : "number";
          cardEl.classList.add("card", card.color, card.value, type);
          if (card.value === "reverse" || card.value === "skip" || card.value === "wild") {
               const span = document.createElement("span");
               if (card.value === "reverse") span.classList.add("reverse");
               span.classList.add("card-span");
               span.innerHTML = cardFace[card.value];
               cardEl.appendChild(span);
          } else {
               cardEl.innerHTML = cardFace[card.value];
          }
          cardEl.draggable = true;
          makeDraggable(cardEl);
          cardHolderEl.appendChild(cardEl);
     });
}

function renderDrawPile() {
     const drawPileContainer = document.createElement("div");
     drawPileContainer.classList.add("draw-pile-container");
     playersEl.appendChild(drawPileContainer);
     const drawPile = document.createElement("div");
     drawPile.classList.add("draw-pile");
     const h1 = document.createElement("h1");
     h1.textContent = `Draw Pile:`;
     drawPileContainer.appendChild(h1);
     cards.forEach(card => {
          const cardEl = document.createElement("div");
          const type = Number(card.value) === NaN || card.value.length > 1 ? "action" : "number";
          cardEl.classList.add("card", card.color, card.value, type);
          if (card.value === "reverse" || card.value === "skip" || card.value === "wild") {
               const span = document.createElement("span");
               span.innerHTML = cardFace[card.value];
               if (card.value === "reverse") span.classList.add("reverse");
               span.classList.add("card-span");
               cardEl.appendChild(span);
          } else {
               cardEl.innerHTML = cardFace[card.value];
          }
          cardEl.draggable = true;
          makeDraggable(cardEl);
          drawPile.appendChild(cardEl);
     });
     drawPileContainer.appendChild(drawPile);
}
function makeDraggable(el) {

     let offsetX = 0, offsetY = 0;

     el.addEventListener('touchstart', e => {
          const t = e.touches[0];
          offsetX = t.clientX - el.offsetLeft;
          offsetY = t.clientY - el.offsetTop;
     });

     el.addEventListener('touchmove', e => {
          const t = e.touches[0];
          el.style.left = (t.clientX - offsetX) + 'px';
          el.style.top = (t.clientY - offsetY) + 'px';

          // prevent page scroll
          e.preventDefault();
     });

     el.addEventListener('touchend', e => {
          const t = e.changedTouches[0];
          const elem = document.elementFromPoint(t.clientX, t.clientY);

          if (elem === arena) {
               house.style.borderColor = 'dodgerblue';
               house.appendChild(el);
               el.style.left = '0';
               el.style.top = '0';
               el.style.position = 'relative';
          }
     });
}
