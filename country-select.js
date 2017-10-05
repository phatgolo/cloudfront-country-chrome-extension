const countryService = new Countries();
const searchField = document.getElementById('CountrySearch');
const template = document.getElementById('Template');
const main = document.querySelector('main');

const selectedCountryElement = document.querySelector('.selected-country');
const clearButton = selectedCountryElement.querySelector('.clear');

let selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));

searchField.addEventListener('keyup', (e) => {
    if (searchField.value === '') {
        return;
    }
    loadCountries(countryService.search(searchField.value));
});

if (selectedCountry) {
    sendMessage({country: selectedCountry});
    selectedCountry = selectedCountry;
    selectedCountryElement.style.display = 'flex';
    searchField.style.display = 'none';

    fillRow(selectedCountryElement, selectedCountry);

    clearButton.addEventListener('click', (e) => {
        saveCountryCode(null);
    });
} else {
    window.document.body.classList.add('just-search');
}

function loadCountries(countries) {
    main.innerHTML = '';
    countries.filter(country => {
        return selectedCountry ? country.name !== selectedCountry.name : true
    }).forEach(country => {
        const docFragment = template.content.cloneNode(true);
        const row = docFragment.querySelector('.row');

        fillRow(row, country);

        row.addEventListener('click', onClick);
        row.addEventListener('keyup', onKeyUp);

        row.dataset.countryCode = country.alpha2Code;

        main.appendChild(docFragment);
    });
}

function onClick(e) {
    selectCountry(e.target);
}

function onKeyUp(e) {
    if (e.key === 'Enter') {
        selectCountry(e.target);
    }
}

function selectCountry(row) {
    const selectedCountry = countryService.getByCode(row.dataset.countryCode);
    saveCountryCode(selectedCountry);
}

function saveCountryCode(country) {
    if (country) {
        chrome.browserAction.setIcon({path:'icon.png'});
        localStorage.setItem('selectedCountry', JSON.stringify(country));
    } else {
        chrome.browserAction.setIcon({path:'icon_disabled.png'});
        localStorage.removeItem('selectedCountry');
    }
    sendMessage({country: country});
    window.close();
}

function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

function fillRow(row, country) {
    const icon = row.querySelector('.icon');
    const name = row.querySelector('.name');
    name.textContent = country.name;
    icon.src = `flags/${country.alpha3Code}.png`;
}

