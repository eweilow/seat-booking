import SeatBooking from "./SeatBooking";

function init() {
  customElements.define("seat-booking", SeatBooking);
}
if (!("customElements" in window && "define" in customElements)
) {
  console.info("[seat-booking] fetching custom-elements polyfill");
  const script = document.createElement("script");
  script.src = "custom-elements.min.js";
  script.onload = init;
  document.body.appendChild(script);
} else {
  console.info("[seat-booking] running native custom-elements");
  init();
}
