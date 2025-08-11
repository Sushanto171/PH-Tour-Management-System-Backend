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
exports.transactionRollbackCatchAsync = void 0;
const mongoose_1 = require("mongoose");
const updateDBwithRollbackSessionSslCallback_1 = require("./updateDBwithRollbackSessionSslCallback");
const transactionRollbackCatchAsync = (bookingStatus, paymentStatus, returnMessage) => (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        yield (0, updateDBwithRollbackSessionSslCallback_1.updateDBwithRollbackSessionSslCallback)(query, bookingStatus, paymentStatus, session);
        yield session.commitTransaction();
        return {
            success: true,
            message: returnMessage.message,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        console.log("end.......");
        yield session.endSession();
    }
});
exports.transactionRollbackCatchAsync = transactionRollbackCatchAsync;
