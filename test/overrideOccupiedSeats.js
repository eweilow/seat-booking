module.exports = async function runOccupiedSeatTests(page, rootHandle) {
  const shadowRootRectsHandle = await page.evaluateHandle((root) => {
    root.setAttribute("data-selected-seat", "1");
    root.setAttribute("data-can-override", "true");

    const shadowRoot = root.shadowRoot;
    return Array.from(shadowRoot.querySelectorAll("rect[data-occupied][data-id]"));
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
      root.setAttribute("data-selected-seat", "1");
      return new Promise((resolve, reject) => {
        try {
          rect.dispatchEvent(new Event("click"));
          setTimeout(() => {
            resolve(JSON.stringify({ match: root.getAttribute("data-selected-seat") === rect.getAttribute("data-id"), seatId: "1", attr: rect.getAttribute("data-id") }));
          });
        } catch(err) {
          reject(err);
        }
      })
    }, rootHandle, child));

    if(!evalResult.match) {
      throw new Error(`Expected event on seat-booking to be able to override-select occupied seat '${evalResult.attr}'`);
    }
  }
}