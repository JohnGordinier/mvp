console.log("working");

// // Prompt for Trainer ID
// const trainerId = prompt("Enter your Trainer ID");

// // Check if trainerId is valid (you may want to add more validation)
// if (!trainerId || isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
//   alert(
//     "Invalid Trainer ID. Please reload the page and enter a valid Trainer ID."
//   );
// } else {
//   const container = document.getElementById("dataContainer");

//   // Function to fetch and display cards for a specific trainer
//   const showMyCards = () => {
//     // Clear existing content in the container
//     container.innerHTML = "";

//     // Fetch cards for the specified trainer
//     fetch(`/cards?trainer_id=${trainerId}`)
//       .then((response) => response.json())
//       .then((cards) => {
//         // Loop through cards and add them to the container
//         cards.forEach((card) => {
//           const cardDiv = document.createElement("div");
//           cardDiv.classList.add("card");
//           cardDiv.innerHTML = `<p>${card.name}</p>`;
//           container.appendChild(cardDiv);
//         });
//       });
//   };

//   // Create a button to show the cards
//   const showCardsButton = document.createElement("button");
//   showCardsButton.textContent = "My Cards";
//   showCardsButton.addEventListener("click", showMyCards);

//   // Add the button to the body
//   document.body.appendChild(showCardsButton);
// }

// Prompt for Trainer ID
const trainerId = prompt("Enter your Trainer ID");

if (!trainerId || isNaN(trainerId) || trainerId < 1 || trainerId > 9) {
  alert(
    "Invalid Trainer ID. Please reload the page and enter a valid Trainer ID."
  );
} else {
  const myContainer = document.getElementById("myContainer");
  const allOthersContainer = document.getElementById("allOthersContainer");

  // Function to fetch and display cards for the specified trainer
  const showMyCards = () => {
    // Clear existing content in the containers
    myContainer.innerHTML = "";
    allOthersContainer.innerHTML = "";

    // Fetch cards for the specified trainer
    fetch(`/cards/${trainerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((cards) => {
        // Display cards
        cards.forEach((card) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
          // Append to myContainer if trainer_id matches trainerId
          if (card.trainer_id == trainerId) {
            myContainer.appendChild(cardDiv);
          } else {
            allOthersContainer.appendChild(cardDiv);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching cards:", error.message);
      });
  };

  // Call the showMyCards function to automatically display cards for the specified trainer
  showMyCards();

  // Function to fetch and display cards for all other trainers
  const showAllOtherCards = () => {
    // Clear existing content in the containers
    myContainer.innerHTML = "";
    allOthersContainer.innerHTML = "";

    // Fetch all cards
    fetch("/cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((cards) => {
        // Filter out cards of the specified trainer
        const otherTrainersCards = cards.filter(
          (card) => card.trainer_id !== trainerId
        );

        // Display cards in the allOthersContainer
        otherTrainersCards.forEach((card) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerHTML = `<p>${card.year} ${card.name} ${card.value} ${card.grade}</p>`;
          allOthersContainer.appendChild(cardDiv);
        });
      })
      .catch((error) => {
        console.error("Error fetching cards:", error.message);
      });
  };

  // Call the showAllOtherCards function to automatically display cards for all other trainers
  showAllOtherCards();
}
