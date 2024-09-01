let coin = "bitcoin"; // Default coin set to Bitcoin

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display Bitcoin data on initial load
  FundamentalAPICall(coin);
  chartAPICall(coin);
});

// Global variables
let myChart; // Declare myChart globally
const x_axis = [];
const y_axis = [];
const ctx = document.getElementById('myChart');
const inp = document.querySelector("#search-input");
const srcBtn = document.querySelector("#search-btn");

// Function to set API call parameters for fundamental data
function setfundamentalCoinName(coin) {
  const fundamentalOBj = {
    fundamentalData: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`,
    options: {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-LsHvnALtKZFYdQbHT4HVAX7s'
      }
    }
  };
  return fundamentalOBj;
}

// Function to set API call parameters for chart data
function setChatDataCoin(coin) {
  const chartObj = {
    chartData: `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=inr&days=180`,
    options2: {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-LsHvnALtKZFYdQbHT4HVAX7s'
      }
    }
  };
  return chartObj;
}

// Function to render the chart
function getChart() {
  // Create a new chart instance and store it in the global variable myChart
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x_axis,
      datasets: [{
        label: coin.charAt(0).toUpperCase() + coin.slice(1), // Dynamically set the label to the current coin
        data: y_axis,
        borderWidth: 3
      }]
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Function to call the fundamental data API
function FundamentalAPICall(coin) {
  const apiData = setfundamentalCoinName(coin);

  fetch(apiData.fundamentalData, apiData.options)
    .then(response => response.json())
    .then(data => {
      if (data) {
        document.querySelector("#coin-image").src = data[0].image;
        document.querySelector("#coin-id").textContent = data[0].symbol;
        document.querySelector("#coin-price").textContent = "₹" + data[0].current_price;
        document.querySelector("#market-capital").textContent = data[0].market_cap;
        document.querySelector("#market-rank").textContent = data[0].market_cap_rank;
        document.querySelector("#total-volume").textContent = data[0].total_volume;
        document.querySelector("#highAndLow").textContent = data[0].high_24h + " / " + data[0].low_24h;
        document.querySelector("#percent").textContent = data[0].price_change_percentage_24h;
        document.querySelector("#price-change").textContent = data[0].price_change_24h;
      }
    })
    .catch(error => {
      console.log(error);
    });
}

// Function to call the chart data API
function chartAPICall(coin) {
  const apiData = setChatDataCoin(coin);

  // Clear the existing data before fetching new data
  x_axis.length = 0;
  y_axis.length = 0;

  fetch(apiData.chartData, apiData.options2)
    .then(response => response.json())
    .then(data => {
      if (data) {
        for (let i = 0; i < 30; i++) {
          y_axis.push(data.prices[i][1]);

          const date = new Date(data.prices[i][0]);
          const day = date.getDay() + 1;
          x_axis.push(day);
        }

        // Destroy the existing chart instance if it exists
        if (myChart) {
          myChart.destroy();
        }

        // Render the chart with the updated data
        getChart();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

// Search button event listener
srcBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const value = inp.value;
  searchCoin(value);
});

// Function to search and update the chart with the new coin data
function searchCoin(info) {
  coin = info;
  chartAPICall(coin);       // Update chart data
  FundamentalAPICall(coin); // Update fundamental data
  
  inp.value = "";
  console.log(coin);
}
