import { Request } from "express";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({ name, email });
  return user;
};

const getUserByEmail = async (req: Request) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  return user;
};

const updateUser = async (req: Request) => {
  const email = req.params.email;
  const data = req.body;
  const user = await User.findOneAndUpdate({ email }, data, {
    new: true,
    runValidators: true,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const total = await User.countDocuments();

  const data = {
    users,
    totalUsers: { total },
  };
  return data;
};

export const userService = {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
};
