import { h } from "preact";
import Seat, { SeatSize } from "./seat";

interface ITableProps {
  occupied: string[];

  canOverride: boolean;

  leftSeatId: string;
  rightSeatId: string;
  selectedId: string;
  onClick: (id: string) => void;
}
const Table = ({ occupied, leftSeatId, rightSeatId, selectedId, canOverride, onClick }: ITableProps) => {
  return (
    <g>
      <g transform={`translate(0,0)`}>
        <Seat
          occupied={occupied.indexOf(leftSeatId) >= 0}
          canOverride={canOverride}
          selected={leftSeatId === selectedId}
          id={leftSeatId}
          onClick={onClick}
        />
      </g>
      <g transform={`translate(${SeatSize},0)`}>
        <Seat
          occupied={occupied.indexOf(rightSeatId) >= 0}
          canOverride={canOverride}
          selected={rightSeatId === selectedId}
          id={rightSeatId}
          onClick={onClick}
        />
      </g>
    </g>
  );
};
export default Table;
