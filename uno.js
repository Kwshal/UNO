let board = document.getElementById("board");
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

// all cards arr
let cards = [];

function startGame() {
     initializeGame();
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
     dealCards(2, 7);
}

function dealCards(numberOfPlayers = 2, numberOfCards = 7) {
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

     players.forEach(player => {
          const playerEl = document.createElement("div");
          playerEl.classList.add("player");
          player.forEach(card => {
               const cardEl = document.createElement("div");
               const type = Number(card.value) === NaN || card.value.length > 1 ? "action" : "number";
               cardEl.classList.add("card", card.color, card.value, type);
               if (card.value === "reverse") {
                    cardEl.innerHTML = `<span class=\"reverse-span\">${cardFace[card.value]}</span>`;
               } else {
                    cardEl.innerHTML = cardFace[card.value];
               }
               cardEl.draggable = true;
               makeDraggable(cardEl);
               playerEl.appendChild(cardEl);
          });
          board.appendChild(playerEl);
          board.appendChild(document.createElement("hr"));
     });
     const drawPile = document.createElement("div");
     drawPile.classList.add("draw-pile");
     const h1 = document.createElement("h1");
     h1.textContent = `Draw Pile:`;
     board.appendChild(h1);

     cards.forEach(card => {
          const cardEl = document.createElement("div");
          const type = Number(card.value) === NaN || card.value.length > 1 ? "action" : "number";
          cardEl.classList.add("card", card.color, card.value, type);
          if (card.value === "reverse") {
               cardEl.innerHTML = `<span class=\"reverse-span\">${cardFace[card.value]}</span>`;
          } else {
               cardEl.innerHTML = cardFace[card.value];
          }
          cardEl.draggable = true;
          makeDraggable(cardEl);
          drawPile.appendChild(cardEl);
     });
     board.appendChild(drawPile);
}
function switchPlayer() {

}
function makeDraggable(el) {
     let offsetX = 0, offsetY = 0, dragging = false;

     function start(e) {
          dragging = true;
          const point = e.touches ? e.touches[0] : e;
          offsetX = point.clientX - el.offsetLeft;
          offsetY = point.clientY - el.offsetTop;
          el.style.cursor = 'grabbing';
     }

     function move(e) {
          if (!dragging) return;
          const point = e.touches ? e.touches[0] : e;
          el.style.left = point.clientX - offsetX + 'px';
          el.style.top = point.clientY - offsetY + 'px';
     }

     function stop() {
          dragging = false;
          el.style.cursor = 'grab';
     }

     // Mouse events
     el.addEventListener('mousedown', start);
     document.addEventListener('mousemove', move);
     document.addEventListener('mouseup', stop);

     // Touch events
     el.addEventListener('touchstart', start);
     document.addEventListener('touchmove', move);
     document.addEventListener('touchend', stop);
}