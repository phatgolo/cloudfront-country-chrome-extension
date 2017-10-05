class Countries {
    constructor() {
        this._apiUrl = 'https://restcountries.eu/rest/v2/all';
        this._countries = [];
        this.load();
    }

    async load() {
        let countries = JSON.parse(localStorage.getItem('countries'));
        if (!countries) {
            const response = await fetch(this._apiUrl);
            countries = await response.json();
            localStorage.setItem('countries', JSON.stringify(countries));
        }

        this._countries = countries;
    }

    getByCode(countryCode) {
        return this._countries.find(country => country.alpha2Code === countryCode);
    }

    search(phrase) {
        return this._countries.filter(country => this.filter(country, phrase));
    }

    filter(country, phrase) {
        return this.includes(country.name, phrase)
            || this.includes(country.capital, phrase)
            || this.includes(country.nativeName, phrase)
            || this.includes(country.region, phrase)
            || country.altSpellings.find(spelling => this.includes(spelling, phrase));
    }

    includes(prop, phrase) {
        return prop.toLowerCase().includes(phrase.toLowerCase());
    }
}