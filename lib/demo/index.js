var selected = document.querySelector("#selected");
var booking = document.querySelector("seat-booking");

booking.addEventListener("seat-selected", function(e) {
  selected.innerText = `Selected seat: ${e.detail.seatId}`;
});