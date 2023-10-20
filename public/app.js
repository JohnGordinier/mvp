console.log("working");

// PROMPT FOR TRAINER ID
const trainerId = prompt("Enter your Trainer ID");

// Define cards globally
let cards;

if (!trainerId || isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
  alert(
    "Invalid Trainer ID. Please reload the page and enter a valid Trainer ID."
  );
} else {
  const myContainer = document.getElementById("myContainer");
  const allOthersContainer = document.getElementById("allOthersContainer");

  // FETCH TRAINER CARDS AND DISPLAY THEM
  const showMyCards = () => {
    // Clear existing content in the containers
    myContainer.innerHTML = "";
    allOthersContainer.innerHTML = "";

    fetch(`/cards/${trainerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((fetchedCards) => {
        // Log the fetched cards to the console
        console.log("Fetched Cards:", fetchedCards);

        // Assign fetched cards to the global variable
        cards = fetchedCards;

        // Display cards
        cards.forEach((card, index) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerHTML = `<p>${card.year} ${card.name} $${card.value} ${card.grade}</p>`;

          if (card.trainer_id == trainerId) {
            myContainer.appendChild(cardDiv);
            cardDiv.addEventListener("click", () =>
              selectCard(card, myTradeContainer)
            );
          } else {
            allOthersContainer.appendChild(cardDiv);
            cardDiv.addEventListener("click", () =>
              selectCard(card, theirTradeContainer)
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching cards:", error.message);
      });
  };

  // Call the showMyCards function to automatically display cards for the specified trainer
  showMyCards();
}

// CODE FOR TRADING POKEMON CARDS

const myTradeContainer = document.getElementById("myTradeContainer");
const theirTradeContainer = document.getElementById("theirTradeContainer");
const tradeButton = document.getElementById("tradeButton");

let mySelectedCard = null;
let theirSelectedCard = null;

// Function to handle card selection
const selectCard = (card, container) => {
  // Clear the previously selected card in the same container
  container.innerHTML = "";

  const selectedCardDiv = document.createElement("div");
  selectedCardDiv.classList.add("card");
  selectedCardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
  container.appendChild(selectedCardDiv);

  // Set the selected card
  if (container === myTradeContainer) {
    mySelectedCard = card;
  } else if (container === theirTradeContainer) {
    theirSelectedCard = card;
  }
};

// Function to handle trade button click
const handleTradeButtonClick = () => {
  if (mySelectedCard && theirSelectedCard) {
    // Display trade proposal
    const proposalContainer = document.createElement("div");
    proposalContainer.classList.add("proposal-container");
    proposalContainer.innerHTML = `
        <p>${mySelectedCard.year} ${mySelectedCard.name} ${mySelectedCard.value} ${mySelectedCard.grade}</p>
        <p>Pokemon Trade?</p>
        <p>${theirSelectedCard.year} ${theirSelectedCard.name} ${theirSelectedCard.value} ${theirSelectedCard.grade}</p>
    `;
    document.body.appendChild(proposalContainer);

    // Reset selected cards and trade containers
    mySelectedCard = null;
    theirSelectedCard = null;
    myTradeContainer.innerHTML = "<h2>My Trade Container</h2>";
    theirTradeContainer.innerHTML = "<h2>Their Trade Container</h2>";
  } else {
    alert("Please select a card from both containers before trading.");
  }
};

// Event listeners
tradeButton.addEventListener("click", handleTradeButtonClick);

// Event listener for allOthersContainer
allOthersContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("card")) {
    theirSelectedCard = selectCard(
      cards[event.target.dataset.index], // Now cards is globally accessible
      theirTradeContainer
    );
  }
});
