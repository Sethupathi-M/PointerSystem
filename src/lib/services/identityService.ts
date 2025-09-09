import { Identity } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";  

export const identityService = {
    getAllIdentities: async () => {
        const identities = await prisma.identity.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                requiredPoints: true,
                isActive: true,
                createdAt: true,
                Task: {
                    where: { isActive: false }, // completed tasks only
                    select: {
                        points: true,
                        pointsType: true,
                    },
                },
                _count: {
                    select: {
                        Task:{
                            where: {
                                isActive: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate totalAcquiredPoints for each identity
        return identities.map(identity => {
            const totalAcquiredPoints = identity.Task.reduce(
                (sum, task) => {
                    return task.pointsType === 'POSITIVE' 
                        ? sum + task.points 
                        : sum - task.points;
                },
                0
            );

            return {
                ...identity,
                totalAcquiredPoints,
            };
        });
    }, 
    getIdentityById: async (id: string) => {
        const result = await prisma.identity.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            description: true,
            requiredPoints: true,
            isActive: true,
            Task: {
              where: { isActive: false }, // completed tasks only
              select: {
                points: true,
                pointsType: true,
              },
            },
          },
        });
      
        if (!result) return null;
      
        const totalAcquiredPoints = result.Task.reduce(
          (sum, task) => {
            // Add positive points, subtract negative points
            return task.pointsType === 'POSITIVE' 
              ? sum + task.points 
              : sum - task.points;
          },
          0
        );
      
        return {
          ...result,
          totalAcquiredPoints,
        };
      },
      
       
    createIdentity: async (identity: Identity) => {
        const newIdentity = await prisma.identity.create({
            data: identity
        });
        return newIdentity;
    }, 
    updateIdentity: async (id: string, identity: Partial<Identity>) => {
        const updatedIdentity = await prisma.identity.update({
            where: { id },
            data: identity
        });
        return updatedIdentity;
    }, 
    deleteIdentity: async (id: string) => {
        const deletedIdentity = await prisma.identity.delete({
            where: { id }
        });
        return deletedIdentity;
    }
}