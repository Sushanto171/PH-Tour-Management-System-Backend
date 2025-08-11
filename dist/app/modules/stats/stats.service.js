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
exports.statsService = void 0;
const booking_mode_1 = require("../booking/booking.mode");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const today = new Date();
const sevenDaysAgo = new Date(today).setDate(today.getDate() - 7);
const thirtyDaysAgo = new Date(today).setDate(today.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPromise = user_model_1.User.countDocuments();
    const totalActivePromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInActivePromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUserInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUserInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const roleByUsersCountPromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [total, totalActive, totalInActive, totalBlocked, newUserInLast7Days, newUserInLast30Days, roleByUsersCount,] = yield Promise.all([
        totalPromise,
        totalActivePromise,
        totalInActivePromise,
        totalBlockedPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        roleByUsersCountPromise,
    ]);
    return {
        total,
        totalActive,
        totalInActive,
        totalBlocked,
        newUserInLast7Days,
        newUserInLast30Days,
        roleByUsersCount,
    };
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    // await Tour.updateMany(
    //   {
    //     $or: [
    //       { division: { $type: "string" } },
    //       { tourType: { $type: "string" } },
    //     ],
    //   },
    //   [
    //     {
    //       $set: {
    //         division: { $toObjectId: "$division" },
    //         tourType: { $toObjectId: "$tourType" },
    //       },
    //     },
    //   ]
    // );
    const tourTypesPromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type",
            },
        },
        {
            $unwind: "$type",
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const averageTourCostPromise = tour_model_1.Tour.aggregate([
        {
            $group: {
                _id: null,
                avgTourCost: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                foreignField: "_id",
                localField: "division",
                as: "totalDivision",
            },
        },
        {
            $unwind: "$totalDivision",
        },
        {
            $group: {
                _id: "$totalDivision.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalHighestBookingTourPromise = booking_mode_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: "tours",
                foreignField: "_id",
                localField: "_id",
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const [totalTour, tourTypes, averageTourCost, totalTourByDivision, totalHighestBookingTour,] = yield Promise.all([
        totalTourPromise,
        tourTypesPromise,
        averageTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookingTourPromise,
    ]);
    return {
        totalTour,
        tourTypes,
        averageTourCost,
        totalTourByDivision,
        totalHighestBookingTour,
    };
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_mode_1.Booking.countDocuments();
    const bookingPerTourPromise = booking_mode_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 10,
        },
        {
            $lookup: {
                from: "tours",
                foreignField: "_id",
                localField: "_id",
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgGuestPerBookingPromise = booking_mode_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuest: { $avg: "$guestCount" },
            },
        },
    ]);
    const booking7DaysAgoPromise = booking_mode_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const booking30DaysAgoPromise = booking_mode_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const bookingByStatusPromise = booking_mode_1.Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalUniqueUserPerBookingPromise = booking_mode_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, bookingPerTour, avgGuestPerBooking, booking7DaysAgo, booking30DaysAgo, bookingByStatus, totalUniqueUserPerBooking,] = yield Promise.all([
        totalBookingPromise,
        bookingPerTourPromise,
        avgGuestPerBookingPromise,
        booking7DaysAgoPromise,
        booking30DaysAgoPromise,
        bookingByStatusPromise,
        totalUniqueUserPerBookingPromise,
    ]);
    return {
        totalBooking,
        bookingPerTour,
        bookingByStatus,
        avgGuestPerBooking: avgGuestPerBooking[0].avgGuest,
        booking7DaysAgo,
        booking30DaysAgo,
        totalUniqueUserPerBooking,
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentsPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByPaidStatusPromise = payment_model_1.Payment.aggregate([
        {
            $match: { status: "PAID" },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
            },
        },
    ]);
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const avgTotalPaymentAmountPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgTotalAmount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "unKnown"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentByPaidStatus, totalPaymentByStatus, avgTotalPaymentAmount, paymentGatewayData,] = yield Promise.all([
        totalPaymentsPromise,
        totalPaymentByPaidStatusPromise,
        totalPaymentByStatusPromise,
        avgTotalPaymentAmountPromise,
        paymentGatewayDataPromise,
    ]);
    return {
        totalPayment,
        totalPaymentByPaidStatus,
        totalPaymentByStatus,
        avgTotalPaymentAmount,
        paymentGatewayData,
    };
});
exports.statsService = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats,
};
