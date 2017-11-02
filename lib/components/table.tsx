import { h } from "preact";

import Seat from "./seat";
import { SeatSize } from "./seat";

interface TableProps {
  occupied: string[]

  leftSeatId: string
  rightSeatId: string
  selectedId: string
  onClick: (id: string) => void
};
const Table = ({ occupied, leftSeatId, rightSeatId, selectedId, onClick }: TableProps) => {
  return (
    <g>
      <g transform={`translate(0,0)`}>
        <Seat occupied={occupied.indexOf(leftSeatId) >= 0} selected={leftSeatId === selectedId} id={leftSeatId} onClick={onClick}/>
      </g>
      <g transform={`translate(${SeatSize},0)`}>
        <Seat occupied={occupied.indexOf(rightSeatId) >= 0} selected={rightSeatId === selectedId} id={rightSeatId} onClick={onClick}/>
      </g>
    </g>
  );
}
export default Table;