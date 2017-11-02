const booking = document.querySelector("seat-booking");
booking.addEventListener("seat-selected", function(e) {
  console.log("Selected seat: %s", e.detail.seatId);
});