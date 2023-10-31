import {
  REQUIRED_INFO_MESSAGE,
  CONFLICT_USER_MESSAGE,
  SALT_ROUNDS,
  USER_CREATED_MESSAGE,
  HTTP,
} from "../../constants/index.js";
import bcrypt from "bcrypt";
import { db } from "../utils/db.server.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(HTTP.BAD_REQUEST)
      .json({ message: REQUIRED_INFO_MESSAGE });
  // check for duplicate usernames in the db
  const duplicate = await db.customer.findUnique({
    where: {
      username,
    },
  });

  if (duplicate)
    return res.status(HTTP.CONFLICT).json({ message: CONFLICT_USER_MESSAGE }); //Conflict

  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    //store the new username
    const newUser = { username: username, hashPassword: hashedPassword };

    await db.customer.create({ data: newUser });

    res.status(HTTP.CREATED).json({ success: USER_CREATED_MESSAGE(username) });
  } catch (err) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
