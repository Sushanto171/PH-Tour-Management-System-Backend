"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = 5000;
let server;
const serverStart = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://AiScholar:ivVHWFoz5w7DXhoZ@cluster0.0zizn.mongodb.net/ph-tour-management-system?retryWrites=true&w=majority&appName=Cluster0");
        console.log("🏪 Mongodb Connection stablish");
        server = app_1.default.listen(port, () => {
            console.log(`🔥Server running: http://localhost:${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
serverStart();
// unhandled Rejection error
process.on("unhandledRejection", () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// uncaught error
process.on("uncaughtException", () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
const name = 18;
