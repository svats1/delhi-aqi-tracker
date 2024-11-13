const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Define your city coordinates
const CITY = {
    name: 'Your City',
    lat: 00.0000,  // Replace with your city's latitude
    lon: 00.0000   // Replace with your city's longitude
};

async function fetchAQIData() {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CITY.lat}&lon=${CITY.lon}&appid=${process.env.OPENWEATHER_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            city: CITY.name,
            latitude: CITY.lat,
            longitude: CITY.lon,
            aqi: data.list[0].main.aqi  // OpenWeather returns AQI on a scale of 1-5
        };
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        throw error;
    }
}

async function logAQI() {
    try {
        const aqiData = await fetchAQIData();
        const { error } = await supabase
            .from('aqi_logs')
            .insert([aqiData]);

        if (error) {
            console.error('Error logging AQI:', error);
        } else {
            console.log(`Successfully logged AQI for ${CITY.name}`);
        }
    } catch (error) {
        console.error('Error in logAQI:', error);
    }
}

// Run the logger
logAQI().then(() => process.exit(0)).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});