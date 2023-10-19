console.log("working");
fetch("/cards")
  .then((response) => {
    return response.json();
  })
  .then((cards) => {
    for (let card of cards) {
      document.body.append(card.name);
    }
  });

//missed a bunch of steps in here
