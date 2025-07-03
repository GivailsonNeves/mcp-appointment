import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     return new Promise(async (resolve) => {
//       const session = await fetchAuthSession();

//       if (session) {
//         config.headers.Authorization = `Bearer ${session.tokens?.idToken?.toString()}`;
//       }

//       return resolve(config);
//     });
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export { apiClient };
