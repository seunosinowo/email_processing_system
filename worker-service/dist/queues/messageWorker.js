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
exports.startWorker = startWorker;
const bullmq_1 = require("bullmq");
const Message_1 = __importDefault(require("../models/Message"));
const QUEUE_NAME = 'message-queue';
function startWorker(redisUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const worker = new bullmq_1.Worker(QUEUE_NAME, (job) => __awaiter(this, void 0, void 0, function* () {
            const { messageId } = job.data;
            try {
                const message = yield Message_1.default.findById(messageId);
                if (!message) {
                    throw new Error(`Message with ID ${messageId} not found`);
                }
                console.log(`Sending message to ${message.email}: ${message.message}`);
            }
            catch (error) {
                console.error(`Failed to process job ${job.id}:`, error);
                throw error;
            }
        }), {
            connection: {
                host: new URL(redisUrl).hostname,
                port: parseInt(new URL(redisUrl).port)
            }
        });
        worker.on('completed', (job) => {
            console.log(`Job ${job.id} completed`);
        });
        worker.on('failed', (job, err) => {
            console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed: ${err.message}`);
        });
        return worker;
    });
}
