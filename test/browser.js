const puppeteer = require("puppeteer");
const express = require("express");
const path = require("path");

const port = process.env.PORT || 8080;

async function startServer() {
  const app = express();
  app.use(express.static(path.join(__dirname, "../dist")));

  const server = app.listen(port);
  return new Promise((resolve, reject) => {
    server.once("listening", () => resolve(server));
    server.once("error", (err) => reject(err));
  });
  
}

const runSelectSeatTests = require("./selectSeats");
const runOccupiedSeatTests = require("./occupiedSeats");
const runOverrideOccupiedSeatTests = require("./overrideOccupiedSeats");
async function tests(page, browser) {
  const expectToBeOccupied = [
    2,
    4,
    8,
    11
  ];
  const rootHandle = await page.evaluateHandle((expectToBeOccupied) => {
    const el = document.querySelector("seat-booking");
    el.setAttribute("data-layout", "2,3,4,5");
    el.setAttribute("data-occupied", expectToBeOccupied);
    el.setAttribute("data-selected-seat", null);
    return el;
  }, expectToBeOccupied.map(el => el.toString()).join(","));

  await runSelectSeatTests(page, rootHandle);
  await runOccupiedSeatTests(page, rootHandle);
  await runOverrideOccupiedSeatTests(page, rootHandle);
}

let server;
(async function main(headless){
  let status = 0;

  server = await startServer();

  const browser = await puppeteer.launch({ 
    headless,
    slowMo: headless ? 0 : 250
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);

  console.log("Running tests");
  try {
    await tests(page, browser);
    console.log("Tests passed. Closing browser.");
  } catch(err) {
    console.error(err);
    status = 1;
    console.log("Tests failed. Closing browser.");
  }
  await browser.close();
  console.log("Browser closed.");
  server.close();

  process.exit(status);
})(true)
.catch((err) => {
  console.error(err);
  if(server.listening) server.close();
  
  process.exit(1);
});