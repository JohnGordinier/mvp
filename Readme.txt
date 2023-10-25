Welcome to the Pokemon Bank and Trading Service!
Website Function:
This app was designed with Pokemon card collectors in mind. Once a "Trainer" is signed in, they will be able to see their card database. They can udpate their information with a request patch,
add new cards into their collection with post requests, and delete cards they may have sold elsewhere with delete requests. This portion is refered to the Pokemon bank side of the app, the
other side is a trading service where a trainer can see cards from other trainers and propose a trade. Once a trade is proposed and sent, the initiator of the trade is fully committed to the
possible trade. The next time the trainer who is receiving the proposal logs in, they will see the proposals they've received in the proposalContainer. They then click the "Respond" button
of the proposal and decide whether or not they agree to the trade. If the trade is approved by the receiver, the card swap will occur placing their new card in their bank. If the proposal is
denied by the receiving trainer, the proposal is killed and the initiator and reciever will not see the proposal in their proposal container anymore.

Website Design:
Using the colors from the Pokemon logo to ensure the site follows the 

Database:
Three tables are used inside the database, which are named: "trainer", "card", and "trade_proposals"
The primary key comes from the trainer.id. This number aligns the trainers information, as well as his Pokemon card bank. The trade proposals are built from the trainer's id and card id.
As an example, if the receiving trainer approves a card swap, the card id of each will flip and appear in the other person's bank.
The database information is annotated in the migration.sql file.

App JavaScript:
