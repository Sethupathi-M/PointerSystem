// pages/api/identities.ts
import { identityService } from "@/lib/services/identityService";
import type { NextApiRequest, NextApiResponse } from "next";
// import { identityService } from "@/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query;

  try {
    // If ID is provided → act on single record
    if (id && typeof id === "string") {
      switch (req.method) {
        case "GET":
          res.status(200).json(await identityService.getIdentityById(id));
          return;
        case "PUT":
          res
            .status(200)
            .json(await identityService.updateIdentity(id, req.body));
          return;
        case "DELETE":
          res.status(200).json(await identityService.deleteIdentity(id));
          return;
        default:
          res.status(405).json({ error: `Method ${req.method} not allowed` });
          return;
      }
    }

    // Otherwise → act on collection
    switch (req.method) {
      case "GET":
        res.status(200).json(await identityService.getAllIdentities());
        return;
      case "POST":
        res.status(201).json(await identityService.createIdentity(req.body));
        return;
      default:
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }
  } catch (err: unknown) {
    console.error("Identity API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
