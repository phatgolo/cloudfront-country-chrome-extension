

function modifyHeader(source, dest) {
    if (!source.length) {
        return;
    }
    // Create an index map so that we can more efficiently override
    // existing header.
    var indexMap = {};
    angular.forEach(dest, function (header, index) {
        indexMap[angular.lowercase(header.name)] = index;
    });
    angular.forEach(source, function (header) {
        var index = indexMap[angular.lowercase(header.name)];
        if (index !== undefined) {
            if (!currentProfile.appendMode) {
                dest[index].value = header.value;
            } else if (currentProfile.appendMode == 'comma') {
                if (dest[index].value) {
                    dest[index].value += ',';
                }
                dest[index].value += header.value;
            } else {
                dest[index].value += header.value;
            }
        } else {
            dest.push({
                name: header.name,
                value: header.value
            });
            indexMap[angular.lowercase(header.name)] = dest.length - 1;
        }
    });
};

function modifyRequestHeaderHandler_(details) {
    currentProfile = loadSelectedProfile_();
    if (currentProfile && passFilters_(details.url, details.type, currentProfile.filters)) {
        modifyHeader(currentProfile.headers, details.requestHeaders);
    }
    return {
        requestHeaders: details.requestHeaders
    };
};

chrome.webRequest.onBeforeSendHeaders.addListener(
    modifyRequestHeaderHandler_, {
        urls: []
    }, ['requestHeaders', 'blocking']
);