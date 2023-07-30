// Function to fetch JSON data
async function fetchData() {
  const response = await fetch('rainfall_data.json');
  const data = await response.json();
  return data;
}

// Function to create the chart
async function createChart() {
  const data = await fetchData();
  const dates = data.dates;
  const rainfall = data.rainfall;
  const forecast = data.forecast;

  const ctx = document.getElementById('rainfallChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Historical Rainfall',
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          data: rainfall,
          fill: true,
          tension: 0.4, // Set the tension value for smoothing (0 < tension < 1)
        },
        {
          label: 'Forecast Rainfall',
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0)',
          borderDash: [5, 5], // Set this to an array to create a dashed line effect
          data: forecast,
          fill: false, // Do not fill under the line
          tension: 0.4, // Set the tension value for smoothing (0 < tension < 1)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Rainfall (mm)'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Historical and Forecast Rainfall Data'
        }
      }
    }
  });

  // Create a table with the last 5 forecast values
  const forecastTable = document.getElementById('forecastTable').getElementsByTagName('table')[0];
  let tableContent = `<tr><th>Date</th><th>Forecast Rainfall (mm)</th></tr>`;
  const lastFiveForecast = forecast.slice(-5);

  for (let i = 0; i < lastFiveForecast.length; i++) {
    tableContent += `<tr><td>${dates[dates.length - 1 - i]}</td><td>${lastFiveForecast[i]}</td></tr>`;
  }

  forecastTable.innerHTML = tableContent;
}

// Call the function to create the chart and table when the page is loaded
document.addEventListener('DOMContentLoaded', createChart);
