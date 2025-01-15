
# The Mansion of Lobellia

![The_mansion_of_lobellia2](https://github.com/user-attachments/assets/d728f30e-1f2d-4941-b733-7198e812e9c3)
**Blessings come from curses. Bear this in mind. Be with your creed.**

A turn-based tactical RPG platform built with Next.js and AWS services. Submission for AWS Game Builder Hackathon.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Prisma
- AWS account with appropriate credentials

## Environment Variables

Referring to our `.env.sample` file, create your `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=""
DATABASE_URL=""
DIRECT_URL=""

NEXT_PUBLIC_REGION=""
NEXT_PUBLIC_USER_POOL_ID=""
NEXT_PUBLIC_USER_POOL_CLIENT_ID=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
JWT_SECRET=""

NEXT_PUBLIC_S3_REGION=""
NEXT_PUBLIC_ACCESS_KEY=""
NEXT_PUBLIC_SECRET_ACCESS_KEY=""
NEXT_PUBLIC_S3_NAME=""

LAMBDA_FUNCTION_URI=""
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
- **Authentication**: AWS Cognito with AWS Amplify SDK
- **AI Integration**: OpenAI GPT-4
- **State Management**: Zustand
- **API Layer**: TanStack Query
- **Image Store**: AWS S3 Bucket
- **AI Coding Assistant**: AWS Q Developer

## License

The Mansion of Lobellia is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


<!---
### Image Dumps
![image4](https://github.com/user-attachments/assets/7b87fb74-12b1-4774-ab58-ba019a502a75)
![image6](https://github.com/user-attachments/assets/ab5c552a-c0f0-47c3-8dee-48a19b9daaf1)
![image5](https://github.com/user-attachments/assets/4360c1e4-19f6-4530-a29f-2ddabefe0e48)
![image3](https://github.com/user-attachments/assets/71e06bf8-58cd-4d15-9952-a1dcde77539f)
![image2](https://github.com/user-attachments/assets/2a1c5544-b17f-4357-afc8-2b486ab1d8b3)
--->




