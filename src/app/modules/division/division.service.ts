import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const isSlugExist = await Division.findOne({ slug: payload.slug });
  if (isSlugExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This "${payload.slug}" slug already exist in database.`
    );
  }
  const isDivisionNameExist = await Division.findOne({ name: payload.name });
  if (isDivisionNameExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `"${payload.name}" division is already exist in database.`
    );
  }

  const division = await Division.create(payload);
  return division;
};

export const divisionService = {
  createDivision,
};
