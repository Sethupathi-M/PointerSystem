import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

interface ApiResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Clear the auth cookie
    res.setHeader(
      "Set-Cookie",
      serialize("authToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0, // Immediately expire
        sameSite: "strict",
      })
    );

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
