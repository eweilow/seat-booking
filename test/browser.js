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
    el.setAttribute("data-selected", null);
    return el;
  }, expectToBeOccupied.map(el => el.toString()).join(","));

  const shadowRootRectsHandle = await page.evaluateHandle((root) => {
    const shadowRoot = root.shadowRoot;
    return Array.from(shadowRoot.querySelectorAll("rect:not([data-occupied])[data-id]"));
  }, rootHandle);

  const properties = await shadowRootRectsHandle.getProperties();
  const children = [];
  for (const property of properties.values()) {
    const element = property.asElement();
    if (element) {
      children.push(element);
    }
  }
  
  for(let child of children) {
    const evalResult = JSON.parse(await page.evaluate(async (root, rect) => {
      return new Promise((resolve, reject) => {
        try {
          const listener = (e) => {
            root.removeEventListener("seat-selected", listener);
            resolve(JSON.stringify({ match: e.detail.seatId === rect.getAttribute("data-id"), seatId: e.detail.seatId, attr: rect.getAttribute("data-id") }));
          };
          root.addEventListener("seat-selected", listener);
          rect.dispatchEvent(new Event("click"));
        } catch(err) {
          reject(err);
        }
      })
    }, rootHandle, child));

    if(!evalResult.match) {
      throw new Error(`Expected event on seat-booking to return '${evalResult.attr}' but got '${evalResult.seatId}'`);
    }
  }
}

let server;
(async function main(headless){
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
    process.statusCode = 1;
    console.log("Tests failed. Closing browser.");
  }
  await browser.close();
  console.log("Browser closed.");
  server.close();
})(true)
.then(() => console.log("Done."))
.catch((err) => {
  console.error(err);
  if(server.listening) server.close();
});