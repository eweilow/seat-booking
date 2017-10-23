import { h, Component } from "preact";

const SIZE = 32;

interface Layout {
  test: number;
}

interface SeatProps {
  id: string
  selected: boolean
  onClick: (id: string) => void
};
const Seat = ({ id, onClick, selected }: SeatProps) => {
  return (
    <rect width={SIZE} height={SIZE} fill={selected ? "blue" : "red"} stroke="black" onClick={() => onClick(id)}/>
  );
};

interface TableProps {
  leftSeatId: string
  rightSeatId: string
  selectedId: string
  onClick: (id: string) => void
};
const Table = ({ leftSeatId, rightSeatId, selectedId, onClick }: TableProps) => {
  return (
    <g>
      <g transform={`translate(0,0)`}>
        <Seat selected={leftSeatId === selectedId} id={leftSeatId} onClick={onClick}/>
      </g>
      <g transform={`translate(${SIZE},0)`}>
        <Seat selected={rightSeatId === selectedId} id={rightSeatId} onClick={onClick}/>
      </g>
    </g>
  );
}

interface RowOfTablesProps {
  indexOffset: number
  tableCount: number
  selectedId: string
  onClick: (id) => void

  originX: number
  originY: number
  angle: number
}

const RowOfTables = ({ onClick, tableCount, selectedId, originX, originY, angle, indexOffset }: RowOfTablesProps) => {
  return (
    <g transform={` rotate(${-angle}) translate(${originX}, ${originY})`}>
      {
        [...new Array(tableCount)].map((el, index) => {
          return (
            <g transform={`translate(0,${index * SIZE})`}>
              <Table selectedId={selectedId} onClick={onClick} leftSeatId={(indexOffset + index).toString()} rightSeatId={(indexOffset + index + tableCount).toString()}/>
            </g>
          );
        })
      }
    </g>
  );
};

interface RootComponentProps {
  layout: Layout
  onSeatSelected: (id: string) => void
}

interface RootComponentState {
  selectedId: string
  rows: Row[]
};

interface Row {
  indexOffset: number
  x: number
  y: number
  seatGroups: number
  angle: number
}

export default class RootComponent extends Component<RootComponentProps,RootComponentState> {
  state = {
    selectedId: null,
    rows: []
  };

  constructor() {
    super();

    let rows: Row[] = [];

    const tables = 4;
    let indexOffset = 0;
    for(let angle = 0; angle <= Math.PI / 2; angle += (Math.PI / 2 / (tables-1))) {
      let seatGroups = Math.round((1 + Math.cos(Date.now() / 100 + angle)) * 5) + 3;
      rows.push({
        indexOffset,
        x: -SIZE,
        y: 170,
        seatGroups,
        angle: angle * (180 / Math.PI)
      });
      indexOffset += seatGroups * 2;
    }

    this.setState({
      rows
    });
  }
  
  onSeatClicked = (id: string): void  => {
    this.setState({
      selectedId: id
    });
    this.props.onSeatSelected(id);
  };

  render({layout}: RootComponentProps) {
    return (
      <div>
        <p>Hello: {layout.test}</p>
        <p>selected seat: {this.state.selectedId}</p>
        <svg width={1000} height={1000}>
          <g transform={`translate(${SIZE}, ${SIZE})`}>
            {
              this.state.rows.map(el => (
                <RowOfTables indexOffset={el.indexOffset} originX={el.x} originY={el.y} angle={el.angle} selectedId={this.state.selectedId} onClick={this.onSeatClicked} tableCount={el.seatGroups}/>
              ))
            }
          </g>
          <style>{`
            rect:hover {
              fill: green;
              cursor: pointer;
            }
          `}</style>
        </svg>
      </div>
    );
  }
}