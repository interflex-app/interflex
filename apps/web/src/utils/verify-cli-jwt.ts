import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export const verifyCliJwt = (req: NextApiRequest) => {
  const jwtToken = req.headers.authorization?.toString().replace("Bearer ", "");

  if (!jwtToken) {
    return null;
  }

  let userId: string;

  try {
    const tokenData = jwt.decode(jwtToken) as { userId?: string };

    if (!tokenData?.userId) {
      return null;
    }

    userId = tokenData.userId;
  } catch (e) {
    return null;
  }

  return userId;
};
