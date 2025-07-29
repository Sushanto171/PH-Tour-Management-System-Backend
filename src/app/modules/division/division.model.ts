import { model, Schema } from "mongoose";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    thumbnail: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

divisionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = Object.values(this.getQuery())[0];
    await Tour.deleteMany({ division: query });
    next();
  } catch (error) {
    throw new Error(error as string);
  }
});

export const Division = model<IDivision>("Division", divisionSchema);
