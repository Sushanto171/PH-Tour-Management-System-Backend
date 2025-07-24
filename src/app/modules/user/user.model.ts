import { model, Schema, Types } from "mongoose";
import { IAuthsProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthsProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    picture: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    bookings: [{ type: Types.ObjectId }],
    guides: [{ type: Types.ObjectId }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
