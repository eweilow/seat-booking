import SeatBooking from "./SeatBooking";

function init() {
  console.info("[seat-booking] initing");
  customElements.define("seat-booking", SeatBooking);
}
if (!("customElements" in window && "define" in customElements)
) {

  function l (src) { 
    return new Promise((resolve, reject) => {
      const _script = document.createElement("script");
      _script.src = src;
      _script.onload = () => resolve();
      _script.onerror = (err) => reject(err);
      document.body.appendChild(_script);
    });
  }
  console.info("[seat-booking] fetching custom-elements polyfill");

  Promise.all([
    l("custom-elements-es5-adapter.js"),
    l("custom-elements.min.js")
  ]).then(() => init())
    .catch(err => console.error(err));

} else {
  console.info("[seat-booking] running native custom-elements");
  init();
}
