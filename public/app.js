console.log("working");

const trainerId = window.prompt("Enter your Trainer ID:");
console.log(`Trainer ID entered: ${trainerId}`);

let cards;
let displayedCards = 6; // Initial number of cards to display

let mySelectedCard = null;
let theirSelectedCard = null;
let areYouSure;
let button = "";
let proposalId = "";

if (!trainerId || isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
  alert(
    "Invalid Trainer ID. Please reload the page and enter a valid Trainer ID."
  );
} else {
  const myContainer = document.getElementById("myContainer");
  const allOthersContainer = document.getElementById("allOthersContainer");
  const seeMoreLink = document.getElementById("seeMoreLink");
  const seeLessLink = document.getElementById("seeLessLink");
  const tradeProposalsContainer = document.getElementById("proposalContainer");
  const tradeButton = document.getElementById("tradeButton");

  // Create card div. These are teh Pokemon cards in our banks!
  const createCardDiv = (card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerHTML = `<p>${card.year} ${card.name}: $${card.value} -- ${card.grade}</p>`;
    return cardDiv;
  };

  // Function to handle card selection
  const selectCard = (card, container) => {
    // Clear the previously selected card in the same container
    container.innerHTML = "";

    const selectedCardDiv = createCardDiv(card);
    container.appendChild(selectedCardDiv);

    // Set the selected card
    if (container === myTradeContainer) {
      mySelectedCard = card;
    } else if (container === theirTradeContainer) {
      theirSelectedCard = card;
    }

    // Return the selected card
    return card;
  };

  // Function to handle trade button click
  const handleTradeButtonClick = () => {
    if (mySelectedCard && theirSelectedCard) {
      // Display trade proposal
      const proposalContainer = document.createElement("div");
      proposalContainer.classList.add("proposal-container");
      proposalContainer.innerHTML = `
  <p>${mySelectedCard.year} ${mySelectedCard.name}: $${mySelectedCard.value} -- ${mySelectedCard.grade}</p>
  <p>Pokemon Trade?</p>
  <p>${theirSelectedCard.year} ${theirSelectedCard.name}: $${theirSelectedCard.value} -- ${theirSelectedCard.grade}</p>
`;

      document.body.appendChild(proposalContainer);

      // Prompt user for confirmation
      areYouSure = window.prompt(
        "Are you sure you want to trade for these Pokemon cards? Type 'Y' for Yes or 'N' for No"
      );

      // Check user's response
      if (
        areYouSure &&
        (areYouSure.toUpperCase() === "Y" || areYouSure.toUpperCase() === "N")
      ) {
        // Submit the trade to the proposal container

        // Reset selected cards and trade containers
        mySelectedCard = null;
        theirSelectedCard = null;
        myTradeContainer.innerHTML = "<h2>My card</h2>";
        theirTradeContainer.innerHTML = "<h2>Their card</h2>";

        // Assign proposalId
        proposalId = button.dataset.proposal_id;
        console.log(proposalId);

        //NOT SEEING A PROPOSAL ID, SO CODE ISN'T REACHING HERE!

        // Now, integrate the fetch request to send the response to the server
        fetchTradeResponse(proposalId, areYouSure);
      } else {
        // Clear the selected cards and trade containers
        mySelectedCard = null;
        theirSelectedCard = null;
        myTradeContainer.innerHTML = "<h2>My card</h2>";
        theirTradeContainer.innerHTML = "<h2>Their card</h2>";

        // Optionally, you can inform the user that the trade was canceled
        alert("Trade canceled.");
      }
    } else {
      alert(
        "Please select a card from your bank and the card you want to trade for."
      );
    }
  };

  // Event listener for "Trade" button
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

  // Fetch and display trade proposals
  const fetchTradeProposals = async () => {
    try {
      const response = await fetch(`/trade/${trainerId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const tradeProposals = await response.json();

      // Display trade proposals
      const tradeProposalsContainer = document.getElementById(
        "tradeProposalsContainer"
      );

      if (tradeProposalsContainer) {
        tradeProposalsContainer.innerHTML = "";
        tradeProposals.forEach((proposal) => {
          const proposalDiv = document.createElement("div");
          proposalDiv.classList.add("trade-proposal");
          proposalDiv.innerHTML = `
            <p>Proposed by Trainer ID ${proposal.proposing_trainer_id}</p>
            <p>Status: ${proposal.status}</p>
            <button class="respond-button" data-proposal-id="${proposal.proposal_id}">Respond</button>
          `;
          tradeProposalsContainer.appendChild(proposalDiv);
        });
      }

      // Add event listener for respond buttons
      document.querySelectorAll(".respond-button").forEach((button) => {
        button.addEventListener("click", async () => {
          proposalId = button.dataset.proposal_id;
          console.log("Proposal ID:", proposalId);
          // Prompt the user for confirmation
          const userConfirmation = window.prompt(
            "Do you want to make this trade? 'Y' or 'N'"
          );

          if (
            userConfirmation &&
            (userConfirmation.toUpperCase() === "Y" ||
              userConfirmation.toUpperCase() === "N")
          ) {
            const response = await fetch(`/trade/respond/${proposalId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ response: userConfirmation }),
            });

            if (response.ok) {
              alert("Trade proposal responded!");
              // You may want to update the UI or reload trade proposals after a response
              fetchTradeProposals();
            } else {
              alert("Failed to respond to trade proposal. Please try again.");
            }
          } else {
            alert("Invalid response. Please type 'Y' for Yes or 'N' for No.");
          }
        });
      });
    } catch (error) {
      console.error("Error fetching trade proposals:", error.message);
    }
  };

  // Fetch and display trainer cards
  const showMyCards = () => {
    myContainer.innerHTML = "";
    fetch(`/cards/${trainerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((fetchedCards) => {
        console.log("Fetched My Cards:", fetchedCards);
        cards = fetchedCards;
        cards.forEach((card, index) => {
          const cardDiv = createCardDiv(card);
          if (card.trainer_id == trainerId) {
            myContainer.appendChild(cardDiv);
            cardDiv.addEventListener("click", () =>
              selectCard(card, myTradeContainer)
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching my cards:", error.message);
      });
  };

  // Fetch and display other trainers' cards
  const showTheirCards = () => {
    allOthersContainer.innerHTML = "";
    fetch("/cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((allCards) => {
        const theirCards = allCards.filter(
          (card) => card.trainer_id !== trainerId
        );
        console.log("Their Cards:", theirCards);
        cards = theirCards;
        theirCards.slice(0, displayedCards).forEach((card, index) => {
          const cardDiv = createCardDiv(card);
          allOthersContainer.appendChild(cardDiv);
          cardDiv.addEventListener("click", () =>
            selectCard(card, theirTradeContainer)
          );
        });
        if (theirCards.length > displayedCards) {
          seeMoreLink.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error fetching other trainer cards:", error.message);
      });
  };

  // Event listener for "See More" link
  seeMoreLink.addEventListener("click", function () {
    seeMoreLink.style.display = "none";
    cards.slice(displayedCards).forEach((card, index) => {
      const cardDiv = createCardDiv(card);
      allOthersContainer.appendChild(cardDiv);
      cardDiv.addEventListener("click", () =>
        selectCard(card, theirTradeContainer)
      );
    });
    seeLessLink.style.display = "block";
  });

  // Event listener for "See Less" link
  seeLessLink.addEventListener("click", function () {
    seeLessLink.style.display = "none";
    allOthersContainer.innerHTML = "";
    cards.slice(0, displayedCards).forEach((card, index) => {
      const cardDiv = createCardDiv(card);
      allOthersContainer.appendChild(cardDiv);
      cardDiv.addEventListener("click", () =>
        selectCard(card, theirTradeContainer)
      );
    });
    if (cards.length > displayedCards) {
      seeMoreLink.style.display = "block";
    }
  });

  // CODE FOR TRADING POKEMON CARDS

  const myTradeContainer = document.getElementById("myTradeContainer");
  const theirTradeContainer = document.getElementById("theirTradeContainer");

  // Function to handle trade response
  const fetchTradeResponse = async (proposalId, response) => {
    try {
      const fetchResponse = await fetch(`/trade/respond/${proposalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      });

      if (fetchResponse.ok) {
        alert("Trade proposal responded!");
        // Update UI or reload trade proposals after a response
        fetchTradeProposals();
      } else {
        alert("Failed to respond to trade proposal. Please try again.");
      }
    } catch (error) {
      console.error("Error responding to trade proposal:", error.message);
    }
  };

  // Fetch and display trade proposals on page load
  fetchTradeProposals();

  // Fetch and display trainer cards on page load
  showMyCards();

  // Fetch and display other trainers' cards on page load
  showTheirCards();
}
