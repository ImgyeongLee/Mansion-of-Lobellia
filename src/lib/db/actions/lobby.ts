import prisma from "@/lib/db/prisma";

export async function getBattleInfo(battleId: string) {
  try {
    const battleInfo = await prisma.battleRoom.findUnique({
      where: {
        id: battleId,
      },
      include: {
        participants: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!battleInfo) return { success: false, error: "Battle not found" }

    return { success: true, battleInfo };
  } catch (error) {
    return { success: false, error };
  }
}
