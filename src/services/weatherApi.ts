import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
    throw new Error('Weather API key is not configured. Please add VITE_WEATHER_API_KEY to your environment variables.');
}

export interface WeatherResponse {
    main: {
        temp: number;
    };
    weather: Array<{
        main: string;
        description: string;
    }>;
    name: string;
}

export const getCurrentWeather = async (city: string = 'New Delhi'): Promise<WeatherResponse> => {
    try {
        console.log('Fetching weather with API key:', API_KEY); // Debug log

        const response = await axios.get<WeatherResponse>(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric', // For Celsius
            },
        });

        if (!response.data) {
            throw new Error('No data received from weather API');
        }

        console.log('Weather API response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            } else if (error.response?.status === 404) {
                throw new Error('City not found. Please check the city name.');
            } else {
                throw new Error(`Weather API error: ${error.response?.data?.message || error.message}`);
            }
        }
        throw new Error('Failed to fetch weather data');
    }
}; 