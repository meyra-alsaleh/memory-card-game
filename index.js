const gridContainer = document.querySelector(".grid-container");

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

//Default artist cards
const selectedArtist = document.querySelector("#artist");

// Update score
document.querySelector(".score").textContent = score;

/** 
 * Adding an event listener that fetches the data for the selected artist. 
 * The game is restarted if another artist is selected 
 */
selectedArtist.addEventListener("change", (event) => {
    artist = event.target.value;
    restart();
    fetchData(artist);
});

/**
 * Fetching the data for the selected artist.
 * @param artist 
 */
function fetchData(artist) {
    fetch(`./data/${artist}.json`)
        .then((res) => res.json())
        .then((data) => {
            cards = [...data, ...data]; // Duplicate the cards for matching pairs
            shuffleCards();
            generateCards();
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Cards shuffling functionality using Fisher–Yates shuffle algorithm
function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

// Generating cards by creating a div element for each card
function generateCards() {
    gridContainer.innerHTML = "";   // Clean board for each new game
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

// Flip cards and check for card matches
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

// Comparing first and second flipped cards
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}

// Trigger the change event to fetch the data for the default selected artist
window.addEventListener("load", () => {
    selectedArtist.dispatchEvent(new Event("change"));
});