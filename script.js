let coin = "bitcoin"
document.addEventListener("DOMContentLoaded", FundamentalAPICall(coin));
document.addEventListener("DOMContentLoaded", chartAPICall(coin));

// Global variables
const x_axis = [];
const y_axis = [];
const ctx = document.getElementById('myChart');
const inp = document.querySelector("#search-input")
const srcBtn = document.querySelector("#search-btn")


// API variables

//set coin name dynamically

function setfundamentalCoinName(coin) {
  // Fundamentals API call variables

  const fundamentalOBj={
    fundamentalData : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`,
    options : {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-LsHvnALtKZFYdQbHT4HVAX7s' }
    }
  }
  
  return fundamentalOBj;
}





function setChatDataCoin(coin){
  // Graph API call variables
  const chartObj={
    chartData : `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=inr&days=180`,
    options2 : {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-LsHvnALtKZFYdQbHT4HVAX7s' }
    }
  }

  return chartObj;
}


// Chart
function getChart() {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: x_axis,
      datasets: [{
        label: 'Bitcoin',
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

// Data
function FundamentalAPICall(coin) {

  const apiData=setfundamentalCoinName(coin)

  fetch(apiData.fundamentalData, apiData.options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
    .catch(function (error) {
      console.log(error);
    })
}

// Chart Data
function chartAPICall(coin) {

  const apiData=setChatDataCoin(coin)

  fetch(apiData.chartData, apiData.options2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data) {
        for (let i = 0; i < 30; i++) {
          y_axis.push(data.prices[i][1]);

          //x_axis.push(data.prices[i][0]);

          const date = new Date(data.prices[i][0]);
          const day = date.getDay() + 1;
          x_axis.push(day);
        }

        console.log(x_axis);
        // console.log(y_axis);

        // Call getChart only after data is fetched
        getChart();
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}

//search function 

srcBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const value = inp.value
  searchCoin(value);
})

 function searchCoin(info) {
  coin = info
  chartAPICall(coin);
  FundamentalAPICall(coin);
  
  inp.value="";
  console.log(coin)
}

