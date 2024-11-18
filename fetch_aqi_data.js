async function fetchAQIData(city) {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            city: city.name,
            latitude: city.lat,
            longitude: city.lon,
            aqi: data.list[0].main.aqi,
        };
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        throw error;
    }
}

export { fetchAQIData };
