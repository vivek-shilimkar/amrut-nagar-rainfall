// Variable to store the chart instance
let rainfallChart;

// Function to fetch rainfall data from the JSON files
async function fetchRainfallData() {
    // Fetch historical rainfall data
    const historicalResponse = await fetch('historical_rainfall_data.json');
    const historicalData = await historicalResponse.json();
  
    // Fetch forecast rainfall data
    const forecastResponse = await fetch('forecast_data.json');
    const forecastData = await forecastResponse.json();
  
    // Extract the data arrays from the fetched JSON objects
    const historicalDates = historicalData.dates;
    const historicalRainfall = historicalData.rainfall;
    const forecastRainfall = forecastData.forecast;
  
    // Calculate the forecasted dates based on the last historical date
    const lastHistoricalDate = new Date(historicalDates[historicalDates.length - 1]);
    const forecastDates = [];
    for (let i = 1; i <= forecastRainfall.length; i++) {
      const forecastDate = new Date(lastHistoricalDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      forecastDates.push(forecastDate.toISOString().slice(0, 10));
    }
  
    return { historicalDates, historicalRainfall, forecastDates, forecastRainfall };
  }

// Function to generate forecast table rows for the next three days
function generateForecastTable(dates, forecast) {
  const forecastTableBody = document.getElementById('forecastTableBody');

  // Clear existing table rows
  forecastTableBody.innerHTML = '';

  // Generate table rows for forecast data
  for (let i = 0; i < dates.length; i++) {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const forecastCell = document.createElement('td');

    // Format date in a user-friendly format (e.g., "Jul 25, 2023")
    const formattedDate = new Date(dates[i]).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    dateCell.textContent = formattedDate;
    forecastCell.textContent = forecast[i].toFixed(1); // Display forecast with one decimal point

    row.appendChild(dateCell);
    row.appendChild(forecastCell);
    forecastTableBody.appendChild(row);
  }
}

// Function to create the timeseries plot and populate the tables
async function init() {
    // Fetch rainfall data
    const { historicalDates, historicalRainfall, forecastDates, forecastRainfall } = await fetchRainfallData();
    console.log('Historical Dates:', historicalDates);
    console.log('Historical Rainfall:', historicalRainfall);
    console.log('Forecast Dates:', forecastDates);
    console.log('Forecast Rainfall:', forecastRainfall);
  
    // If the chart instance already exists, update its data
    if (rainfallChart) {
      // Update historical rainfall data
      rainfallChart.data.datasets[0].data = historicalRainfall;
  
      // Find the index from which forecast data should be plotted
      const startIndex = historicalDates.length;
  
      // Update forecasted rainfall data
      for (let i = 0; i < forecastDates.length; i++) {
        const forecastIndex = historicalDates.indexOf(forecastDates[i]);
        if (forecastIndex !== -1) {
          rainfallChart.data.datasets[1].data[forecastIndex] = forecastRainfall[i];
        }
      }
  
      rainfallChart.update();
    } else {
      // Generate the timeseries plot (Chart.js code)
      const ctx = document.getElementById('rainfallChart').getContext('2d');
      rainfallChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...historicalDates, ...forecastDates],
          datasets: [
            {
              label: 'Rainfall (mm)',
              data: historicalRainfall,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              borderWidth: 1,
              fill: true,
            },
            {
              label: 'Forecasted Rainfall (mm)',
              data: Array(historicalDates.length).fill(null).concat(forecastRainfall),
              borderColor: 'green',
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              borderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM D',
                },
              },
              title: {
                display: true,
                text: 'Date',
              },
              maxTicksLimit: 10,
            },
            y: {
              title: {
                display: true,
                text: 'Rainfall (mm)',
              },
            },
          },
        },
      });
    }
  
    // Populate the forecast table with the forecast data for the next three days
    generateForecastTable(forecastDates, forecastRainfall);
  }
  
  // Initialize the page
  init();
  
  