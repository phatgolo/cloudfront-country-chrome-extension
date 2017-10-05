const htmlElement = document.documentElement;
const bodyElement = htmlElement.querySelector('body');
const div = document.createElement('div');
div.innerHTML = `<country-banner>
    <country-banner-container>
        <country-banner-icon>🚨</country-banner-icon>
        <country-banner-label>
            You are currently emulating accessing this site from:<br/>
            <country-banner-country></country-banner-country>
        </country-banner-label>
        <country-banner-button class="country-banner-button_stop">Stop</country-banner-button>
        <country-banner-button class="country-banner-button_hide">Hide</country-banner-button>
    </country-banner-container>
</country-banner>`;
const bannerElement = div.firstChild;
const bannerCountryLabelElement = bannerElement.querySelector('country-banner-country');
const bannerStopElement = bannerElement.querySelector('country-banner-button.country-banner-button_stop');
const bannerHideElement = bannerElement.querySelector('country-banner-button.country-banner-button_hide');

chrome.runtime.onMessage.addListener((request) => {
    updateBanner(request);
});

chrome.runtime.sendMessage({getCountry: true}, function(response) {
    updateBanner(response);
});

bannerStopElement.addEventListener('click', (e) => {
    chrome.runtime.sendMessage({removeCountry: true}, function(response) {
        updateBanner(response);
    });
});

bannerHideElement.addEventListener('click', (e) => {
    updateBanner({});
})

function updateBanner(message) {
    if (message.country) {
        bannerCountryLabelElement.textContent = `${message.country.name}`;
        bodyElement.appendChild(bannerElement);
    } else {
        bodyElement.removeChild(bannerElement);
    }
}
