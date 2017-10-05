const settings = {
    urls: []
};

const options = [
    'requestHeaders',
    'blocking'
];

let country = getCountry();

updateIcon(country)

chrome.webRequest.onBeforeSendHeaders
    .addListener(addCloudfrontViewerCountry, settings, options);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getCountry) {
        callback(sendResponse);
    }

    if (request.removeCountry) {
        localStorage.removeItem('selectedCountry');
        callback(sendResponse);
    }
});

function callback(sendResponse) {
    country = getCountry();
    sendResponse({country: country});
    updateIcon(country);
}

function addCloudfrontViewerCountry(details) {
    country = getCountry();

    if (country) {
        addHeader(details, {
            name: 'Cloudfront-Viewer-Country',
            value: country.alpha2Code
        });
    }

    return {
        requestHeaders: details.requestHeaders
    };
}

function getCountry() {
    return JSON.parse(localStorage.getItem('selectedCountry'));
}

function addHeader(details, header) {
    details.requestHeaders.push(header);
}

function updateIcon(country) {
    if (country) {
        chrome.browserAction.setIcon({path:'icon.png'});
    } else {
        chrome.browserAction.setIcon({path:'icon_disabled.png'});
    }
}