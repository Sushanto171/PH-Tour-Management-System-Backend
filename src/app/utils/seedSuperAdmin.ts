/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IAuthsProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateHashedPassword } from "./bcrypt";

export const createSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      return;
    }

    const hashedPassword = await generateHashedPassword(
      envVars.SUPER_ADMIN_PASSWORD,
      envVars.BCRYPT_SALT_ROUND_ROUND
    );

    const authProvider: IAuthsProvider = {
      provider: "credential",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
