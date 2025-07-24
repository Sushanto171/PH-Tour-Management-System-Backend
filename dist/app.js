"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_1 = require("./app/routes/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/", index_1.router);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to PH Tour Management System" });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: `Something went wrong: ${err.message} `,
        err,
        stack: err.stack,
    });
});
exports.default = app;
