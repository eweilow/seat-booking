import { Component, h } from "preact";

export const SeatSize = 32;

interface SeatProps {
  occupied: boolean;
  id: string;
  selected: boolean;
  onClick: (id: string) => void;
}

interface SeatState {
  hovering: boolean;
}

export default class Seat extends Component<SeatProps, SeatState> {
  public render({ id, onClick, occupied, selected }: SeatProps) {
    return (
      <rect
        className={["seat", occupied && "occupied", selected && "selected"].filter(el => typeof el === "string").join(" ")}
        width={SeatSize}
        height={SeatSize}
        onClick={() => !occupied && onClick(id)}
      />
    );
  }
}
