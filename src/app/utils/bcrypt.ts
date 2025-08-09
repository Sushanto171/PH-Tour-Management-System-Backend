import bcrypt from "bcryptjs";

export const generateHashedPassword = async (
  plainPassword: string,
  saltRound: string | number
) => {
  const hashedPassword = await bcrypt.hash(plainPassword, Number(saltRound));
  return hashedPassword;
};
