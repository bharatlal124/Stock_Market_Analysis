// import all fetch data file
import { fetchStock, fetchProfile, fetchStats } from "./fetch.js";

const Stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

const chartDiv = document.getElementById("stock-chart");
const listDiv = document.getElementById("stock-list");
const detailsDiv = document.getElementById("stock-details");

let selectedStock = Stocks[0];
renderStockList(); //calling the render stock list function
displayStocksStatsData(fetchStats); //calling the display stocks stats data

// fetch data function
async function fetchData(stockSymbol, period) {
  const stockData = await fetchStock;
  const profiledata = await fetchProfile;
  displayChart(stockSymbol, period, stockData);
  displayProfileData(stockSymbol, profiledata);
}

// function for render Stock List
function renderStockList() {
  Stocks.forEach((stock) => {
    const listItem = document.createElement("div");
    listItem.classList.add("stock-list-item");
    listItem.innerText = stock;
    if (stock === selectedStock) {
      listItem.classList.add("active");
    }
    listItem.onclick = () => {
      selectedStock = stock;
      fetchData(stock, "1y");
    };
    listDiv.appendChild(listItem);
  });
}

//On Click function on button
document.getElementById("btn1").onclick = function () {
  displayChartbtn("1mo");
};

document.getElementById("btn2").onclick = function () {
  displayChartbtn("3mo");
};

document.getElementById("btn3").onclick = function () {
  displayChartbtn("1y");
};

document.getElementById("btn4").onclick = function () {
  displayChartbtn("5y");
};

function displayChartbtn(period) {
  fetchData(selectedStock, period);
}

////////////////////////////////////////////////

//Display Stock data graph
function displayChart(stockSymbol, period, data) {
  const stockData = data.stocksData[0][stockSymbol][period];

  if (!stockData) {
    console.error("No data available for the selected stock and period.");
    return;
  }

  const timestamps = stockData.timeStamp.map((timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString()
  );
  const values = stockData.value;

  // Find peak (high) and low values
  const peakValue = Math.max(...values);
  const lowValue = Math.min(...values);

  const chartLayout = {
    title: `${stockSymbol} Stock Prices - ${period}`,
    xaxis: {
      title: "Date",
      tickvals: stockData.timeStamp,
      ticktext: timestamps,
    },
    yaxis: {
      title: "Stock Price",
    },
    annotations: [
      {
        x: stockData.timeStamp[values.indexOf(peakValue)],
        y: peakValue,
        xref: "x",
        yref: "y",
        text: `Peak: $${peakValue.toFixed(2)}`,
        showarrow: true,
        arrowhead: 4,
        ax: 0,
        ay: -40,
      },
      {
        x: stockData.timeStamp[values.indexOf(lowValue)],
        y: lowValue,
        xref: "x",
        yref: "y",
        text: `Low: $${lowValue.toFixed(2)}`,
        showarrow: true,
        arrowhead: 4,
        ax: 0,
        ay: 40,
      },
    ],
  };

  const chartData = [
    {
      x: stockData.timeStamp,
      y: values,
      type: "scatter",
      mode: "lines+markers",
    },
  ];

  Plotly.newPlot("stock-chart", chartData, chartLayout);
}

///////////////////////////////////////////////

//Display profile Data
async function displayProfileData(stockSymbol, data) {
  detailsDiv.innerHTML = "";

  // Fetching side data;
  const stockStatsData =
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata";
  const stockStats = await fetchStats;
  const OurStockDetails = stockStats.stocksStatsData[0];

  const bookValue = OurStockDetails[stockSymbol].bookValue;
  const profit = OurStockDetails[stockSymbol].profit;

  if (
    data &&
    data.stocksProfileData &&
    data.stocksProfileData[0] &&
    data.stocksProfileData[0][stockSymbol]
  ) {
    const profileData = data.stocksProfileData[0][stockSymbol];

    detailsDiv.innerHTML += ` 
        <h2 style="display: inline">${stockSymbol} </h2>
        &nbsp 
        <h2 style="color: ${profit > 0 ? "green" : "red"}; display : inline; ">
        ${profit}%</h2> 
        &nbsp 
        <h2 style="display: inline">$${bookValue}</h2> 
        <p>${profileData.summary}</p>
      `;
  } else {
    detailsDiv.innerHTML = "<p>Error: Unable to retrieve profile data.</p>";
  }
}

fetchData(selectedStock, "1y");

/////////////////////////////////////////////////

// Display Stock stats data in HTML
async function displayStocksStatsData(fetch3) {
  const listStats = document.createElement("div");
  listStats.classList.add("stock-stats-item");
  listDiv.append(listStats);

  const stockStatsData =
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata";
  const stockStats = await fetchStats;
  const stocksData = stockStats.stocksStatsData[0];

  for (const symbol in stocksData) {
    if (stocksData.hasOwnProperty(symbol)) {
      const stockDetails = stocksData[symbol];
      if (stockDetails !== "64c23f244f964661d584272c") {
        const stockItem = document.createElement("div");
        stockItem.classList.add("stock-item");

        stockItem.innerHTML += `
          <p > $${stockDetails.bookValue}</p>
          <p style="color: ${
            stockDetails.profit > 0 ? "green" : "red"
          }; margin-left:20px;"> ${stockDetails.profit}%</p>`;
        listStats.appendChild(stockItem);
      }
    }
  }
}
