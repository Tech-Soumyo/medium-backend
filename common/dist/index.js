"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.creatPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.signupInput = zod_1.default.object({
    email: zod_1.default
        .string()
        .email("Please enter a valid email address")
        .refine((val) => emailRegex.test(val), {
        message: "Email must match the pattern: example@domain.com",
    }),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    name: zod_1.default.string().optional(),
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.creatPostInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
});
exports.updatePostInput = zod_1.default.object({
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional(),
    id: zod_1.default.string(),
});
