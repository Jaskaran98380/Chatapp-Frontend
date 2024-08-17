import React from 'react'
import { Doughnut, Line } from "react-chartjs-2";
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    plugins,
  } from "chart.js";
import { getLast7Days } from '../../lib/features';

  ChartJS.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
  );

  const labels = getLast7Days();

const LineChart = ({value=[]}) => {

    const lineChartData = {
        labels: labels,
        datasets: [{
          label: 'Messages',
          data: value,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      const lineChartOptions = {
        responsive:true,
        plugins:{
            legend:{
                // display:false 
            },
            title:{
                display: false
                
            }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          }
        }
      };

  return (
    <Line data={lineChartData} options={lineChartOptions} />
  )
}

const DoughnutChart = ({value=[] , labels=[]}) => {
    
    const doughnutChartOptions = {
        responsive:true,
        plugins:{
            legend:{
                // display:false
            },
            title:{
                display: false
                
            }
        }}

    const doughnutChartData = {
    labels:labels,
        datasets: [{
          data: value,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      };

    

  return (
    <Doughnut data={doughnutChartData} options={doughnutChartOptions}  />
  )
}

export {LineChart , DoughnutChart}