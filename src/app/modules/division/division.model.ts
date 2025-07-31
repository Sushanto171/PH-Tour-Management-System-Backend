import { model, Schema } from "mongoose";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
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

divisionSchema.pre("save", async function (next) {
  try {
    if (this.isModified("name")) {
      const baseSlug = this.name.toLowerCase().split(" ").join("-");
      let slug = `${baseSlug}-division`;
      let counter = 0;
      while (await Division.exists({ slug })) {
        slug = `${baseSlug}-${counter++}-division`;
      }
      this.slug = slug;
    }
    next();
  } catch (error) {
    throw new Error(error as string);
  }
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const division = this.getUpdate() as Partial<IDivision>;
    if (division.name) {
      const baseSlug = division.name.toLowerCase().split(" ").join("-");
      let slug = `${baseSlug}-division`;
      let counter = 0;
      while (await Division.exists({ slug })) {
        slug = `${baseSlug}-${counter++}-division`;
      }
      division.slug = slug;
      this.setUpdate(division);
    }
    next();
  } catch (error) {
    next(error as Error)
  }
});

export const Division = model<IDivision>("Division", divisionSchema);
