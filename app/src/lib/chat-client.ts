import axios from "axios";

const chatClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { chatClient };
