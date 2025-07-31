import httpStatus from "http-status-codes";
import { AppError } from "../errorHelpers/AppError";
import { IDivision } from "../modules/division/division.interface";
import { Division } from "../modules/division/division.model";

export const checkDivision = async (
  id: string,
  payload: Partial<IDivision>
) => {
  if (payload.name) {
    const isDivisionNameExist = await Division.findOne({
      name: payload.name,
      // { $regex: payload.name, $options: "i" },
      ...(id && { _id: { $ne: id } }),
    });
    if (isDivisionNameExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        `"${payload.name}" division is already exist in database.`
      );
    }
  }
};
