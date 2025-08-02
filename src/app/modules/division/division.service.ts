import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import { checkDivision } from "../../utils/checkDivision";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  await checkDivision("", payload);
  const division = await Division.create(payload);
  return division;
};

const retrieveAllDivision = async (query: Record<string, string>) => {
  // const divisions = await Division.find();
  // const count = await Division.countDocuments();
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const divisionBuilder = queryBuilder.filter().paginate();
  const [divisions, meta] = await Promise.all([
    divisionBuilder.build(),
    divisionBuilder.getMeta(),
  ]);
  return {
    divisions,
    meta,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division does not found.");
  }
  await checkDivision(id, payload);
  const division = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return division;
};

const deleteDivision = async (id: string) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division does not found.");
  }
  const res = await Division.findOneAndDelete({ _id: new Types.ObjectId(id) });
  return res;
};

const getSingleDivision = async (slug: string) => {
  if (!slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division slug is invalid.");
  }
  const division = await Division.findOne({slug});
  return division;
};

export const divisionService = {
  createDivision,
  retrieveAllDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
