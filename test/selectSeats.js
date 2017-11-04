module.exports = async function runSelectSeatTests(page, rootHandle) {
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