import axios from "axios";

const options = {
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

let client = axios.create(options);

client.interceptors.request.use(
  config => {
    const access_token = localStorage.getItem("access_token");
    config.headers.Authorization = access_token ? `Bearer ${access_token}` : "";
    return config;
  },
  error => Promise.reject(error.status)
);

client.interceptors.response.use(
  response => {
    if (response.headers.authorization) {
      localStorage.setItem("access_token", response.headers.authorization);
      response.config.headers["Authorization"] = "Bearer " + response.headers.authorization;
    }

    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location = "/login";
    }

    if(error.response.status === 404) window.location = '/'

    return Promise.reject(error);
  }
);

export default client;
