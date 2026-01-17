# Setting up Supabase Environment Variables on Vercel

The login page is stuck on "loading..." because Vercel is missing your Supabase credentials.

## Steps to fix:

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your "AM-PM Logistics Company" project

2. **Go to Settings → Environment Variables**
   - Click the "Settings" tab
   - Scroll down to "Environment Variables"

3. **Add these environment variables:**

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

4. **Where to find these values:**
   - Go to https://supabase.com
   - Select your project
   - Click "Settings" → "API"
   - Copy:
     - **Project URL** → NEXT_PUBLIC_SUPABASE_URL
     - **anon public** → NEXT_PUBLIC_SUPABASE_ANON_KEY
     - **service_role secret** → SUPABASE_SERVICE_ROLE_KEY

5. **For NEXT_PUBLIC_APP_URL:**
   - Use your actual Vercel domain (e.g., `https://am-pm-logistics.vercel.app`)

6. **Save and redeploy**
   - Click "Save"
   - Go to the "Deployments" tab
   - Click the "..." next to the latest deployment
   - Click "Redeploy"

## If it still shows "loading..."

The environment variables take effect on redeployment. After setting them:
1. Vercel should automatically trigger a redeploy
2. If not, manually redeploy from the Deployments tab
3. Wait 2-3 minutes for the build to complete
4. Clear your browser cache (Ctrl+Shift+Del) and refresh

## Verify the fix:
- Try logging in again
- It should process the login instead of hanging on "loading..."
