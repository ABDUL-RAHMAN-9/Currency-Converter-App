// script.js

document.getElementById("converter-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("from-currency").value;
    const toCurrency = document.getElementById("to-currency").value;
    const resultDiv = document.getElementById("result");
    const marketRateInfoDiv = document.getElementById("market-rate-info");
  
    const amount = parseFloat(amountInput.value);
  
    // Validate amount input
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
  
    // Use the free exchangerate-api endpoint (no API key needed)
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.rates[toCurrency]) {
          resultDiv.innerText = `Sorry, no rate available for ${toCurrency}`;
          marketRateInfoDiv.innerText = "";
          return;
        }
  
        const rate = data.rates[toCurrency];
        const convertedAmount = amount * rate;
  
        resultDiv.innerText = `${amount.toFixed(2)} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        marketRateInfoDiv.innerText = `Market rates collected on: ${new Date(data.time_last_updated * 1000).toLocaleString()}`;
      })
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
        resultDiv.innerText = "Error fetching exchange rates. Please try again later.";
        marketRateInfoDiv.innerText = "";
      });
  });
  