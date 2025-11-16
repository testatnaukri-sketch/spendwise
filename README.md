# Spendwise

Personal Finance Management Made Simple.

Spendwise is a web application that helps users manage their finances effectively. Track income, expenses, and work towards financial goals with intuitive tools and detailed insights.

## Features

### Profile Module ✅

Manage your personal and financial information:
- **Personal Information**: Name, email, phone, date of birth, employment status
- **Financial Overview**: Monthly income, fixed expenses, savings goals
- **Risk Preferences**: Set risk tolerance and financial goals
- **Spending Capacity**: Automatically calculated available spending and savings rate
- **Secure Storage**: All data securely stored in Supabase with Row Level Security

### Form Validation

- React Hook Form for robust form management
- Zod for comprehensive data validation
- User-friendly error messages
- Success notifications with Sonner

### Testing & Quality

- Comprehensive unit tests for utilities and schemas
- Component tests for UI elements
- Integration tests for profile operations
- PII security testing to ensure sensitive data is never logged
- Full TypeScript support

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd spendwise
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Set up the database:
   - Go to your Supabase project
   - Run the SQL schema from `supabase/schema.sql`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### View and Edit Your Profile

1. Navigate to the profile page
2. View your current profile information and financial metrics
3. Click "Edit Profile" to make changes
4. Fill in your personal and financial information
5. Submit the form to save changes

### Understanding Your Metrics

- **Monthly Income**: Your total monthly earnings
- **Fixed Expenses**: Regular monthly expenses (rent, utilities, etc.)
- **Available Spending**: Income minus fixed expenses
- **Savings Rate**: Percentage of income available for savings

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/profile/route.ts      # Profile API endpoints
│   ├── profile/page.tsx          # Profile page
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ProfileForm.tsx           # Profile form component
│   ├── ProfileCard.tsx           # Profile display component
│   └── ProfilePage.tsx           # Profile container
├── lib/                          # Utilities and hooks
│   ├── hooks/                    # Custom React hooks
│   ├── profile-schema.ts         # Zod validation schemas
│   ├── profile-utils.ts          # Profile utility functions
│   └── supabase.ts               # Supabase client
├── __tests__/                    # Test files
└── supabase/schema.sql           # Database schema
```

## API Reference

### GET /api/profile?userId=<userId>

Fetch user profile

### POST /api/profile

Create a new profile

### PUT /api/profile

Update user profile

### DELETE /api/profile?userId=<userId>

Delete user profile

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed API documentation.

## Development

### Run Tests

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React 18](https://react.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)

## Security

- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **PII Protection**: Sensitive information is never logged
- **Type Safety**: Full TypeScript for runtime safety
- **Validation**: All inputs validated server and client-side

## Contributing

1. Create a feature branch
2. Make your changes
3. Write or update tests
4. Run linting and tests
5. Submit a pull request

## License

This project is part of the Spendwise personal finance application.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] Expense tracking and categorization
- [ ] Goal management and progress tracking
- [ ] Spending analytics and charts
- [ ] Budget planning tools
- [ ] Multi-user household support
- [ ] Mobile application
- [ ] Real-time notifications
- [ ] AI-powered financial insights
