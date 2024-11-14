import fetch from "node-fetch";
import express from "express";
import { createClient } from "@supabase/supabase-js";
const app = express();
const port = 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);

// Define your city coordinates
const city = {
    name: "delhi-dwarka",
    lat: 28.597564488447873, // latitude
    lon: 77.05655435814133, // longitude
};

app.post("/aqi", async (req, res) => {
    try {
        const aqiData = await fetchAQIData(city);
        const { error } = await supabase.from("aqi_logs").insert([
            {
                aqi: aqi,
            },
        ]);

        if (error) {
            console.error("Error logging AQI:", error);
            return res.status(500).json({ error: "Failed to log AQI data" });
        } else {
            console.log(`Successfully logged AQI for ${city.name}`);
            return res
                .status(200)
                .json({ message: "AQI data logged successfully" });
        }
    } catch (error) {
        console.error("Error in /aqi endpoint:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

async function logAQI() {
    try {
        const aqiData = await fetchAQIData();
        const { error } = await supabase.from("aqi_logs").insert([aqiData]);

        if (error) {
            console.error("Error logging AQI:", error);
        } else {
            console.log(`Successfully logged AQI for ${city.name}`);
        }
    } catch (error) {
        console.error("Error in logAQI:", error);
    }
}

// // Run the logger
// logAQI().then(() => process.exit(0)).catch(error => {
//     console.error('Fatal error:', error);
//     process.exit(1);
// });

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });
