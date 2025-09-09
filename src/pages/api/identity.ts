// pages/api/identities.ts
import { identityService } from "@/lib/services/identityService";
import type { NextApiRequest, NextApiResponse } from "next";
// import { identityService } from "@/lib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // If ID is provided → act on single record
    if (id && typeof id === "string") {
      switch (req.method) {
        case "GET":
          return res.status(200).json(await identityService.getIdentityById(id));
        case "PUT":
          return res.status(200).json(await identityService.updateIdentity(id, req.body));
        case "DELETE":
          return res.status(200).json(await identityService.deleteIdentity(id));
        default:
          return res.status(405).json({ error: `Method ${req.method} not allowed` });
      }
    }

    // Otherwise → act on collection
    switch (req.method) {
      case "GET":
        return res.status(200).json(await identityService.getAllIdentities());
      case "POST":
        return res.status(201).json(await identityService.createIdentity(req.body));
      default:
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (err: unknown) {
    console.error("Identity API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
