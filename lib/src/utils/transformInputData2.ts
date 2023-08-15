import type {
  InputDatum,
  PrimitiveViewWindow,
  TransformedData,
} from "../types";
import { ScaleLinear, scaleLinear } from "d3-scale";

export const transformInputData = <T extends InputDatum>({
  data,
  xKey,
  yKeys,
  outputWindow,
}: {
  data: T[];
  xKey: keyof T;
  yKeys: (keyof T)[];
  outputWindow: PrimitiveViewWindow;
}): TransformedData & {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
} => {
  const ix = data.map((datum) => datum[xKey]);
  const xScale = scaleLinear()
    .domain([ix.at(0), ix.at(-1)])
    .range([outputWindow.xMin, outputWindow.xMax]);
  const ox = ix.map((x) => xScale(x));

  const y = [] as TransformedData["y"];

  // TODO: These ain't right...
  const yMin = Math.min(
    ...yKeys.map((key) => Math.min(...data.map((datum) => datum[key]))),
  );
  const yMax = Math.max(
    ...yKeys.map((key) => Math.max(...data.map((datum) => datum[key]))),
  );
  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([outputWindow.yMin, outputWindow.yMax]);

  yKeys.forEach((yKey) => {
    y.push({
      i: data.map((datum) => datum[yKey]),
      o: data.map((datum) => yScale(datum[yKey])),
    });
  });

  return {
    ix,
    ox,
    y,
    xScale,
    yScale,
  };
};