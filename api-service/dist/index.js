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
exports.REDIS_URL = exports.MONGO_URI = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const messageController_1 = require("./controllers/messageController");
dotenv_1.default.config();
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/email_system';
exports.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/messages', messageController_1.createMessage);
app.get('/messages', messageController_1.getMessages);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(exports.MONGO_URI);
            console.log('Connected to MongoDB');
            app.listen(PORT, () => console.log(`API Service running on port ${PORT}`));
        }
        catch (error) {
            console.error('Failed to start API service:', error);
            process.exit(1);
        }
    });
}
start();
