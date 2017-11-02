import { h } from "preact";

import Table from "./table";
import { SeatSize } from "./seat";

interface RowOfTablesProps {
  occupied: string[]
  
  indexOffset: number
  tableCount: number
  selectedId: string
  onClick: (id) => void

  originX: number
  originY: number
  angle: number
}

const RowOfTables = ({ onClick, occupied, tableCount, selectedId, originX, originY, angle, indexOffset }: RowOfTablesProps) => {
  return (
    <g transform={` rotate(${-angle}) translate(${originX}, ${originY})`}>
      {
        [...new Array(tableCount)].map((el, index) => {
          return (
            <g transform={`translate(0,${index * SeatSize})`}>
              <Table occupied={occupied} selectedId={selectedId} onClick={onClick} leftSeatId={(indexOffset + index).toString()} rightSeatId={(indexOffset + index + tableCount).toString()}/>
            </g>
          );
        })
      }
    </g>
  );
};
export default RowOfTables;