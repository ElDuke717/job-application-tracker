import React from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { scaleOrdinal } from '@visx/scale';

const Legend = ({ pieData, colorScale }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {pieData.map((data, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: colorScale(data.label), marginRight: '10px' }}></div>
          <div>{data.label}</div>
        </div>
      ))}
    </div>
);

const PieChartComponent = ({ data, groupByKey, width = 400, height = 400 }) => {
  const groupCounts = data.reduce((acc, item) => {
    const groupValue = item[groupByKey];
    acc[groupValue] = (acc[groupValue] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(groupCounts).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const total = pieData.reduce((acc, curr) => acc + curr.value, 0);

  const colorScale = scaleOrdinal({
    domain: pieData.map(d => d.label),
    range: ['#102a43', '#911111', '#f7d070', '#4055a8', '#35469c', '#da4a91', '#e668a7'],
  });

  const radius = Math.min(width, height) / 2;

  return (
    <div className='pie-chart'>
        <h2>Applications by Type</h2>
    <svg width={width} height={height}>
      <Group top={height / 2} left={width / 2}>
        <Pie
          data={pieData}
          pieValue={d => d.value}
          outerRadius={radius}
          innerRadius={radius / 2}
          padAngle={0.01}
        >
          {pie =>
            pie.arcs.map((arc, i) => {
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const percent = ((arc.data.value / total) * 100).toFixed(1);

              return (
                <g key={`arc-${i}`}>
                  <path d={pie.path(arc)} fill={colorScale(arc.data.label)} />
                  <Text
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={12}
                    textAnchor="middle"
                    fill="white"
                  >
                    {`${percent}%`}
                  </Text>
                </g>
              );
            })
          }
        </Pie>
      </Group>
    </svg>
        <div className='legend'>
            <Legend pieData={pieData} colorScale={colorScale} />
        </div>
    </div>
  );
};

export default PieChartComponent;
