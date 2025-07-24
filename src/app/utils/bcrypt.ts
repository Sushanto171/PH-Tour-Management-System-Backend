import bcrypt from "bcryptjs";

export const generateHashedPassword = async (
  password: string,
  saltRound: string | number
) => {
  const hashedPassword = await bcrypt.hash(password, Number(saltRound));
  return hashedPassword;
};
