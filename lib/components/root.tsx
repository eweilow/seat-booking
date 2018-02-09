import { Component, h } from "preact";

/*
 * Needed to be able to use Webpack's imports for loading styles
 */
declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

import OccupiedSeatPattern from "./occupiedSeatPattern";
import RowOfTables from "./rowOfTables";
import { SeatSize } from "./seat";

export interface IRootComponentProps {
  canOverride: boolean;
  layout: number[];
  offsets?: number[];
  occupied: string[];
  selectedId: string;
  onSeatSelected: (id: string) => void;
}

interface IRootComponentState {
  selectedId: string;
  rows: IRow[];

  maxWidth: number;
  maxHeight: number;
}

interface IRow {
  indexOffset: number;
  x: number;
  y: number;
  seatGroups: number;
  angle: number;
}

const styles = require("./root.css");
const seatStyles = require("./seatStyles.css");

export default class RootComponent extends Component<IRootComponentProps, IRootComponentState> {
  public state = {
    maxWidth: 0,
    maxHeight: 0,
    rows: [],
    selectedId: null
  };

  public componentWillMount() {
    this.updateRows(this.props);
  }

  public componentWillReceiveProps(newProps) {
    this.updateRows(newProps);
  }

  public updateRows(props) {
    const rows: IRow[] = [];

    const deltaAngle = 90 / (props.layout.length - 1);

    let maxHeight = 0;
    let maxWidth = 0;

    let indexOffset = 0;
    for (let i = 0; i < props.layout.length; i++) {
      let startRadius = props.offsets 
        ? Math.floor(SeatSize * (5 + props.offsets[i])) 
        : Math.floor(SeatSize * 5);

      const radAngle = (Math.PI / 180) * deltaAngle * i;

      maxWidth = Math.max(
        maxWidth,
        SeatSize
          + Math.sin(radAngle) * (startRadius + SeatSize * props.layout[i])
          + Math.cos(radAngle) * SeatSize
      );
      maxWidth = Math.max(
        maxWidth,
        SeatSize
          + Math.sin(radAngle) * (startRadius + SeatSize * props.layout[i])
          - Math.cos(radAngle) * SeatSize
      );

      maxHeight = Math.max(
        maxHeight,
        SeatSize
          + Math.cos(radAngle) * (startRadius + SeatSize * props.layout[i])
          - Math.sin(radAngle) * SeatSize
      );
      maxHeight = Math.max(
        maxHeight,
        SeatSize
          + Math.cos(radAngle) * (startRadius + SeatSize * props.layout[i])
          + Math.sin(radAngle) * SeatSize
      );

      rows.push({
        indexOffset,
        x: -SeatSize,
        y: startRadius,
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

  public onSeatClicked = (id: string): void  => {
    this.setState({
      selectedId: id
    });
    this.props.onSeatSelected(id);
  }

  public render({layout, occupied, canOverride}: IRootComponentProps) {
    return (
      <div
        className="SEATBOOKING-root"
        style={`min-width: ${this.state.maxWidth}px; min-height: ${this.state.maxHeight}px`}
      >
        <style>{styles.toString()}</style>
        <svg width={this.state.maxWidth} height={this.state.maxHeight}>
          <defs>
            <OccupiedSeatPattern size={10} id="occupied"/>
          </defs>
          <g transform={`translate(${SeatSize}, ${SeatSize})`}>
            {
              this.state.rows.map((el, index) => (
                <RowOfTables
                  key={index.toString()}

                  canOverride={canOverride}

                  occupied={occupied}
                  indexOffset={el.indexOffset}
                  originX={el.x}
                  originY={el.y}
                  angle={el.angle}
                  selectedId={this.state.selectedId}
                  onClick={this.onSeatClicked}
                  tableCount={el.seatGroups}
                />
              ))
            }
          </g>
          <style>{seatStyles.toString()}</style>
        </svg>
      </div>
    );
  }
}
