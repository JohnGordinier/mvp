console.log("working");
fetch("/cards").then(response =>{
        return response.json();
}).then({data} => {
    for (let card of cards) {
        document.body.append(cards.num);
    }
});