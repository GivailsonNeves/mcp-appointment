"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const apiClient = axios_1.default.create({
    baseURL: "http://localhost:3000/api",
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});
exports.apiClient = apiClient;
