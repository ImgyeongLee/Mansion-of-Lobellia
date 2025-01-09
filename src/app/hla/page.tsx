'use client';

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BattleState } from "@/static/types/lambdaAi";

export default function Hla() {
    const battleState: BattleState = {
        roomId: "room123",
        round: 1,
        entities: [{
            id: "entity1",
            roomId: "room123",
            image: null,
            name: "Goblin",
            description: null,
            attack: 50,
            defense: 30,
            speed: 15,
            maxHp: 100,
            currentHp: 100,
            crit: 5,
            dodge: 10,
            reward: 100,
            colPos: 1,
            rowPos: 1,
            isDead: false,
            isStun: false,
            isConfused: false,
            buffedAmount: 0,
            buffedTurn: 0,
            dotDamageTurn: 0,
            dotDamageAmount: 0,
            skills: [{
                id: '1',
                image: '//somelink',
                name: "Slash",
                description: "A basic slash attack",
                range: "Normal",
                isSelfTargeting: false,
                isEntire: false
            }]
        }],
        characters: [{
            id: "char1",
            name: "Hero",
            image: null,
            description: null,
            class: "Gladiolus",
            maxHp: 120,
            currentHp: 120,
            maxCost: 100,
            currentCost: 100,
            money: 0,
            attack: 60,
            defense: 40,
            dodge: 15,
            crit: 10,
            speed: 20,
            rowPos: 3,
            colPos: 3,
            hasMoved: false,
            hasActioned: false,
            hasUsedUltimate: false,
            isDead: false,
            isConfused: false,
            isDark: false,
            isImmortal: false,
            attackBuffedAmount: 0,
            attackBuffedTurn: 0,
            defenseBuffedAmount: 0,
            defenseBuffedTurn: 0,
            protectorId: null,
            protectedTurn: 0,
            dotDamageTurn: 0,
            dotDamageAmount: 0
        }]
    };

    const { isLoading, isError, error, data, isSuccess, refetch } = useQuery({
        queryKey: [battleState],
        queryFn: async () => {
            const response = await fetch('/api/ai/get_turn', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(battleState)
            });

            if (!response.ok) {
                throw new Error('AI response failed');
            }

            return response.json();
        },
        enabled: false
    });

    return (
        <div className="w-screen h-screen p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Lambda AI Test</h1>
                <p className="text-gray-600">Test the monster AI response from Lambda</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto w-full">
                {/* Battle State Display */}
                <div className="w-full p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Current Battle State</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium mb-2">Monster</h3>
                            <pre className="rounded text-sm">
                                {JSON.stringify(battleState.entities[0], null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Character</h3>
                            <pre className="p-2 rounded text-sm">
                                {JSON.stringify(battleState.characters[0], null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                             disabled:bg-blue-300 disabled:cursor-not-allowed
                             flex items-center gap-2 transition-colors"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? 'Getting AI Response...' : 'Call Lambda Function'}
                </button>

                {/* Response Section */}
                <div className="w-full">
                    <h2 className="text-lg font-semibold mb-4">Lambda Response</h2>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="p-4 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                            <p>Processing AI response...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                            <p className="font-medium">Error:</p>
                            <p>{error?.message || 'Failed to get AI response'}</p>
                        </div>
                    )}

                    {/* Success State */}
                    {isSuccess && data && (
                        <div className="p-4 rounded-lg">
                            <p className="font-medium text-green-700 mb-2">AI Response Received:</p>
                            <pre className="p-4 rounded text-sm overflow-auto max-h-96">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}