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

// AQI endpoint
app.post("/aqi", async (req, res) => {
    try {
        // Get weather data
        const weatherData = await fetchAQIData(city);

        // Insert into Supabase
        const { data, error } = await supabase
            .from("aqi_logs")
            .insert([weatherData])
            .select();

        console.log("Inserted data:", data);

        if (error) {
            return res.status(500).json({
                status: "error",
                error: error.message,
            });
        }
        return res.json({
            status: "success",
            weather_data: weatherData,
            inserted_data: data,
        });
    } catch (error) {
        console.error("Error in /aqi endpoint:", error);
        return res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
});

app.get("/", async (req, res) => {
    try {
        const aqiData = await fetchAQIData(city);
        const { data, error } = await supabase
            .from("aqi_logs")
            .insert([aqiData]);

        if (error) {
            console.error("Error logging AQI:", error);
            res.status(500).json({
                status: "error",
                error: error.message,
            });
        } else {
            console.log(`Successfully logged AQI for ${city.name}`);
            res.json({
                status: "success",
                message: `Successfully logged AQI for ${city.name}`,
                data: aqiData
            });
        }
    } catch (error) {
        console.error("Error in logAQI:", error);
        res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
});


// logAQI(city);

// // Run the logger
// logAQI().then(() => process.exit(0)).catch(error => {
//     console.error('Fatal error:', error);
//     process.exit(1);
// });

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
