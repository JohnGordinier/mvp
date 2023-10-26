const trainerId = window.prompt("Enter your Trainer ID:");
console.log(`Trainer ID entered: ${trainerId}`);

let cards;
// Initial number of cards to display without expanding
let displayedCards = 6;

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

  // Create card div. These are the Pokemon cards in our banks!
  const createCardDiv = (card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerHTML = `<p>${card.year} ${card.name}: $${card.value} -- ${card.grade}</p>`;
    return cardDiv;
  };

  // FUNCTION TO HANDLE CARD SELECTION
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

  // FUNCTION TO HANDLE TRADE BUTTON CLICK
  const handleTradeButtonClick = async () => {
    if (mySelectedCard && theirSelectedCard) {
      const proposalContainer = document.createElement("div");
      proposalContainer.classList.add("proposal-container");
      proposalContainer.innerHTML = `
        <p>${mySelectedCard.year} ${mySelectedCard.name}: $${mySelectedCard.value} -- ${mySelectedCard.grade}</p>
        <p>Pokemon Trade?</p>
        <p>${theirSelectedCard.year} ${theirSelectedCard.name}: $${theirSelectedCard.value} -- ${theirSelectedCard.grade}</p>
      `;

      document.body.appendChild(proposalContainer);

      areYouSure = window.prompt(
        "Are you sure you want to trade for these Pokemon cards? Type 'Y' for Yes or 'N' for No"
      );

      // CHECK USER'S RESPONSE
      if (
        areYouSure &&
        (areYouSure.toUpperCase() === "Y" || areYouSure.toUpperCase() === "N")
      ) {
        await postTradeProposal(
          mySelectedCard.trainer_id,
          theirSelectedCard.trainer_id,
          mySelectedCard.id,
          theirSelectedCard.id
        );

        // Submit the trade to the proposal container
        // Reset selected cards and trade containers
        mySelectedCard = null;
        theirSelectedCard = null;
        myTradeContainer.innerHTML = "<h2>My card</h2>";
        theirTradeContainer.innerHTML = "<h2>Their card</h2>";
      } else {
        // Clear the selected cards and trade containers
        mySelectedCard = null;
        theirSelectedCard = null;
        myTradeContainer.innerHTML = "<h2>My card</h2>";
        theirTradeContainer.innerHTML = "<h2>Their card</h2>";
        alert("Trade canceled.");
      }
    } else {
      alert(
        "Please select a card from your bank and the card you want to trade for."
      );
    }
  };
  // POST TRADE PROPOSAL SENDING THE PROPOSAL TO THE DATABASE FOR PROPOSAL ID
  const postTradeProposal = async (
    proposing_trainer_id,
    accepting_trainer_id,
    proposed_card_id,
    accepted_card_id
  ) => {
    try {
      const response = await fetch("/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposing_trainer_id,
          accepting_trainer_id,
          proposed_card_id,
          accepted_card_id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Trade proposal sent successfully:", result);
      } else {
        throw new Error("Failed to send trade proposal.");
      }
    } catch (error) {
      console.error("Error sending trade proposal:", error.message);
    }
  };

  // EVENT LISTENER FOR TRADE BUTTON
  tradeButton.addEventListener("click", handleTradeButtonClick);

  // EVENT LISTENER FOR ALLAOTHERSCONTAINER
  allOthersContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("card")) {
      theirSelectedCard = selectCard(
        cards[event.target.dataset.index],
        theirTradeContainer
      );
    }
  });

  // FETCH AND DISPLAY TRADE PROPOSALS
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

      // EVENT LISTENER FOR RESPOND BUTTONS
      document.querySelectorAll(".respond-button").forEach((button) => {
        button.addEventListener("click", async () => {
          console.log(button.dataset);
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

  // FETCH AND DISPLAY TRAINER CARDS
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

  // FETCH AND DISPLAY OTHER TRAINER'S CARDS
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

  // EVENT LISTENER FOR SEE MORE LINK
  //This will expand to the rest of the cards in the bank from other trainers
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

  // EVENT LISTENER FOR SEE LESS LINK
  //This unexpandes the list of other trainer's cards
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

  // FUNCTION TO HANDLE TRADE RESPONSE
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
        //Trade proposals will either delete the proposal or will swap the cards for new owners
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
