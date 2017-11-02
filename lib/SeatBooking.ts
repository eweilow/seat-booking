import { h, render } from "preact";
import RootComponent, { RootComponentProps } from "./components/root";

type SeatBookingAttribute = "data-layout" | "data-occupied" | "data-selected-seat";

export default class SeatBooking extends HTMLElement {
  private shadow: Element | ShadowRoot;
  private renderedNode: Element;

  private layout: number[] = [];
  private occupied: string[] = [];
  private canRender: boolean = false;
  private selectedSeat: string = null;

  set layoutAttribute(value: string) {
    if (value == null || !/^\d+(?:\,\d+)*$/.test(value)) {
      throw new Error(`Expected attribute data-layout with value '${value}' to be valid (regexp: /^\d+(?:\,\d+)*$/)`);
    }
    this.layout = value.split(",").filter(el => el.length > 0).map(str => parseInt(str)).filter(el => !isNaN(el));
  }
  set occupiedAttribute(value: string) {
    if (value == null || !/^\d+(?:\,\d+)*$/.test(value)) {
      throw new Error(`Expected attribute data-occupied with value '${value}' to be valid (regexp: /^\d+(?:\,\d+)*$/)`);
    }
    this.occupied = value.split(",").filter(el => el.length > 0).map(str => parseInt(str)).filter(el => !isNaN(el)).map(el => el.toString());
  }
  set selectedSeatAttribute(value: string) {
    if (!/^\d+$/.test(value)) {
      throw new Error(`Expected attribute data-selected-seat with value '${value}' to be valid (regexp: /^\d+$/)`);
    }
    this.selectedSeat = value;
  }

  static get observedAttributes(): SeatBookingAttribute[] {
    return [
      "data-layout",
      "data-occupied",
      "data-selected-seat"
    ];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" }) as Element | ShadowRoot;
  }

  public connectedCallback(): void {
    this.renderedNode = this.renderChildren(this.renderedNode);
    this.canRender = true; //prevent rendering multiple times before node connects
  }

  private onSeatSelected = (seatId: string): void => {
    this.selectedSeat = seatId;
    this.setAttribute("data-selected-seat", seatId);

    this.dispatchEvent(new CustomEvent("seat-selected", { detail: { seatId }}));
  }

  public renderChildren(replaceNode?: Element): Element {
    const props: RootComponentProps = {
      selectedId: this.selectedSeat,
      layout: this.layout,
      occupied: this.occupied,
      onSeatSelected: this.onSeatSelected
    };
    return render(h(RootComponent, props), (this.shadow as Element), this.renderedNode);
  }

  public attributeChangedCallback(attribute: SeatBookingAttribute, oldValue: string, newValue: string) {
    if (attribute === "data-layout") {
      this.layoutAttribute = newValue;
    } else if (attribute === "data-occupied") {
      this.occupiedAttribute = newValue;
    } else if (attribute === "data-selected-seat") {
      this.selectedSeatAttribute = newValue;
    }

    if (this.canRender) {
      this.renderedNode = this.renderChildren(this.renderedNode);
    }
  }
}
