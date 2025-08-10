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

  const [
    total,
    totalActive,
    totalInActive,
    totalBlocked,
    newUserInLast7Days,
    newUserInLast30Days,
  ] = await Promise.all([
    totalPromise,
    totalActivePromise,
    totalInActivePromise,
    totalBlockedPromise,
    newUserInLast7DaysPromise,
    newUserInLast30DaysPromise,
  ]);
  return {
    total,
    totalActive,
    totalInActive,
    totalBlocked,
    newUserInLast7Days,
    newUserInLast30Days,
  };
};
const getTourStats = async () => {
  return {};
};
const getBookingStats = async () => {
  return {};
};
const getPaymentStats = async () => {
  return {};
};

export const statsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
