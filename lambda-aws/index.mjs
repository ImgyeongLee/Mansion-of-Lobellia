import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export const handler = async (event) => {
  try {
    const battleState = JSON.parse(event.body || '{}');

    if (!battleState.roomId || !battleState.entities || !battleState.characters) {
      return createResponse(400, { error: 'Invalid battle state provided' });
    }

    const monsterActions = await determineMonsterActions(battleState);
    return createResponse(200, monsterActions);

  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      details: error.message
    });
  }
};

async function determineMonsterActions(state) {
  try {
    const systemPrompt = `You are a tactical AI making decisions for monsters in a turn-based battle game. 
Your task is to analyze the battle state and determine optimal actions for each monster.

Movement and Range Rules:
1. Monsters can move before using a skill
2. Movement limits:
   - Up to 2 cells horizontally or vertically
   - Up to 1 cell diagonally
3. Skill ranges:
   - Self: Only the caster's position
   - Narrow: Adjacent cells (up, down, left, right)
   - Normal: Adjacent cells + diagonals
   - Wide: Up to 2 cells away in any direction

Strategic Considerations:
1. Move to get within skill range of targets
2. Position to avoid being surrounded
3. Support units (healers/buffers) should stay behind damage dealers
4. Consider moving away from low HP
5. Don't move if already in optimal position

Target Selection Rules:
1. Cannot target dead monsters with any skills
2. Cannot target dead characters with any skills
3. Support skills (healing/buffs) should only target living allies
4. Damage skills should only target living enemies
5. Consider HP percentages when choosing healing targets

Other Important Rules:
1. Cannot move to occupied positions
2. Only use skills from monster's skill list
3. One action per monster per turn
4. Dead monsters cannot take actions
5. Support skills (healing/buffs) should target allies
6. Consider monster and target HP when choosing actions

Provide a JSON response in this format:
{
  "actions": [
    {
      "entityId": "monster's ID",
      "targetId": ["target character ID"],
      "skillName": "exact name from monster's skills",
      "skillId": "exact ID from monster's skills",
      "rowPos": number (new position after movement),
      "colPos": number (new position after movement)
    }
  ]
}`;

    const battleDescription = `Current Battle State (Round ${state.round}):

Monsters:
${state.entities.map(m => `
${m.name} (ID: ${m.id})
- HP: ${m.currentHp}/${m.maxHp} (${Math.round(m.currentHp/m.maxHp * 100)}%)
- Position: (${m.rowPos}, ${m.colPos})
- Attack: ${m.attack}, Defense: ${m.defense}
- Status: ${getStatusEffects(m)}
- Skills: ${m.skills.map(s => `${s.name} (ID: ${s.id}, Range: ${s.range})`).join(', ')}
`).join('\n')}

Characters:
${state.characters.map(c => `
${c.name} (ID: ${c.id})
- HP: ${c.currentHp}/${c.maxHp} (${Math.round(c.currentHp/c.maxHp * 100)}%)
- Position: (${c.rowPos}, ${c.colPos})
- Status: ${getStatusEffects(c)}
`).join('\n')}

Tactical Considerations:
- Support monsters should prioritize healing allies below 50% HP
- Consider moving to flank characters
- Maintain safe distance for ranged attackers
- Do not target dead units with any skills
- Group similar monster types together for better synergy`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: battleDescription }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    const validatedActions = validateActions(aiResponse.actions, state);

    return {
      actions: validatedActions
    };

  } catch (error) {
    console.error('Error in AI processing:', error);
    return {
      error: 'AI processing failed',
      actions: generateFallbackActions(state.entities)
    };
  }
}

function getStatusEffects(entity) {
  const effects = [];
  if (entity.isDead) effects.push('Dead');
  if (entity.isStun) effects.push('Stunned');
  if (entity.isConfused) effects.push('Confused');
  if (entity.dotDamageTurn > 0) effects.push('DoT');
  return effects.length ? effects.join(', ') : 'Normal';
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Check if it's a diagonal move
  if (rowDiff === 1 && colDiff === 1) return true;

  // Check if it's a valid horizontal/vertical move (up to 2 cells)
  if ((rowDiff === 0 && colDiff <= 2) || (colDiff === 0 && rowDiff <= 2)) return true;

  return false;
}

function validateActions(actions, state) {
  return actions.map(action => {
    const entity = state.entities.find(e => e.id === action.entityId);
    if (!entity || entity.isDead) return null;

    // Validate skill exists in entity's skills
    const validSkill = entity.skills.find(s =>
        s.name === action.skillName &&
        s.id === action.skillId
    );

    if (!validSkill) {
      const fallbackSkill = entity.skills[0];
      action.skillName = fallbackSkill.name;
      action.skillId = fallbackSkill.id;
    }

    // Validate movement
    if (!isValidMove(entity.rowPos, entity.colPos, action.rowPos, action.colPos)) {
      action.rowPos = entity.rowPos;
      action.colPos = entity.colPos;
    }

    // Check if position is occupied
    const isOccupied = [...state.characters, ...state.entities].some(e =>
        !e.isDead &&
        e.id !== action.entityId &&
        e.rowPos === action.rowPos &&
        e.colPos === action.colPos
    );

    if (isOccupied) {
      action.rowPos = entity.rowPos;
      action.colPos = entity.colPos;
    }

    // Validate targets are not dead
    const validTargets = action.targetId.filter(targetId => {
      const targetMonster = state.entities.find(e => e.id === targetId);
      const targetCharacter = state.characters.find(c => c.id === targetId);
      const target = targetMonster || targetCharacter;
      return target && !target.isDead;
    });

    if (validTargets.length === 0) {
      // If no valid targets, find a new living target
      const livingTargets = state.characters.filter(c => !c.isDead);
      if (livingTargets.length > 0) {
        validTargets.push(livingTargets[0].id);
      }
    }

    return {
      entityId: action.entityId,
      targetId: validTargets,
      skillName: action.skillName,
      skillId: action.skillId,
      rowPos: action.rowPos,
      colPos: action.colPos
    };
  }).filter(action => action !== null);
}

function generateFallbackActions(entities) {
  return entities
      .filter(entity => !entity.isDead)
      .map(entity => {
        const defaultSkill = entity.skills[0];
        return {
          entityId: entity.id,
          targetId: [],
          skillName: defaultSkill.name,
          skillId: defaultSkill.id,
          rowPos: entity.rowPos,
          colPos: entity.colPos
        };
      });
}

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}