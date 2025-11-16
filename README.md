# Spendwise

A modern expense tracking application built with Next.js 15 and Supabase authentication.

## Features

- 🔐 **Complete Authentication System**
  - User registration with email verification
  - Secure login with password
  - Password reset functionality
  - Session management with cookies
  - Automatic token refresh

- 🛡️ **Security Features**
  - Server-side session handling
  - Protected routes with middleware
  - Route guards for client components
  - Secure cookie-based authentication

- 🎨 **Modern UI**
  - Responsive design with Tailwind CSS
  - Reusable component library
  - Form validation with Zod
  - Comprehensive error messaging

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Testing:** Jest + React Testing Library
- **TypeScript:** Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd spendwise
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**How to get your Supabase credentials:**

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the "Project URL" (for `NEXT_PUBLIC_SUPABASE_URL`)
5. Copy the "anon public" key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Supabase Setup

1. In your Supabase project dashboard, ensure authentication is enabled:
   - Go to Authentication > Settings
   - Enable "Email" provider
   - Configure email templates (optional)
   - Set "Site URL" to your application URL (e.g., `http://localhost:3000` for development)

2. Configure email redirects:
   - Go to Authentication > URL Configuration
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

### Running the Application

Development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── sign-in/          # Sign in page
│   │   ├── sign-up/          # Sign up page
│   │   ├── reset-password/   # Password reset page
│   │   ├── callback/         # OAuth callback handler
│   │   └── auth-code-error/  # Error page
│   ├── protected/            # Protected route example
│   ├── layout.tsx            # Root layout with AuthProvider
│   └── page.tsx              # Home page
├── components/
│   ├── auth/
│   │   ├── auth-guard.tsx    # Route guard HOC
│   │   └── sign-out-button.tsx
│   └── ui/                   # Reusable UI components
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── context/
│   └── auth-context.tsx      # Auth context provider
├── lib/
│   ├── actions/
│   │   └── auth.ts           # Server actions for auth
│   └── supabase/
│       ├── client.ts         # Client-side Supabase client
│       ├── server.ts         # Server-side Supabase client
│       └── middleware.ts     # Middleware helper
├── types/
│   └── auth.ts               # TypeScript types and schemas
├── __tests__/                # Test files
└── middleware.ts             # Next.js middleware
```

## Authentication Flow

### Sign Up

1. User submits email and password
2. Server creates account via Supabase
3. Verification email sent to user
4. User clicks confirmation link
5. Redirected to callback handler
6. Session created and user logged in

### Sign In

1. User submits credentials
2. Server validates via Supabase
3. Session cookie created
4. User redirected to protected area

### Password Reset

1. User requests password reset
2. Reset email sent with secure link
3. User clicks link and redirected to update form
4. New password submitted and updated
5. User redirected to sign in

### Session Management

- Sessions are stored in HTTP-only cookies
- Middleware validates sessions on protected routes
- Automatic token refresh handled by Supabase
- Sign out clears session and redirects to home

## Middleware Protection

The middleware automatically:

- Redirects unauthenticated users from protected routes to `/auth/sign-in`
- Redirects authenticated users from auth pages to `/protected`
- Refreshes user sessions on every request

Protected routes: All routes except `/`, `/auth/*`, and static files.

## Client-Side Route Guards

Use the `AuthGuard` component or `withAuth` HOC:

```tsx
import { AuthGuard } from '@/components/auth/auth-guard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

Or with HOC:

```tsx
import { withAuth } from '@/components/auth/auth-guard';

function ProtectedComponent() {
  return <div>Protected content</div>;
}

export default withAuth(ProtectedComponent);
```

## Using the Auth Context

Access auth state in client components:

```tsx
'use client';

import { useAuth } from '@/context/auth-context';

export default function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Server-Side Auth

Access user in Server Components:

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return <div>Welcome, {user.email}</div>;
}
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite includes:

- Form validation tests
- Authentication flow tests
- Context provider tests
- Component rendering tests

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your application URL | No (defaults to localhost) |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Start the server: `npm start`

**Important:** Update Supabase redirect URLs with your production domain.

## Troubleshooting

### Email verification not working

- Check Supabase email settings
- Verify redirect URLs are configured correctly
- Check spam folder for verification emails

### Session not persisting

- Ensure cookies are enabled in browser
- Check that middleware is configured correctly
- Verify environment variables are set

### Authentication errors

- Verify Supabase credentials are correct
- Check network tab for API errors
- Review Supabase logs in dashboard

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues or questions, please open an issue on GitHub.
