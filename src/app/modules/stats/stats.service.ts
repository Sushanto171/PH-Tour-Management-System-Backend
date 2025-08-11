import { Booking } from "../booking/booking.mode";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const today = new Date();
const sevenDaysAgo = new Date(today).setDate(today.getDate() - 7);
const thirtyDaysAgo = new Date(today).setDate(today.getDate() - 30);

const getUserStats = async () => {
  const totalPromise = User.countDocuments();
  const totalActivePromise = User.countDocuments({ isActive: IsActive.ACTIVE });
  const totalInActivePromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const newUserInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUserInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const roleByUsersCountPromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    total,
    totalActive,
    totalInActive,
    totalBlocked,
    newUserInLast7Days,
    newUserInLast30Days,
    roleByUsersCount,
  ] = await Promise.all([
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
};

const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();
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

  const tourTypesPromise = Tour.aggregate([
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

  const averageTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgTourCost: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
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

  const totalHighestBookingTourPromise = Booking.aggregate([
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

  const [
    totalTour,
    tourTypes,
    averageTourCost,
    totalTourByDivision,
    totalHighestBookingTour,
  ] = await Promise.all([
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
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();
  const bookingPerTourPromise = Booking.aggregate([
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
  const avgGuestPerBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgGuest: { $avg: "$guestCount" },
      },
    },
  ]);
  const booking7DaysAgoPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const booking30DaysAgoPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const bookingByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalUniqueUserPerBookingPromise = Booking.distinct("user").then(
    (user) => user.length
  );

  const [
    totalBooking,
    bookingPerTour,
    avgGuestPerBooking,
    booking7DaysAgo,
    booking30DaysAgo,
    bookingByStatus,
    totalUniqueUserPerBooking,
  ] = await Promise.all([
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
};
const getPaymentStats = async () => {
  const totalPaymentsPromise = Payment.countDocuments();

  const totalPaymentByPaidStatusPromise = Payment.aggregate([
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

  const totalPaymentByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTotalPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgTotalAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "unKnown"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByPaidStatus,
    totalPaymentByStatus,
    avgTotalPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
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
};

export const statsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
