import { h } from "preact";
import { SeatSize } from "./seat";
import Table from "./table";

interface IRowOfTablesProps {
  occupied: string[];

  indexOffset: number;
  tableCount: number;
  selectedId: string;
  onClick: (id) => void;

  originX: number;
  originY: number;
  angle: number;
}

const RowOfTables = (props: IRowOfTablesProps) => {
  const { onClick, occupied, tableCount, selectedId, originX, originY, angle, indexOffset } = props;
  return (
    <g transform={` rotate(${-angle}) translate(${originX}, ${originY})`}>
      {
        [...new Array(tableCount)].map((el, index) => (
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
