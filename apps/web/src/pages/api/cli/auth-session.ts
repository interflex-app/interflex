import { NextApiHandler } from "next";
import { prisma } from "../../../server/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DAYS_IN_FUTURE = (days: number) =>
  new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    });

    const { success } = await ratelimit.limit("cli-auth-session");

    if (!success) {
      return res.status(429).json({ session: null });
    }

    const session = await prisma.cliSession.create({
      data: { expiresAt: DAYS_IN_FUTURE(90) },
      select: { id: true, expiresAt: true },
    });

    return res.status(200).json({ session });
  } else if (req.method === "GET") {
    if (!req.query.sessionId) {
      return res.status(400).json({ session: null });
    }

    const session = await prisma.cliSession.findUnique({
      where: { id: req.query.sessionId.toString() ?? "" },
      select: { id: true, token: true, expiresAt: true },
    });

    if (!session) {
      return res.status(404).json({ session: null });
    }

    return res.status(200).json({ session });
  }

  return res.status(405).json({ error: "Method not allowed." });
};

export default handler;
