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
exports.getMessages = exports.createMessage = void 0;
const zod_1 = require("zod");
const Message_1 = __importDefault(require("../models/Message"));
const messageQueue_1 = require("../queues/messageQueue");
const messageSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    message: zod_1.z.string().min(1, 'Message cannot be empty')
});
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = messageSchema.parse(req.body);
        const message = new Message_1.default(validatedData);
        yield message.save();
        yield (0, messageQueue_1.addMessageJob)(message._id.toString());
        res.status(201).json({ message: 'Message queued successfully', id: message._id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createMessage = createMessage;
const getMessages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMessages = getMessages;
