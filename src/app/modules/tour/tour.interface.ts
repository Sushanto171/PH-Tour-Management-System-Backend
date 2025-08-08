import { Types } from "mongoose";

export interface ITour {
  title: string;
  slug: string;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  departureLocation: string;
  arrivalLocation: string;
  deleteImages?: string[];
}

export interface ITourType {
  name: string;
}
