import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateJwtToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const accessToken = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
  return accessToken;
};

export const verifyJwtToken = (token: string, secret: string) => {
  const verify = jwt.verify(token, secret);
  return verify;
};
