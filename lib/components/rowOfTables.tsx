import { h } from "preact";
import { SeatSize } from "./seat";
import Table from "./table";

interface IRowOfTablesProps {
  key: string;
  
  occupied: string[];

  indexOffset: number;
  tableCount: number;
  selectedId: string;
  onClick: (id) => void;

  originX: number;
  originY: number;
  angle: number;
}

function arrayOfLength(length: number) {
  let arr = new Array();
  for(let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
}
const RowOfTables = (props: IRowOfTablesProps) => {
  const { onClick, occupied, tableCount, selectedId, originX, originY, angle, indexOffset } = props;
  return (
    <g className="SEATBOOKING-rowOfTables" transform={`rotate(${-angle}) translate(${originX}, ${originY})`}>
      {
        arrayOfLength(tableCount).map((el, index) => (
          <g key={index.toString()} transform={`translate(0,${index * SeatSize})`}>
            <Table
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
