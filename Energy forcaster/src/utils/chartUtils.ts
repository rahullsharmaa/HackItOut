
import { EnergyForecast } from '../types/weatherTypes';

// Configuration for energy forecast chart
export const getEnergyChartConfig = (forecast: EnergyForecast) => {
  return {
    labels: forecast.labels,
    datasets: [
      {
        label: 'Solar Energy Potential',
        data: forecast.solar,
        fill: 'start',
        backgroundColor: 'rgba(89, 193, 109, 0.2)',
        borderColor: 'rgba(89, 193, 109, 1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(89, 193, 109, 1)',
        tension: 0.4,
      },
      {
        label: 'Wind Energy Potential',
        data: forecast.wind,
        fill: 'start',
        backgroundColor: 'rgba(82, 165, 246, 0.2)',
        borderColor: 'rgba(82, 165, 246, 1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(82, 165, 246, 1)',
        tension: 0.4,
      },
    ],
  };
};

// Options for energy forecast chart
export const energyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: number) => `${value}%`,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 8,
      usePointStyle: true,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value.toFixed(1)}%`;
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 5,
    },
  },
};

// Function to get best time of day for renewable energy
export const getBestEnergyTime = (forecast: EnergyForecast): {
  solarBestTime: string;
  windBestTime: string;
  combinedBestTime: string;
} => {
  // Find the index of the max value for solar
  const solarMaxIndex = forecast.solar.indexOf(Math.max(...forecast.solar));
  const solarBestTime = forecast.labels[solarMaxIndex];
  
  // Find the index of the max value for wind
  const windMaxIndex = forecast.wind.indexOf(Math.max(...forecast.wind));
  const windBestTime = forecast.labels[windMaxIndex];
  
  // Find the index of the max combined value
  const combined = forecast.solar.map((s, i) => s + forecast.wind[i]);
  const combinedMaxIndex = combined.indexOf(Math.max(...combined));
  const combinedBestTime = forecast.labels[combinedMaxIndex];
  
  return {
    solarBestTime,
    windBestTime,
    combinedBestTime,
  };
};
