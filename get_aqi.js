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

        return res.json(data);

        // return res.json({
        //     latitude: lat,
        //     longitude: lon,
        //     aqi: data.list[0].main.aqi
        // });
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        return res.status(500).json({ error: "Error fetching AQI data" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
