import { NextRequest, NextResponse } from 'next/server';

const LAMBDA_URL = process.env.LAMBDA_FUNCTION_URI!;

export async function POST(request: NextRequest) {
    try {
        // Get the battle state from the request
        const battleState = await request.json();

        // Call Lambda function through API Gateway
        const response = await fetch(LAMBDA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({body: JSON.stringify(battleState)})
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error || 'Failed to get AI response' },
                { status: response.status }
            );
        }

        // Parse and validate the response
        const data = await response.json();

        // Return the AI's decision
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in monster AI route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}