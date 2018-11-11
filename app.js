var availableCurrencies;
var conversionRates;

fetch('http://apilayer.net/api/live?access_key=6a0bf60d7654b25fcd43370cc6119732')
    .then(response => response.json())
    .then(response => {
        conversionRates = response.quotes;
        fillCurrencyCodeList(fromCurrencyCodeSelectList);
        fillCurrencyCodeList(toCurrencyCodeSelectList);
        fillCurrencyCountryList(fromCurrencyCountrySelectList);
        fillCurrencyCountryList(toCurrencyCountrySelectList);
    });

fetch('http://apilayer.net/api/list?access_key=6a0bf60d7654b25fcd43370cc6119732')
    .then(response => response.json())
    .then(response => {
        availableCurrencies = response.currencies;
    });

var fromCurrencyCodeSelectList = document.querySelector('select.currencyCode[data-type="from"]');
var fromCurrencyCountrySelectList = document.querySelector('select.currencyCountry[data-type="from"]');
var toCurrencyCodeSelectList = document.querySelector('select.currencyCode[data-type="to"]');
var toCurrencyCountrySelectList = document.querySelector('select.currencyCountry[data-type="to"]');

var circles = document.querySelectorAll('.circle');
var switchCurrencyCircle = circles[0];
var switchValuesCircle = circles[1];

var inputElements = document.querySelectorAll('input');
var fromInputElement = inputElements[0];
var toInputElement = inputElements[1];


function fillCurrencyCodeList(listElement) {
    Object.keys(availableCurrencies).forEach(currencyCode => {
        var optionElement = document.createElement('option');
        optionElement.value = currencyCode;
        optionElement.textContent = currencyCode;
        listElement.append(optionElement);
    });
}

function fillCurrencyCountryList(listElement) {
    Object.keys(availableCurrencies).forEach(currencyCode => {
        var optionElement = document.createElement('option');
        optionElement.value = currencyCode;
        optionElement.textContent = availableCurrencies[currencyCode];
        listElement.append(optionElement);
    });
}

function recalculateCurrency(element) {
    var currencyCode = element.value;
    var type = element.getAttribute('data-type');
    setCurrency(type, currencyCode);
    calculateResult();
}

function calculateResult() {
    var amount = parseFloat(fromInputElement.value);
    var fromCurrency = fromCurrencyCodeSelectList.value;
    var toCurrency = toCurrencyCodeSelectList.value;
    var result = conversionRates['USD' + toCurrency] / conversionRates['USD' + fromCurrency] * amount;
    toInputElement.value = (result || 0).toFixed(3);
}

function flipCurrencies() {
    var fromCurrency = fromCurrencyCodeSelectList.value;
    var toCurrency = toCurrencyCodeSelectList.value;
    setCurrency('from', toCurrency);
    setCurrency('to', fromCurrency);
    switchCurrencyCircle.classList.toggle('flipped');
    calculateResult();
}

function flipValues() {
    var fromValue = fromInputElement.value;
    var toValue = toInputElement.value;
    fromInputElement.value = toValue;
    toInputElement.value = fromValue;
    switchValuesCircle.classList.toggle('flipped');
    calculateResult();
}

function setCurrency(type, code) {
    if (type === 'from') {
        fromCurrencyCodeSelectList.value = code;
        fromCurrencyCountrySelectList.value = code;
    } else {
        toCurrencyCodeSelectList.value = code;
        toCurrencyCountrySelectList.value = code;
    }
}