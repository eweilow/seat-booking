import { h } from "preact";
import Seat, { SeatSize } from "./seat";

interface ITableProps {
  occupied: string[];

  seatnames?: string[];

  canOverride: boolean;

  leftSeatId: string;
  rightSeatId: string;
  selectedId: string;
  onClick: (id: string) => void;
}
const Table = ({ seatnames, occupied, leftSeatId, rightSeatId, selectedId, canOverride, onClick }: ITableProps) => {
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
        {
          seatnames && (
            <text
              text-anchor="end"
              alignment-baseline="central"
              x={-4}
              y={SeatSize/2}
              font-family="Righteous, sans-serif"
              font-size={SeatSize * 0.45}
            >
              {seatnames[leftSeatId]}
            </text>
          )
        }
      </g>
      <g transform={`translate(${SeatSize},0)`}>
        <Seat
          occupied={occupied.indexOf(rightSeatId) >= 0}
          canOverride={canOverride}
          selected={rightSeatId === selectedId}
          id={rightSeatId}
          onClick={onClick}
        />
        {
          seatnames && (
            <text
              text-anchor="start"
              alignment-baseline="central"
              x={4 + SeatSize}
              y={SeatSize/2}
              font-family="Righteous, sans-serif"
              font-size={SeatSize * 0.45}
            >
              {seatnames[rightSeatId]}
            </text>
          )
        }
      </g>
    </g>
  );
};
export default Table;
