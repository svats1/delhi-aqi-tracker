// Define your city coordinates
const city = {
    name: "delhi-dwarka",
    lat: 28.59756, // latitude
    lon: 77.05655, // longitude
};

async function fetchAQIData(city) {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        throw error;
    }
}

// const aqiData = await fetchAQIData(city);
// console.log(aqiData);

export { fetchAQIData };
