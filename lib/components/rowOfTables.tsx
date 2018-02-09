import { h } from "preact";
import { SeatSize } from "./seat";
import Table from "./table";

interface IRowOfTablesProps {
  key: string;

  occupied: string[];

  name?: string;

  canOverride: boolean;

  indexOffset: number;
  tableCount: number;
  selectedId: string;
  onClick: (id) => void;

  originX: number;
  originY: number;
  angle: number;
}

function arrayOfLength(length: number) {
  const arr = new Array();
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
}
const RowOfTables = (props: IRowOfTablesProps) => {
  const { onClick, name, canOverride, occupied, tableCount, selectedId, originX, originY, angle, indexOffset } = props;
  return (
    <g className="SEATBOOKING-rowOfTables" transform={`rotate(${-angle}) translate(${originX}, ${originY})`}>
      { name && (
        <text
          text-anchor="middle"
          x={SeatSize}
          y={-SeatSize * 0.2}
          font-family="Righteous, sans-serif"
          font-size={SeatSize * 0.75}
        >
          {name}
        </text>
      ) }
      {
        arrayOfLength(tableCount).map((el, index) => (
          <g key={index.toString()} transform={`translate(0,${index * SeatSize})`}>
            <Table
              canOverride={canOverride}
              occupied={occupied}
              selectedId={selectedId}
              onClick={onClick}
              leftSeatId={(indexOffset + index).toString()}
              rightSeatId={(indexOffset + index + tableCount).toString()}
            />
          </g>
        ))
      }
    </g>
  );
};
export default RowOfTables;
