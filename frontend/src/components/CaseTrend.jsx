import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import "../styles/Chart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CaseTrendChart = ({ caseKeywords, caseType }) => {
  const [trendData, setTrendData] = useState(null);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/suggestions/getCaseTrends', { 
          caseKeywords, 
          caseType 
        });
        const data = response.data;
        console.log(data);
        const totalCasesPerYear = data.reduce((acc, entry) => {
          return acc + parseInt(entry.respondent_count) + parseInt(entry.appellant_count);
        }, 0);
        setTotalCases(totalCasesPerYear);
        setTrendData(data);
      } catch (error) {
        console.error("Error fetching trend data:", error);
      }
    };
    fetchTrendData();
  }, [caseKeywords, caseType]);

  const chartData = {
    labels: trendData ? trendData.map(entry => entry.case_year) : [],
    datasets: [
      {
        label: 'Appellant Trend (%)',
        data: trendData ? trendData.map(entry => (parseInt(entry.appellant_count) / totalCases) * 100) : [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Respondent Trend (%)',
        data: trendData ? trendData.map(entry => (parseInt(entry.respondent_count) / totalCases) * 100) : [],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
      }
    ],
  };

  const maxValue = trendData
    ? Math.ceil(
        Math.max(
          ...trendData.map(entry => ((parseInt(entry.respondent_count) + parseInt(entry.appellant_count)) / totalCases) * 100)
        )
      )
    : 10;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Case Trend Over Years',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return `${value.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: maxValue || 10,
        ticks: {
          stepSize: Math.ceil(maxValue / 10) || 1,
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
    },
  };

  return (
    <div className="chart-container-case">
      {trendData ? <Line data={chartData} options={chartOptions}/> : <p>Loading trend data...</p>}
    </div>
  );
};

export default CaseTrendChart;
