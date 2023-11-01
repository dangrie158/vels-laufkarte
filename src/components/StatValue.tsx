import React, { useEffect, useRef, useState } from "react";
import "./StatValue.css";

function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
  return (-c / 2) * (--t * (t - 2) - 1) + b;
}

type StatValueProps = {
  value: number;
  type: "fraction" | "percentage" | "number";
  maxValue?: number;
  duration?: number;
};
const StatValue: React.FC<StatValueProps> = (props: StatValueProps) => {
  const [currentValue, setCurrentValue] = useState(0);

  const duration = props.duration ?? 1000;
  const frameRequest = useRef<number>();
  const startTime = React.useRef(Date.now());
  const startValue = React.useRef(props.value);

  useEffect(() => {
    startValue.current = currentValue;

    const startOffset = Math.floor((Math.random() * duration) / 10);
    setTimeout(() => {
      startTime.current = Date.now();
      frameRequest.current = requestAnimationFrame(animate);
    }, startOffset);
    return () => (frameRequest.current ? cancelAnimationFrame(frameRequest.current) : void 0);
  }, [props.value]);

  const animate = async () => {
    const current = Date.now() - startTime.current;
    const from = startValue.current;
    const to = props.value;
    const endTime = startTime.current + duration;
    const newValue = easeInOutQuad(current, from, to, duration);
    if (Date.now() >= endTime) {
      setCurrentValue(props.value);
      frameRequest.current = undefined;
    } else {
      setCurrentValue(Math.round(newValue));
      frameRequest.current = requestAnimationFrame(animate);
    }
  };

  const text = () => {
    switch (props.type) {
      case "fraction":
        return (
          <>
            <text x={60} y={10} dominantBaseline="hanging">
              /
            </text>
            <text x={100} y={20} dominantBaseline="hanging">
              {props.maxValue}
            </text>
          </>
        );
      case "percentage":
        return (
          <text x={60} y={10} dominantBaseline="hanging">
            %
          </text>
        );
      case "number":
        return <></>;
    }
  };

  return (
    <div className="statistic">
      <svg viewBox="0 0 100 30" className="stat">
        <text x={60} y={10} dominantBaseline="hanging">
          {currentValue}
        </text>
        {text()}
      </svg>
    </div>
  );
};
export default StatValue;
