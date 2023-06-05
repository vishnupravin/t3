// Define the constants for the offer
const qty = 6;
const BUY_QTY = 3;
const GET_QTY = 2;
const MAX_FREE_QTY = 5;

// Calculate the total price based on the quantity and offer
let qualifyingQty = Math.floor(qty / BUY_QTY);
let freeQty = Math.min(qualifyingQty * GET_QTY, MAX_FREE_QTY);


// Display the total price
