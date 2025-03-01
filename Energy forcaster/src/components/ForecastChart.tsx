
import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { EnergyForecast } from '../types/weatherTypes';
import { getEnergyChartConfig, energyChartOptions } from '../utils/chartUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastChartProps {
  forecast: EnergyForecast;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ forecast }) => {
  // Fix the ref type to specifically be a Chart<'line'>
  const chartRef = useRef<ChartJS<'line'>>(null);
  const chartData: ChartData<'line'> = getEnergyChartConfig(forecast);
  const options: ChartOptions<'line'> = energyChartOptions;
  
  // Re-render chart when forecast or theme changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [forecast]);
  
  return (
    <div className="w-full h-[300px] md:h-[400px] mt-2 animate-fade-in">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ForecastChart;
