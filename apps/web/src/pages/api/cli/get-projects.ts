import { NextApiHandler } from "next";
import { prisma } from "../../../server/db";
import { verifyCliJwt } from "../../../utils/verify-cli-jwt";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId = verifyCliJwt(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const projects = await prisma.project.findMany({
    where: { team: { members: { some: { id: userId } } } },
    select: {
      team: { select: { id: true, name: true } },
      id: true,
      name: true,
    },
  });

  return res.status(200).json({ projects });
};

export default handler;
