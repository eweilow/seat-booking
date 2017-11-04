import createSeatBookingClass from "./SeatBooking";
import "../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js";

function init() {
  console.info("[seat-booking] initing");
  customElements.define("seat-booking", createSeatBookingClass());
}

function loadScript (src) { 
  return new Promise((resolve, reject) => {
    const _script = document.createElement("script");
    _script.src = src;
    _script.onload = () => resolve();
    _script.onerror = (err) => reject(err);
    document.body.appendChild(_script);
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
