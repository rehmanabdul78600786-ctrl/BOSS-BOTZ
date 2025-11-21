const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a city",
    react: "🌤",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("❗ Please provide a city name.\n📌 Usage: .weather [city name]");
        }

        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; // OpenWeatherMap API Key
        const city = q.trim();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        // Extract weather info
        const name = data.name;
        const country = data.sys.country;
        const temp = data.main.temp;
        const feels_like = data.main.feels_like;
        const temp_min = data.main.temp_min;
        const temp_max = data.main.temp_max;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.wind.speed;
        const weatherMain = data.weather[0].main;
        const weatherDesc = data.weather[0].description;
        const weatherIcon = data.weather[0].icon;

        // Weather emoji mapping (optional)
        const weatherEmoji = {
            Clear: "☀️",
            Clouds: "☁️",
            Rain: "🌧️",
            Drizzle: "🌦️",
            Thunderstorm: "⛈️",
            Snow: "❄️",
            Mist: "🌫️",
            Smoke: "💨",
            Haze: "🌫️",
            Dust: "🌪️",
            Fog: "🌫️",
            Sand: "🏜️",
            Ash: "🌋",
            Squall: "🌬️",
            Tornado: "🌪️"
        };

        const emoji = weatherEmoji[weatherMain] || "";

        const weatherMessage = `
🌍 *Weather Information for ${name}, ${country}* ${emoji}

🌡️ *Temperature:* ${temp}°C
🌡️ *Feels Like:* ${feels_like}°C
🌡️ *Min Temp:* ${temp_min}°C
🌡️ *Max Temp:* ${temp_max}°C
💧 *Humidity:* ${humidity}%
🔽 *Pressure:* ${pressure} hPa
💨 *Wind Speed:* ${windSpeed} m/s
☁️ *Weather:* ${weatherMain}
🌫️ *Description:* ${weatherDesc}

💡 *Requested by: ${m.pushName || "Unknown"}*
`;

        return reply(weatherMessage);

    } catch (error) {
        console.error("Weather Command Error:", error);

        if (error.response && error.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED') {
            return reply("⚠️ Network error. Please try again later.");
        } else {
            return reply("⚠️ An unexpected error occurred while fetching the weather.");
        }
    }
});
