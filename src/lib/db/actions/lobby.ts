import prisma from '@/lib/db/prisma';

export async function getUserDungeonsWithInfo(userId: string) {
  try {
    const userBattles = await prisma.character.findUnique({
      where: {
        userId: userId,
      },
      select: {
        battleRoom: {
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
            entities: true,
          },
        },
      },
    });

    if (!userBattles) return { success: false, error: 'Character not found' };

    return { success: true, data: userBattles.battleRoom };
  } catch (error) {
    return { success: false, error };
  }
}

// export async function getBattleInfo(battleId: string) {
//     try {
//         const battleInfo = await prisma.battleRoom.findUnique({
//             where: {
//                 id: battleId,
//             },
//             include: {
//                 participants: {
//                     include: {
//                         skills: {
//                             include: {
//                                 skill: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//
//         if (!battleInfo) return { success: false, error: "Battle not found" };
//
//         return { success: true, battleInfo };
//     } catch (error) {
//         return { success: false, error };
//     }
// }
