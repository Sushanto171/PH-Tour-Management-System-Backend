import httpStatus from "http-status-codes";
import { AppError } from "../errorHelpers/AppError";
import { IDivision } from "../modules/division/division.interface";
import { Division } from "../modules/division/division.model";

export const checkDivision = async (payload: Partial<IDivision>) => {
  if (payload.slug) {
    const isSlugExist = await Division.findOne({
      slug: { $regex: payload.slug, $options: "i" },
    });
    if (isSlugExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        `This "${payload.slug}" slug already exist in database.`
      );
    }
  }
  if (payload.name) {
    const isDivisionNameExist = await Division.findOne({
      name: { $regex: payload.name, $options: "i" },
    });
    if (isDivisionNameExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        `"${payload.name}" division is already exist in database.`
      );
    }
  }
};
