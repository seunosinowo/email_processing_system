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
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQueue = exports.QUEUE_NAME = void 0;
exports.addMessageJob = addMessageJob;
const bullmq_1 = require("bullmq");
const index_1 = require("../index");
exports.QUEUE_NAME = 'message-queue';
exports.messageQueue = new bullmq_1.Queue(exports.QUEUE_NAME, {
    connection: {
        host: new URL(index_1.REDIS_URL).hostname,
        port: parseInt(new URL(index_1.REDIS_URL).port)
    }
});
function addMessageJob(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.messageQueue.add('process-message', { messageId }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });
    });
}
