import { Identity } from "@/generated/prisma";
import { createContext, useContext } from "react";

export const IdentityContext = createContext<Identity>({
  id: "",
  name: "",
  description: "",
  requiredPoints: 0,
  isActive: false,
  createdAt: new Date(),
});

export const useIdentityContext = () => {
  return useContext(IdentityContext);
};
