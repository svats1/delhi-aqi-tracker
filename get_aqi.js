import { fetchAQIData } from "./fetch_aqi_data.js";
import express from "express";
const app = express();
const port = 3000;

// Define your city coordinates
const city = {
    name: "delhi-dwarka",
    lat: 28.59756, // latitude
    lon: 77.05655, // longitude
};

// Define your API key
app.get("/", async (req, res) => {
    // const { lat, lon } = req.query;
    const { lat, lon } = city;
    if (!lat || !lon) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude are required" });
    }
    const data = await fetchAQIData(city);
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
