import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// Note: Install cookie package: npm install cookie @types/cookie

// Hardcoded users for demo (replace with database lookup in production)
const USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
    description: "A sample user account",
    requiredPoints: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    description: string;
    requiredPoints: number;
    isActive: boolean;
    createdAt: string;
  };
}

interface AuthError {
  error: string;
}

type ApiResponse = UserResponse | AuthError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get auth token from httpOnly cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: "No authentication token" });
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || "fallback-secret";
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch {
      // Clear invalid token
      res.setHeader(
        "Set-Cookie",
        serialize("authToken", "", {
          httpOnly: true,
          path: "/",
          maxAge: 0,
          sameSite: "strict",
        })
      );
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Find user by decoded userId (in production, query database)
    const user = USERS.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      description: user.description,
      requiredPoints: user.requiredPoints,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    res.status(200).json({ user: responseUser });
  } catch (error) {
    console.error("Auth me API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
