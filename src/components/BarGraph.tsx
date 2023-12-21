import React from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";

type BarGraphProps = {
    totalApplications: number;
    totalEmails: number;
    totalPhoneScreens: number;
    totalInterviews: number;
    totalRejections: number;
    totalAcceptances: number;
    totalOffers: number;
};

const BarGraph = ({
    totalApplications,
    totalEmails,
    totalPhoneScreens,
    totalInterviews,
    totalRejections,
    totalAcceptances,
    totalOffers
}: BarGraphProps) => {
    const data = [
        { type: "Applications", value: totalApplications },
        { type: "E-mails", value: totalEmails },
        { type: "Phone Screens", value: totalPhoneScreens },
        { type: "Interviews", value: totalInterviews },
        { type: "Rejections", value: totalRejections },
        { type: "Acceptances", value: 0 },
        { type: "Offers", value: 0 },
    ];
   
    // Define the graph dimensions and margins
    const width = 700;
    const height = 500;
    const margin = { top: 20, bottom: 50, left: 50, right: 20 };

    // Create scales
    const xScale = scaleBand({
        domain: data.map((d) => d.type),
        range: [margin.left, width - margin.right],
        padding: 0.5,
    });

    const yScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value))],
        range: [height - margin.bottom, margin.top],
    });

    // Customize y-axis ticks to whole numbers
    const yAxisTicks = yScale.ticks().filter((tick) => Number.isInteger(tick));

    return (
        <div className='graph'>
            <svg width={width} height={height}>
                <Group>
        

                    {data.map((d) => {
                        const barHeight = height - margin.bottom - yScale(d.value);
                        console.log(data.map(d => d.value)); // This should be an array of numbers

                        return (
                            <Bar
                                key={`bar-${d.type}`}
                                x={xScale(d.type)}
                                y={yScale(d.value)}
                                height={barHeight}
                                width={xScale.bandwidth()}
                                fill="#65C89B"
                            />
                        );
                    })}
                    <AxisLeft scale={yScale} left={margin.left} tickValues={yAxisTicks} />
                    <AxisBottom
                        scale={xScale}
                        top={height - margin.bottom}
                        tickLabelProps={() => ({
                            fontSize: 12,
                            textAnchor: "middle",
                        })}
                    />
                </Group>
            </svg>
            <h3 className="graph-info">
                Target 20% conversion from application full CS style application to
                phone screen.
            </h3>
            <h3 className="graph-info">
                You could possibly get {Math.floor(totalApplications * 0.2)} phone{" "}
                {totalPhoneScreens > 1 ? "screens" : "screen"} with your current rate of
                applications.
            </h3>
        </div>
    );
};

export default BarGraph;
