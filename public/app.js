// console.log("working");

// // PROMPT FOR TRAINER ID
// const trainerId = prompt("Enter your Trainer ID");

// if (!trainerId || isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
//   alert(
//     "Invalid Trainer ID. Please reload the page and enter a valid Trainer ID."
//   );
// } else {
//   const myContainer = document.getElementById("myContainer");
//   const allOthersContainer = document.getElementById("allOthersContainer");

//   // FETCH TRAINER CARDS AND DISPLAY THEM
//   const showMyCards = () => {
//     // Clear existing content in the containers
//     myContainer.innerHTML = "";
//     allOthersContainer.innerHTML = "";
//     fetch(`/cards/${trainerId}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((cards) => {
//         // Display cards
//         cards.forEach((card) => {
//           const cardDiv = document.createElement("div");
//           cardDiv.classList.add("card");
//           cardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
//           // Append to myContainer if trainer_id matches trainerId
//           if (card.trainer_id == trainerId) {
//             myContainer.appendChild(cardDiv);
//           } else {
//             allOthersContainer.appendChild(cardDiv);
//           }
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching cards:", error.message);
//       });
//   };

//   // Call the showMyCards function to automatically display cards for the specified trainer
//   showMyCards();

//   // FUNCTION TO FETCH ALL OTHER CARDS IN THE DATABASE
//   const showAllOtherCards = () => {
//     // Clear existing content in the containers
//     myContainer.innerHTML = "";
//     allOthersContainer.innerHTML = "";
//     fetch("/cards")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((cards) => {
//         // Filter out cards of the specified trainer
//         const otherTrainersCards = cards.filter(
//           (card) => card.trainer_id !== trainerId
//         );

//         // Display cards in the allOthersContainer
//         otherTrainersCards.forEach((card) => {
//           const cardDiv = document.createElement("div");
//           cardDiv.classList.add("card");
//           cardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
//           allOthersContainer.appendChild(cardDiv);
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching cards:", error.message);
//       });
//   };

//   // Call the showAllOtherCards function to automatically display cards for all other trainers
//   showAllOtherCards();
// }

// // CODE FOR TRADING POKEMON CARDS

// const myTradeContainer = document.getElementById("myTradeContainer");
// const theirTradeContainer = document.getElementById("theirTradeContainer");
// const tradeButton = document.getElementById("tradeButton");

// let mySelectedCard = null;
// let theirSelectedCard = null;

// // Function to handle card selection
// const selectCard = (card, container) => {
//   // Clear the previously selected card in the same container
//   container.innerHTML = "";

//   const selectedCardDiv = document.createElement("div");
//   selectedCardDiv.classList.add("card");
//   selectedCardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
//   container.appendChild(selectedCardDiv);

//   return card;
// };

// // Function to handle trade button click
// const handleTradeButtonClick = () => {
//   if (mySelectedCard && theirSelectedCard) {
//     // Send trade proposal to the trainer_id of the card in theirTradeContainer
//     const theirTrainerId = theirSelectedCard.trainer_id;
//     alert(`Trade proposal sent to Trainer ${theirTrainerId}`);
//   } else {
//     alert("Please select a card from both containers before trading.");
//   }
// };

// // Event listeners
// tradeButton.addEventListener("click", handleTradeButtonClick);

// allOthersContainer.addEventListener("click", (event) => {
//   if (event.target.classList.contains("card")) {
//     theirSelectedCard = selectCard(
//       allOthersCards[event.target.dataset.index],
//       theirTradeContainer
//     );
//   }
// });

// myContainer.addEventListener("click", (event) => {
//   if (event.target.classList.contains("card")) {
//     mySelectedCard = selectCard(
//       myCards[event.target.dataset.index],
//       myTradeContainer
//     );
//   }
// });

console.log("working");

// PROMPT FOR TRAINER ID
const trainerId = prompt("Enter your Trainer ID");

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
      .then((cards) => {
        // Display cards
        cards.forEach((card, index) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;

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
      cards[event.target.dataset.index], // Assuming cards is the array of all cards
      theirTradeContainer
    );
  }
});
