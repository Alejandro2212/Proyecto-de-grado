import axios from "axios";

console.log(
  "API URL:",
  "http://192.168.100.231:8080/api"
);

const api = axios.create({

    baseURL: "http://192.168.100.231:8080/api"
});

// =========================
// INTERCEPTOR JWT
// =========================
api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);

export default api;