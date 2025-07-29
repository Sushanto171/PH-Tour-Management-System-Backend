import { model, Schema } from "mongoose";
import { ITour, TTourType } from "./tour.interface";

const tourTypeSchema = new Schema<TTourType>({
  name: { type: String, required: true, unique: true },
});

export const TourType = model<TTourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [{ type: String }], default: [] },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType" },
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    costFrom: { type: Number },
    tourPlan: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tour = model<ITour>("Tour", tourSchema);
