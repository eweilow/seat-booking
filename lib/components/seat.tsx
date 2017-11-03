import { Component, h } from "preact";

export const SeatSize = 32;

interface ISeatProps {
  occupied: boolean;
  id: string;
  selected: boolean;
  onClick: (id: string) => void;
}

interface ISeatState {
  hovering: boolean;
}

export default class Seat extends Component<ISeatProps, ISeatState> {
  public onClicked = (): void => {
    if (!this.props.occupied) {
      this.props.onClick(this.props.id);
    }
  }

  public render({ id, onClick, occupied, selected }: ISeatProps) {
    return (
      <rect
        data-id={id}
        data-occupied={occupied}
        data-selected={selected}
        className={
          [
            "SEATBOOKING-seat",
            occupied && "SEATBOOKING-occupied",
            selected && "SEATBOOKING-selected"
          ]
          .filter(el => typeof el === "string")
          .join(" ")
        }
        width={SeatSize}
        height={SeatSize}
        onClick={this.onClicked}
      />
    );
  }
}
