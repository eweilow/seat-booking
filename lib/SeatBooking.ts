import { render, h } from "preact";
import RootComponent from "./components/root";

type SeatBookingAttribute = "data-layout" | "data-occupied";

export default class SeatBooking extends HTMLElement {
  private shadow: Element | ShadowRoot;
  private renderedNode: Element;

  private layout: number[] = [];
  private occupied: string[] = [];
  private canRender: boolean = false;

  set layoutAttribute(value: string) {
    if(value == null || !/\d+(?:\,\d+)*/.test(value)) {
      throw new Error(`Expected value '${value}' to be valid (/\d+(?:\,\d+)*/)`);
    }
    this.layout = value.split(",").filter(el => el.length > 0).map(str => parseInt(str)).filter(el => !isNaN(el));
  }
  set occupiedAttribute(value: string) {
    if(value == null || !/\d+(?:\,\d+)*/.test(value)) {
      throw new Error(`Expected value '${value}' to be valid (/\d+(?:\,\d+)*/)`);
    }
    this.occupied = value.split(",").filter(el => el.length > 0).map(str => parseInt(str)).filter(el => !isNaN(el)).map(el => el.toString());
  }

  static get observedAttributes(): SeatBookingAttribute[] {
    return [
      "data-layout",
      "data-occupied"
    ];
  }
  
  constructor() {
    super();
    this.shadow = <Element | ShadowRoot>this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.layoutAttribute = this.getAttribute("data-layout");
    this.occupiedAttribute = this.getAttribute("data-occupied");
    this.renderedNode = this.renderChildren(this.renderedNode);
    this.canRender = true;
  }

  disconnectedCallback(): void {

  }

  private onSeatSelected = (seatId: string): void => {
    this.dispatchEvent(new CustomEvent("seat-selected", { detail: { seatId }}));
  };

  renderChildren(replaceNode?: Element): Element {
    return render(h(RootComponent, { layout: this.layout, occupied: this.occupied, onSeatSelected: this.onSeatSelected }), (<Element>this.shadow), this.renderedNode);
  }

  attributeChangedCallback(attribute: SeatBookingAttribute, oldValue: string, newValue: string) {
    if(attribute === "data-layout") {
      this.layoutAttribute = newValue;
    } else if(attribute === "data-occupied") {
      this.occupiedAttribute = newValue;
    }

    if(this.canRender) {
      this.renderedNode = this.renderChildren(this.renderedNode);
    }
  }
}