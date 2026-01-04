const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const amountInput = document.querySelector("#amount");
const resultText = document.querySelector("#exchange-rate-text");
const totalResult = document.querySelector("#total-result");
const swapBtn = document.querySelector("#swap-btn");
const convertBtn = document.querySelector("#convert-btn");

const country_list = {
    USD: "US",
    INR: "IN",
    EUR: "EU",
    GBP: "GB",
    AED: "AE",
    JPY: "JP",
    AUD: "AU",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    HKD: "HK",
    NZD: "NZ",
};

// Initialize Options
[fromCurrency, toCurrency].forEach((select, index) => {
    for (let code in country_list) {
        let selected =
            index === 0
                ? code === "USD"
                    ? "selected"
                    : ""
                : code === "INR"
                ? "selected"
                : "";
        select.insertAdjacentHTML(
            "beforeend",
            `<option value="${code}" ${selected}>${code}</option>`
        );
    }
    select.addEventListener("change", (e) => updateFlag(e.target));
});

function updateFlag(element) {
    const code = element.value;
    const imgTag = element.parentElement.querySelector("img");
    imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
    getExchangeRate();
}

async function getExchangeRate() {
  let amountVal = amountInput.value;
  
  // We NO LONGER force amountInput.value = "1" here.
  // This allows the user to clear the field.

  // If the field is empty, we just treat the math as 0 for the display
  let calculationValue = amountVal;
  if (amountVal === "" || amountVal <= 0) {
      calculationValue = 0; 
  }
  
  resultText.innerText = "Updating...";
  
  try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
      const data = await response.json();
      const rate = data.rates[toCurrency.value];
      
      // Always show the 1-to-1 base rate for reference
      resultText.innerText = `1 ${fromCurrency.value} = ${rate} ${toCurrency.value}`;
      
      // Calculate the total based on what user typed (or 0 if empty)
      const total = (calculationValue * rate).toFixed(2);
      totalResult.innerText = `${total} ${toCurrency.value}`;
      
  } catch (error) {
      resultText.innerText = "Offline - Check Connection";
      totalResult.innerText = "Error";
  }
}

// --- NEW PRO FEATURE: Auto-select text on click ---
// This makes it so when you click the '1', you can just type '50' 
// and it replaces the '1' automatically without needing backspace.
amountInput.addEventListener("focus", () => {
  amountInput.select();
});

// Keep the rest of your event listeners (swapBtn, input, load, etc.)

// --- BUG FIX: Block non-numeric keys ---
amountInput.addEventListener("keydown", (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault();
    }
});

swapBtn.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    updateFlag(fromCurrency);
    updateFlag(toCurrency);
});

amountInput.addEventListener("input", getExchangeRate);
convertBtn.addEventListener("click", getExchangeRate);
window.addEventListener("load", getExchangeRate);
