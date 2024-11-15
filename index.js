import fetch from "node-fetch";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { fetchAQIData } from "./fetch_aqi_data.js";

// Express setup
const app = express();
const port = 3000;
app.use(express.json());

// Supabase setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);

// Define your city coordinates
const city = {
    name: "delhi-dwarka",
    lat: 28.59756, // latitude
    lon: 77.05655, // longitude
};

// async function logAQI() {
//     try {
//         const aqiData = await fetchAQIData(city);
//         const { data, error } = await supabase
//             .from("aqi_logs")
//             .insert([aqiData]);

//         if (error) {
//             console.error("Error logging AQI:", error);
//         } else {
//             console.log(`Successfully logged AQI for ${city.name}`);
//         }
//     } catch (error) {
//         console.error("Error in logAQI:", error);
//     }
// }

// Basic test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Server is running' });
});

// Test insert endpoint (we know this works)
app.post('/test-insert', async (req, res) => {
    try {
        const testData = {
            city: 'Delhi',
            latitude: 28.6139,
            longitude: 77.2090,
            aqi: 1
        };

        const { data, error } = await supabase
            .from('aqi_logs')
            .insert([testData])
            .select();

        if (error) {
            console.error('Insert error:', error);
            return res.status(500).json({ error });
        }

        return res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// AQI endpoint
app.post('/aqi', async (req, res) => {
    try {
        console.log('1. AQI endpoint hit');

        // Get weather data
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
        const response = await fetch(url);
        const weatherData = await response.json();
        console.log('2. Weather data received:', weatherData);

        // Format data for insertion
        const aqiData = {
            city: city.name,
            latitude: city.lat,
            longitude: city.lon,
            aqi: weatherData.list[0].main.aqi
        };
        console.log('3. Formatted AQI data:', aqiData);

        // Insert into Supabase
        const { data, error } = await supabase
            .from('aqi_logs')
            .insert([aqiData])
            .select();

        if (error) {
            console.error('4. Insert error:', error);
            return res.status(500).json({
                status: 'error',
                error: error.message
            });
        }

        console.log('5. Successfully inserted AQI data');
        return res.json({
            status: 'success',
            weather_data: weatherData,
            inserted_data: data
        });

    } catch (error) {
        console.error('Error in /aqi endpoint:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});

// // Run the logger
// logAQI().then(() => process.exit(0)).catch(error => {
//     console.error('Fatal error:', error);
//     process.exit(1);
// });

// Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
