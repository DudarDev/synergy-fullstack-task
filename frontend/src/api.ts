import axios from 'axios';

// Твоя IP адреса з AWS
const API_URL = 'http://98.93.197.254:8000';

export const api = axios.create({
  baseURL: API_URL,
});