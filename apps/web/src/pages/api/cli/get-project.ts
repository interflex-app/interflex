import { NextApiHandler } from "next";
import { prisma } from "../../../server/db";
import { verifyCliJwt } from "../../../utils/verify-cli-jwt";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userId = verifyCliJwt(req, res);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const projectId = req.query.projectId?.toString() ?? "";

  if (!projectId) {
    return res.status(400).json({ project: null });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      languages: true,
    },
  });

  return res.status(200).json({ project });
};

export default handler;
