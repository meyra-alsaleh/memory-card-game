const gridContainer = document.querySelector(".grid-container");

const selectedArtist = document.querySelector("#artist");

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;


// Update score
document.querySelector(".score").textContent = score;



selectedArtist.addEventListener("change", (event) => {
    artist = event.target.value;  // Get the selected value
    fetchData(artist);  // Fetch the data based on selected artist
});

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

function generateCards() {
    gridContainer.innerHTML = "";
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

window.addEventListener("load", () => {
    // Trigger the change event to fetch the data for the default selected artist
    selectedArtist.dispatchEvent(new Event("change"));
});