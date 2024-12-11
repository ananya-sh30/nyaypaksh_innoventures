import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "../styles/Chart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JudicialTrends = ({ caseKeywords, caseIssue }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post('http://localhost:5000/api/suggestions/getJudicialTrends', {
        caseKeywords,
        caseIssue,
      })
      .then((response) => {
        const { barChartData: chartData } = response.data;
        setBarChartData(chartData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching judicial trends data:', error);
        setLoading(false);
      });
  }, [caseKeywords, caseIssue]);

  // Group data for bar chart
  const groupedData = barChartData.reduce((acc, item) => {
    const { court_type, respondent_wins = 0, appellant_wins = 0 } = item;

    if (!acc[court_type]) {
      acc[court_type] = {
        court_type,
        respondent_wins: 0,
        appellant_wins: 0,
      };
    }

    acc[court_type].respondent_wins += respondent_wins;
    acc[court_type].appellant_wins += appellant_wins;

    return acc;
  }, {});

  const chartData = Object.values(groupedData);

  // Extract data for the chart
  const jurisdiction = chartData.map((item) => item.court_type);
  const respondentWins = chartData.map((item) => item.respondent_wins);
  const appellantWins = chartData.map((item) => item.appellant_wins);

  // Chart data configuration
  const data = {
    labels: jurisdiction,
    datasets: [
      {
        label: 'Wins for Respondent',
        data: respondentWins,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Wins for Appellant',
        data: appellantWins,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Judicial Trends by Jurisdiction',
      },
    },
  };

  return (
    <div className="judicial-trends-container">
      <h3>Judicial Trends</h3>

      {/* Bar Chart */}
      {loading ? (
        <p className="loading-text">Loading judicial trends...</p>
      ) : barChartData.length > 0 ? (
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>No data available for judicial trends.</p>
      )}
    </div>
  );
};

export default JudicialTrends;
