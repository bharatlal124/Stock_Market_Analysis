//fetch Stocks Data function
async function fetchStockData() {
  try {
    const response = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstocksdata"
    );
    if (!response.ok) {
      throw new Error("Data did not fetch correctly");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error in fetching data: ", error);
    return null;
  }
}

export const fetchStock = fetchStockData();

//fetch profile data function
async function fetchProfileData() {
  try {
    const response = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
    );
    if (!response.ok) {
      throw new Error("Profile information could not be loaded");
    }

    const data = await response.json();
    // displayProfileData(data);
    return data;
  } catch (error) {
    console.log("Error in fetching profile data", error);
    return null;
  }
}

export const fetchProfile = fetchProfileData();

//fetch Stocks Stats Data function
async function fetchStockStatsData() {
  try {
    const response = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
    );
    if (!response.ok) {
      throw new Error(`Couldn't access the stock stats data`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error in getting Stock Stats Data", error);
    return null;
  }
}

export const fetchStats = fetchStockStatsData();
