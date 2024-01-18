const ID_LIST = [
    'active-cases',
    'new-cases',
    'recovered-cases',
    'total-cases',
    'total-deaths',
    'total-tests',
];
const myBody = document.querySelector('body');
myBody.addEventListener('load', firstLoad());

const myForm = document.querySelector('form');
myForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Validate country
    const country = document.getElementById('input-country').value;
    const queryParams = validateCountry(country);

    // GET Covid Data
    getCovidData(queryParams)
})

function validateNumber(value) {
    return parseInt(value) ? parseInt(value) : 0;
}

function validateCountry(country) {
    let queryParams = '?country=';
    if (!country) {
        country = 'Indonesia'
        queryParams += 'Indonesia';
    } else {
        queryParams += country;
    };

    return queryParams;
};

function firstLoad() {
    const queryParams = validateCountry();
    getCovidData(queryParams);
};

async function getCovidData(queryParams) {
    try {
        let url = 'https://covid-193.p.rapidapi.com/statistics';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '',
                'X-RapidAPI-Host': ''
            }
        };

        // Validate Query Params
        if (!queryParams) {
            queryParams += 'Indonesia';
            url += queryParams;
        } else {
            url += queryParams;
        };

        // GET Data
        const rawResponse = await fetch(url, options);
        const parsedResponse = await rawResponse.json();
        if (parsedResponse.response.length === 0) {
            alert('Country not found')
        } else {
            const responseData = parsedResponse.response[0];
            const { cases, deaths, tests } = responseData;
            const covidData = {
                "active-cases": validateNumber(cases.active),
                "new-cases": validateNumber(cases.new),
                "recovered-cases": validateNumber(cases.recovered),
                "total-cases": validateNumber(cases.total),
                "total-deaths": validateNumber(deaths.total),
                "total-tests": validateNumber(tests.total)
            };

            ID_LIST.forEach((id) => {
                document.getElementById(id).innerHTML = covidData[id];
            })
        }
    } catch (error) {
        alert(error);
    }
}