import fetch from "node-fetch";
import express from "express";
const app = express();
const port = 3000;

// Define your city coordinates
const CITY = {
    name: "delhi-dwarka",
    lat: 28.597564488447873, // latitude
    lon: 77.05655435814133, // longitude
};

// Define your API key
app.get("/", async (req, res) => {
    // const { lat, lon } = req.query;
    const { lat, lon } = CITY;
    if (!lat || !lon) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude are required" });
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        return res.json({
            location: CITY.name,
            latitude: lat,
            longitude: lon,
            time: data.list[0].dt,            
            aqi: data.list[0].main.aqi,
            co: data.list[0].components.co,
            no: data.list[0].components.no,
            no2: data.list[0].components.no2,
            o3: data.list[0].components.o3,
            so2: data.list[0].components.so2,
            pm2_5: data.list[0].components.pm2_5,
            pm10: data.list[0].components.pm10,
            nh3: data.list[0].components.nh3,
        });
    
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        return res.status(500).json({ error: "Error fetching AQI data" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_KEY
// );

// async function fetchAQIData() {
//     const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CITY.lat}&lon=${CITY.lon}&appid=${process.env.OPENWEATHER_API_KEY}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         return {
//             city: CITY.name,
//             latitude: CITY.lat,
//             longitude: CITY.lon,
//             aqi: data.list[0].main.aqi  // OpenWeather returns AQI on a scale of 1-5
//         };
//     } catch (error) {
//         console.error('Error fetching AQI data:', error);
//         throw error;
//     }
// }

// async function logAQI() {
//     try {
//         const aqiData = await fetchAQIData();
//         const { error } = await supabase
//             .from('aqi_logs')
//             .insert([aqiData]);

//         if (error) {
//             console.error('Error logging AQI:', error);
//         } else {
//             console.log(`Successfully logged AQI for ${CITY.name}`);
//         }
//     } catch (error) {
//         console.error('Error in logAQI:', error);
//     }
// }

// // Run the logger
// logAQI().then(() => process.exit(0)).catch(error => {
//     console.error('Fatal error:', error);
//     process.exit(1);
// });
