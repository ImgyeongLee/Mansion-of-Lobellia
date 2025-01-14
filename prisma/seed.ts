import { PrismaClient, SkillRange, Difficulty, SkillType } from '@prisma/client';
const prisma = new PrismaClient();

const SAMPLE_CHARACTER_SKILLS = [
    {
        name: 'Swing',
        description: 'Deals 1x damage to all enemies within range',
        type: SkillType.General,
        range: SkillRange.Wide,
        isAllyTargeting: false,
        isEnemyTargeting: false,
        isSelfTargeting: false,
        isEntire: true,
        isUltimate: false,
        requiredCost: 6,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/Swing.webp',
    },
    {
        name: 'Strike',
        description: 'Deals 1.3x damage to a single target within range',
        type: SkillType.General,
        range: SkillRange.Normal,
        isAllyTargeting: false,
        isEnemyTargeting: true,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: false,
        requiredCost: 5,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/Strike.webp',
    },
    {
        name: 'Adrenaline',
        description: 'Increases own attack power by 30% for 2 turns',
        type: SkillType.General,
        range: SkillRange.Self,
        isAllyTargeting: false,
        isEnemyTargeting: false,
        isSelfTargeting: true,
        isEntire: false,
        isUltimate: false,
        requiredCost: 7,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/Adrenaline.webp',
    },
    {
        name: 'Defensive Stance',
        description: 'Increases own defense power by 30% for 2 turns',
        type: SkillType.General,
        range: SkillRange.Self,
        isAllyTargeting: false,
        isEnemyTargeting: false,
        isSelfTargeting: true,
        isEntire: false,
        isUltimate: false,
        requiredCost: 7,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/defensive_stance.webp',
    },
    {
        name: 'Vibrating Smash',
        description: 'Deals 3x damage to a single target and inflicts stun',
        type: SkillType.Cypress,
        range: SkillRange.Narrow,
        isAllyTargeting: false,
        isEnemyTargeting: true,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: true,
        requiredCost: 15,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/vibratingSmash.webp',
    },
    {
        name: 'First Aid',
        description: 'Heals one ally within range based on attack power',
        type: SkillType.General,
        range: SkillRange.Normal,
        isAllyTargeting: true,
        isEnemyTargeting: false,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: false,
        requiredCost: 6,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/FirstAid.webp',
    },
    {
        name: 'Inspire',
        description: 'Restores 50% cost for one ally within range',
        type: SkillType.General,
        range: SkillRange.Normal,
        isAllyTargeting: true,
        isEnemyTargeting: false,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: false,
        requiredCost: 8,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/inspire.webp',
    },
    {
        name: 'Resurrection',
        description: 'Revives one dead ally',
        type: SkillType.Saintpaulia,
        range: SkillRange.Wide,
        isAllyTargeting: true,
        isEnemyTargeting: false,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: true,
        requiredCost: 20,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/resurrection.webp',
    },
    {
        name: 'Guardian',
        description: "Protects one ally within range for 2 turns, increasing the protector's defense power by 50%",
        type: SkillType.Gladiolus,
        range: SkillRange.Normal,
        isAllyTargeting: true,
        isEnemyTargeting: false,
        isSelfTargeting: true,
        isEntire: false,
        isUltimate: false,
        requiredCost: 10,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/Guardian.webp',
    },
    {
        name: 'Focus',
        description: 'Grants a buff to one ally within range, guaranteeing their next skill will critically hit',
        type: SkillType.Blackthorn,
        range: SkillRange.Normal,
        isAllyTargeting: true,
        isEnemyTargeting: false,
        isSelfTargeting: false,
        isEntire: false,
        isUltimate: false,
        requiredCost: 18,
        requiredHp: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/focus.webp',
    },
];

const SAMPLE_ITEMS = [
    {
        name: 'Beginner Health Recovery Potion',
        description: 'Restores health by 15% of maximum HP',
        sellPrice: 4,
        buyPrice: 10,
        isStoreItem: true,
        hpRecovery: 15,
        costRecovery: 0,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/hppotion.webp',
    },
    {
        name: 'Beginner Energy Recovery Potion',
        description: 'Restores cost by 15% of maximum cost',
        sellPrice: 6,
        buyPrice: 12,
        isStoreItem: true,
        hpRecovery: 0,
        costRecovery: 15,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/costpotion.webp',
    },
];

const SAMPLE_MONSTERS = [
    {
        name: 'Skeleton Soldier',
        maxHp: 50,
        attack: 8,
        defense: 5,
        dodge: 10,
        crit: 5,
        speed: 6,
        reward: 10,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/skeletonSoldier.png',
    },
    {
        name: 'Skeleton Mage',
        maxHp: 40,
        attack: 7,
        defense: 0,
        dodge: 10,
        crit: 5,
        speed: 8,
        reward: 10,
        image: 'https://the-mansion-of-lobellia.s3.us-east-1.amazonaws.com/skeletonMage.png',
    },
];

const SAMPLE_MONSTER_SKILLS = [
    {
        name: 'Clumsy Attack',
        description: 'Deals 1x damage to a single target within range',
        range: SkillRange.Normal,
        isSelfTargeting: false,
        isEntire: false,
    },
    {
        name: 'Clumsy Heal',
        description: 'Restores 20% HP for one ally within range',
        range: SkillRange.Normal,
        isSelfTargeting: false,
        isEntire: false,
    },
    {
        name: 'Morale Boost',
        description: 'Increases the attack power of one ally within range by 30%',
        range: SkillRange.Normal,
        isSelfTargeting: false,
        isEntire: false,
    },
];

const SAMPLE_DUNGEON = {
    name: 'The First Floor',
    size: 6,
    description:
        'The first floor of the mansion, where the entrance is located. You can see some dead bodies on the floor.',
    difficulty: Difficulty.Easy,
    minMember: 1,
    maxMember: 3,
};

async function main() {
    const dungeon = await prisma.dungeon.create({
        data: {
            name: SAMPLE_DUNGEON.name,
            size: SAMPLE_DUNGEON.size,
            description: SAMPLE_DUNGEON.description,
            difficulty: SAMPLE_DUNGEON.difficulty,
            minMember: SAMPLE_DUNGEON.minMember,
            maxMember: SAMPLE_DUNGEON.maxMember,
        },
    });

    for (const skill of SAMPLE_CHARACTER_SKILLS) {
        await prisma.characterSkill.create({
            data: {
                name: skill.name,
                description: skill.description,
                type: skill.type,
                range: skill.range,
                isAllyTargeting: skill.isAllyTargeting,
                isEnemyTargeting: skill.isEnemyTargeting,
                isSelfTargeting: skill.isSelfTargeting,
                isEntire: skill.isEntire,
                isUltimate: skill.isUltimate,
                requiredCost: skill.requiredCost,
                requiredHp: skill.requiredHp,
            },
        });
    }

    for (const item of SAMPLE_ITEMS) {
        await prisma.item.create({
            data: {
                name: item.name,
                description: item.description,
                sellPrice: item.sellPrice,
                buyPrice: item.buyPrice,
                isStoreItem: item.isStoreItem,
                hpRecovery: item.hpRecovery,
                costRecovery: item.costRecovery,
            },
        });
    }

    for (const monsterSkill of SAMPLE_MONSTER_SKILLS) {
        await prisma.monsterSkill.create({
            data: {
                name: monsterSkill.name,
                description: monsterSkill.description,
                range: monsterSkill.range,
                isSelfTargeting: monsterSkill.isSelfTargeting,
                isEntire: monsterSkill.isEntire,
            },
        });
    }

    for (const monster of SAMPLE_MONSTERS) {
        const newMonster = await prisma.monster.create({
            data: {
                name: monster.name,
                maxHp: monster.maxHp,
                attack: monster.attack,
                defense: monster.defense,
                dodge: monster.dodge,
                crit: monster.crit,
                speed: monster.speed,
                reward: monster.reward,
            },
        });

        await prisma.monsterDungeonRelation.create({
            data: {
                dungeonId: dungeon.id,
                monsterId: newMonster.id,
            },
        });

        if (newMonster.name == 'Skeleton Soldier') {
            const clumsyAttack = await prisma.monsterSkill.findFirst({
                where: {
                    name: 'Clumsy Attack',
                },
            });

            if (clumsyAttack) {
                await prisma.monsterSkillRelation.create({
                    data: {
                        monsterId: newMonster.id,
                        skillId: clumsyAttack.id,
                    },
                });
            }
        } else if (newMonster.name == 'Skeleton Mage') {
            const clumsyHeal = await prisma.monsterSkill.findFirst({
                where: {
                    name: 'Clumsy Heal',
                },
            });

            if (clumsyHeal) {
                await prisma.monsterSkillRelation.create({
                    data: {
                        monsterId: newMonster.id,
                        skillId: clumsyHeal.id,
                    },
                });
            }

            const moraleBoost = await prisma.monsterSkill.findFirst({
                where: {
                    name: 'Morale Boost',
                },
            });

            if (moraleBoost) {
                await prisma.monsterSkillRelation.create({
                    data: {
                        monsterId: newMonster.id,
                        skillId: moraleBoost.id,
                    },
                });
            }
        }
    }
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

console.log('Seed script execution completed.');
