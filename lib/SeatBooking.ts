import { render, h } from "preact";
import RootComponent from "./components/root";

type SeatBookingAttribute = "data-layout";

export default class SeatBooking extends HTMLElement {
  private shadow: Element | ShadowRoot;
  private renderedNode: Element;

  private layout: object;

  set layoutAttribute(value) {
    if(value == null) {
      this.layout = {};
      return;
    }
    try {
      this.layout = JSON.parse(value);
      this.renderedNode = this.renderChildren(this.renderedNode);
    } catch(error) {
      console.log(`Expected value '${value}' to be valid JSON`);
    }
  }

  static get observedAttributes(): SeatBookingAttribute[] {
    return [
      "data-layout"
    ];
  }
  
  constructor() {
    super();
    this.layoutAttribute = this.getAttribute("data-layout");
    this.shadow = <Element | ShadowRoot>this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.renderedNode = this.renderChildren(this.renderedNode);
  }

  private onSeatSelected = (seatId: string): void => {
    this.dispatchEvent(new CustomEvent("seat-selected", { detail: { seatId }}));
  };

  renderChildren(replaceNode?: Element): Element {
    return render(h(RootComponent, { layout: this.layout, onSeatSelected: this.onSeatSelected }), (<Element>this.shadow), this.renderedNode);
  }

  attributeChangedCallback(attribute: SeatBookingAttribute, oldValue: string, newValue: string) {
    if(attribute === "data-layout") {
      this.layoutAttribute = newValue;
    }
  }
}