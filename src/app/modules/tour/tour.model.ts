import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    images: { type: [{ type: String }], default: [] },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
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
    departureLocation: { type: String },
    arrivalLocation: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tourSchema.pre("save", async function (next) {
  try {
    if (this.isModified("title")) {
      const baseSlug = this.title?.toLowerCase().split(" ").join("-");
      let slug = `${baseSlug}`;
      let counter = 0;
      while (await Tour.exists({ slug })) {
        slug = `${baseSlug}-tour-${counter++}`;
      }
      this.slug = slug;
    }
    next();
  } catch (error) {
    throw new Error(error as string);
  }
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const tour = this.getUpdate() as Partial<ITour>;
    if (tour.title) {
      const baseSlug = tour.title?.toLowerCase().split(" ").join("-");
      let slug = `${baseSlug}`;
      let counter = 0;
      while (await Tour.exists({ slug })) {
        slug = `${baseSlug}-tour-${counter++}`;
      }
      tour.slug = slug;
      this.setUpdate(tour);
    }
    next();
  } catch (error) {
    throw new Error(error as string);
  }
});

export const Tour = model<ITour>("Tour", tourSchema);
