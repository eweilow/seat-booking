import "../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js";
import createSeatBookingClass from "./SeatBooking";

function init() {
  console.info("[seat-booking] initing");
  customElements.define("seat-booking", createSeatBookingClass());
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = err => reject(err);
    document.body.appendChild(script);
  });
}
if (!("customElements" in window && "define" in customElements)
) {

  console.info("[seat-booking] fetching custom-elements polyfill");

  Promise.all([
    loadScript("custom-elements.min.js")
  ]).then(() => init())
    .catch(err => console.error(err));

} else {
  Promise.all([
    loadScript("custom-elements.min.js")
  ]).then(() => init())
    .catch(err => console.error(err));
  console.info("[seat-booking] running native custom-elements");
}
