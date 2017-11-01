const booking = document.querySelector("seat-booking");
booking.addEventListener("seat-selected", function(e) {
  console.log("Selected seat: %s", e.detail.seatId);
});


setInterval(function(){
  let vals = [];

  for(let i = 0; i < 5; i++) {
    let rnd;
    while(vals.indexOf(rnd = Math.floor(53 * Math.random())) >= 0) { }
    vals.push(rnd);
  }

  booking.setAttribute("data-occupied", vals.join(","));
}, 500);