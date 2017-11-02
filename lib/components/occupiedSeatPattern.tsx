import { h } from "preact";

interface IOccupiedSeatPatternProps {
  id: string;
  size: number;
}

const OccupiedSeatPattern = ({ id, size }: IOccupiedSeatPatternProps) => (
  <pattern id={id} x="0" y="0" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)" width={size} height={size}>
    <rect x={0} y={-size / 2} fill="#ed0a47" stroke="#ffccd5" stroke-width={size / 2} width={size} height={size * 2}/>
  </pattern>
);
export default OccupiedSeatPattern;
