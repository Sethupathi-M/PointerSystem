import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Note: Install dependencies: npm install jsonwebtoken @types/jsonwebtoken
// Add to .env: JWT_SECRET=your-super-secret-jwt-key-here

// Hardcoded users for demo (replace with database lookup in production)
const USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In production, use bcrypt hash
    name: "Demo User",
    description: "A sample user account",
    requiredPoints: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  success: true;
  message: string;
}

interface ApiError {
  success: false;
  error: string;
}

type ApiResponse = LoginSuccessResponse | ApiError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user (in production, query database)
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate proper JWT token
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "fallback-secret",
      {
        algorithm: "HS256",
      }
    );

    // Set httpOnly, secure JWT cookie
    res.setHeader("Set-Cookie", [
      `authToken=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    ]);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
