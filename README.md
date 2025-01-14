
# Mansion of Lobellia

A turn-based tactical RPG platform built with Next.js and AWS services.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- PostgreSQL database
- AWS account with appropriate credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DIRECT_URL="your_postgresql_connection_string"

# AWS Cognito
NEXT_PUBLIC_USER_POOL_ID="your_cognito_user_pool_id"
NEXT_PUBLIC_USER_POOL_CLIENT_ID="your_cognito_user_pool_client_id"

# OpenAI (for Lambda function)
OPENAI_KEY="your_openai_api_key"
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ImgyeongLee/Mansion-of-Lobellia.git
cd Mansion-of-Lobellia
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Set up AWS Lambda and API Gateway:

   a. Create a Lambda function:
    - Go to the AWS Lambda console.
    - Click "Create function."
    - Choose "Author from scratch."
    - Set the Runtime to any Node.js version (>18.x)
    - Create the function.

   b. Deploy the Lambda code:
    - Navigate to the `lambda-aws` directory and install dependencies:
      ```bash
      cd lambda-aws
      npm install
      ```
    - Zip the contents of the `lambda-aws` directory.
    - Upload the zip file to your Lambda function.

   c. Create API Gateway:
    - Go to the API Gateway console.
    - Create a new REST API.
    - Create a new resource and POST method.
    - Connect it to your Lambda function.
    - Deploy the API to a stage (e.g., "test" or "prod").
    - Copy the API endpoint URL.

   d. Update environment variables:
    - Add the API Gateway URL to your `.env` file:
      ```env
      LAMBDA_FUNCTION_URI="https://your-api-gateway-url/stage"
      ```

**Note:** Ensure your Lambda function has the necessary IAM permissions to execute and that CORS is properly configured in API Gateway if you're calling it from the frontend.


## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
mansion-of-lobellia/
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable components
│   ├── lib/               # Utility functions and libraries
│   └── static/            # Static data and types
├── lambda-aws/            # AWS Lambda function for AI processing
├── prisma/                # Database schema and migrations
└── public/                # Static files
```

## Features

- User authentication with AWS Cognito
- Turn-based battle system
- AI-powered monster behavior using OpenAI GPT-4
- Character creation and management
- Real-time battle updates
- Inventory system
- Skill system with different ranges and effects

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: AWS Lambda, PostgreSQL
- **ORM**: Prisma
- **Authentication**: AWS Cognito
- **AI Integration**: OpenAI GPT-4
- **State Management**: Zustand
- **API Layer**: TanStack Query

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
