# Setup Guide for Spendwise Authentication

This guide will walk you through setting up the authentication system step by step.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or later installed
- npm or yarn package manager
- A web browser
- A valid email address for testing

## Step 1: Create a Supabase Account and Project

1. **Sign up for Supabase:**
   - Go to https://app.supabase.com
   - Click "Start your project"
   - Sign up with GitHub, GitLab, or email

2. **Create a new project:**
   - Click "New Project"
   - Choose an organization (create one if needed)
   - Enter project details:
     - Name: `spendwise` (or your preferred name)
     - Database Password: Generate a strong password (save it!)
     - Region: Choose closest to your location
   - Click "Create new project"
   - Wait for the project to be set up (~2 minutes)

## Step 2: Get Your Supabase Credentials

1. **Navigate to API settings:**
   - In your Supabase project dashboard
   - Go to Settings (gear icon) → API

2. **Copy your credentials:**
   - **Project URL:** Copy the URL under "Project URL" section
     - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon Key:** Copy the key under "Project API keys" → "anon" → "public"
     - This is a long string starting with `eyJ...`

## Step 3: Configure Authentication Settings

1. **Enable email authentication:**
   - Go to Authentication → Providers
   - Find "Email" provider
   - Ensure it's enabled (should be enabled by default)

2. **Configure Site URL:**
   - Go to Authentication → URL Configuration
   - Set "Site URL" to `http://localhost:3000` (for development)

3. **Add Redirect URLs:**
   - Still in URL Configuration
   - Under "Redirect URLs", add:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard for all routes)

4. **Email Template Configuration (Optional but Recommended):**
   - Go to Authentication → Email Templates
   - You can customize:
     - Confirm signup email
     - Magic Link email
     - Change Email Address
     - Reset Password email
   - Each template can be customized with HTML and variables

## Step 4: Set Up the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

3. **Add your Supabase credentials to `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Replace:
   - `https://your-project-id.supabase.co` with your Project URL
   - `your-anon-key-here` with your Anon public key

## Step 5: Start the Development Server

```bash
npm run dev
```

The application should now be running at http://localhost:3000

## Step 6: Test the Authentication Flow

### Testing Sign Up

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Enter a valid email and password (min 6 characters)
4. Click "Sign up"
5. Check your email for a confirmation link
6. Click the confirmation link
7. You should be redirected back to the app and logged in

**Important:** During development, Supabase may send emails to your spam folder. Check there if you don't see the email.

### Testing Sign In

1. Go to http://localhost:3000/auth/sign-in
2. Enter your registered email and password
3. Click "Sign in"
4. You should be redirected to /protected page

### Testing Password Reset

1. Go to http://localhost:3000/auth/reset-password
2. Enter your registered email
3. Click "Send reset link"
4. Check your email for reset link
5. Click the link
6. Enter your new password
7. You should be redirected to sign in page

### Testing Protected Routes

1. When logged in, navigate to /protected
2. You should see your user information
3. Try signing out
4. You should be redirected to the home page
5. Try accessing /protected again
6. You should be redirected to /auth/sign-in

## Step 7: Verify Middleware Protection

Test that middleware is working:

1. **While logged out:**
   - Try accessing `/protected` directly
   - You should be automatically redirected to `/auth/sign-in`

2. **While logged in:**
   - Try accessing `/auth/sign-in` directly
   - You should be automatically redirected to `/protected`

## Troubleshooting

### Issue: "Invalid API credentials"

**Solution:**
- Double-check your environment variables in `.env.local`
- Ensure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

### Issue: Confirmation email not received

**Solutions:**
1. Check your spam/junk folder
2. Verify email provider settings in Supabase dashboard
3. Check Supabase logs: Authentication → Logs
4. Try with a different email address
5. In development, you can disable email confirmation:
   - Go to Authentication → Providers → Email
   - Uncheck "Confirm email"
   - **Remember to re-enable for production!**

### Issue: "Auth session missing"

**Solutions:**
1. Clear browser cookies and local storage
2. Try in incognito/private mode
3. Check browser console for errors
4. Verify middleware.ts is in the root directory

### Issue: Redirect loop after sign in

**Solutions:**
1. Check that your redirect URLs in Supabase match your app URLs
2. Clear cookies and try again
3. Check middleware.ts logic
4. Verify NEXT_PUBLIC_SITE_URL in .env.local

### Issue: TypeScript errors

**Solutions:**
1. Run `npm install` to ensure all dependencies are installed
2. Delete `.next` folder and restart dev server
3. Check tsconfig.json is properly configured

## Testing with Different Scenarios

### Test 1: New User Registration
- Use a fresh email address
- Complete signup process
- Verify email confirmation
- Check that session persists across page reloads

### Test 2: Existing User Login
- Use previously registered credentials
- Verify successful login
- Check protected route access

### Test 3: Password Reset
- Request password reset for existing account
- Use the reset link
- Update password
- Login with new password

### Test 4: Session Persistence
- Login to the application
- Close browser tab
- Reopen and visit the site
- Should still be logged in (session persists)

### Test 5: Logout
- While logged in, click logout
- Verify redirect to home page
- Try accessing protected routes
- Should redirect to login

## Next Steps

After confirming authentication works:

1. **Customize the UI:**
   - Modify components in `components/ui/`
   - Update styling in Tailwind classes
   - Add your branding

2. **Add More Features:**
   - User profile management
   - Password change functionality
   - Two-factor authentication
   - Social auth providers (Google, GitHub, etc.)

3. **Prepare for Production:**
   - Update Supabase redirect URLs with production domain
   - Enable email confirmation
   - Configure custom email templates
   - Set up proper error logging
   - Add rate limiting

4. **Deploy:**
   - See deployment section in README.md
   - Remember to set environment variables in your hosting platform
   - Test all auth flows in production environment

## Development Tips

1. **Use Supabase Local Development:**
   ```bash
   npx supabase init
   npx supabase start
   ```
   This runs a local Supabase instance for testing

2. **Enable Debug Mode:**
   Add to your `.env.local`:
   ```env
   NEXT_PUBLIC_DEBUG=true
   ```

3. **Monitor Auth Logs:**
   - Check Supabase Dashboard → Authentication → Logs
   - View real-time auth events and errors

4. **Test Email Templates:**
   - Use a service like MailHog for local email testing
   - Or use Supabase's built-in email testing

## Security Checklist

Before going to production:

- [ ] Environment variables are not committed to git
- [ ] Email confirmation is enabled
- [ ] Rate limiting is configured
- [ ] CORS settings are properly configured
- [ ] Redirect URLs only include trusted domains
- [ ] SSL/HTTPS is enabled
- [ ] Password requirements are appropriate
- [ ] Error messages don't leak sensitive information
- [ ] Session timeout is configured appropriately

## Getting Help

If you encounter issues:

1. Check the Supabase documentation: https://supabase.com/docs
2. Review Next.js documentation: https://nextjs.org/docs
3. Search Supabase GitHub issues
4. Join Supabase Discord community
5. Check the project's GitHub issues

## Summary

You should now have a fully functional authentication system with:

- ✅ User registration with email verification
- ✅ Secure login
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ Session management
- ✅ Middleware protection
- ✅ Client-side route guards

Happy coding! 🚀
