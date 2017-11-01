import { h, Component } from "preact";

const SIZE = 32;

interface SeatProps {
  occupied: boolean
  id: string
  selected: boolean
  onClick: (id: string) => void
};

interface SeatState {
  hovering: boolean
}

class Seat extends Component<SeatProps, SeatState> {
  render({ id, onClick, occupied, selected }: SeatProps) {
    return (
      <rect 
        className={["seat", occupied && "occupied", selected && "selected"].filter(el => typeof el === "string").join(" ")} 
        width={SIZE} 
        height={SIZE} 
        onClick={() => !occupied && onClick(id)}
      />
    );
  }
}

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
      <g transform={`translate(${SIZE},0)`}>
        <Seat occupied={occupied.indexOf(rightSeatId) >= 0} selected={rightSeatId === selectedId} id={rightSeatId} onClick={onClick}/>
      </g>
    </g>
  );
}

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
            <g transform={`translate(0,${index * SIZE})`}>
              <Table occupied={occupied} selectedId={selectedId} onClick={onClick} leftSeatId={(indexOffset + index).toString()} rightSeatId={(indexOffset + index + tableCount).toString()}/>
            </g>
          );
        })
      }
    </g>
  );
};

export interface RootComponentProps {
  layout: number[]
  occupied: string[]
  selectedId: string
  onSeatSelected: (id: string) => void
}

interface RootComponentState {
  selectedId: string
  rows: Row[]

  maxWidth: number
  maxHeight: number
};

interface Row {
  indexOffset: number
  x: number
  y: number
  seatGroups: number
  angle: number
}

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

const styles = require("./root.css");
const seatStyles = require("./seatStyles.css");

export default class RootComponent extends Component<RootComponentProps,RootComponentState> {
  state = {
    selectedId: null,
    rows: [],

    maxWidth: 0,
    maxHeight: 0
  };

  componentWillMount() {
    this.updateRows(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateRows(newProps);
  }

  updateRows(props) {
    let rows: Row[] = [];
    
    const deltaAngle = 90 / (props.layout.length - 1);

    let maxHeight = 0;
    let maxWidth = 0;

    let indexOffset = 0;
    for(let i = 0; i < props.layout.length; i++) {
      const radAngle = (Math.PI / 180) * deltaAngle * i;

      maxWidth = Math.max(maxWidth, SIZE + Math.sin(radAngle) * (170 + SIZE * props.layout[i]) + Math.cos(radAngle) * SIZE);
      maxHeight = Math.max(maxHeight, SIZE + Math.cos(radAngle) * (170 + SIZE * props.layout[i]) - Math.sin(radAngle) * SIZE);

      maxWidth = Math.max(maxWidth, SIZE + Math.sin(radAngle) * (170 + SIZE * props.layout[i]) - Math.cos(radAngle) * SIZE);
      maxHeight = Math.max(maxHeight, SIZE + Math.cos(radAngle) * (170 + SIZE * props.layout[i]) + Math.sin(radAngle) * SIZE);

      rows.push({
        indexOffset,
        x: -SIZE,
        y: 170,
        seatGroups: props.layout[i],
        angle: deltaAngle * i
      });
      indexOffset += props.layout[i] * 2;
    }
    this.setState({
      rows,
      selectedId: props.selectedId,
      maxWidth,
      maxHeight
    });
  }
  
  onSeatClicked = (id: string): void  => {
    this.setState({
      selectedId: id
    });
    this.props.onSeatSelected(id);
  };

  render({layout, occupied}: RootComponentProps) {
    return (
      <div className="root" style={`min-width: ${this.state.maxWidth}px; min-height: ${this.state.maxHeight}px`}>
        <style>{styles.toString()}</style>
        <svg width={this.state.maxWidth} height={this.state.maxHeight}>
          <defs>
            <pattern id="occupied" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)" width="10" height="10">
              <rect fill="#ffccd5" x="0" y="0" width="10" height="10"/>
              <line x1="5" y="0" x2="5" y2="10" stroke="#ed0a47" stroke-width="5" />
            </pattern>
          </defs>

          <g transform={`translate(${SIZE}, ${SIZE})`}>
            {
              this.state.rows.map(el => (
                <RowOfTables occupied={occupied} indexOffset={el.indexOffset} originX={el.x} originY={el.y} angle={el.angle} selectedId={this.state.selectedId} onClick={this.onSeatClicked} tableCount={el.seatGroups}/>
              ))
            }
          </g>
          <style>{seatStyles.toString()}</style>
        </svg>
      </div>
    );
  }
}