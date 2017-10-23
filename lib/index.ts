import SeatBooking from "./SeatBooking";
customElements.define("seat-booking", SeatBooking);


const layout = {
  test: Math.random()
};
document.querySelector("seat-booking").setAttribute("data-layout", JSON.stringify(layout));

document.querySelector("seat-booking").addEventListener("seat-selected", (e: CustomEvent) => {
  console.log("Selected seat: %s", e.detail.seatId);
});