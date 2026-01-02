-- Confirm all existing unconfirmed users
-- This should be run if you have users stuck in unconfirmed state
-- Note: This uses Supabase admin functions

-- Get all unconfirmed users (you'll need to run this via Supabase SQL editor)
-- After disabling email confirmation in settings, new users won't need this

-- To manually confirm a specific user, you can update their email_confirmed_at
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW()
-- WHERE email = 'user@example.com' AND email_confirmed_at IS NULL;

-- For your current stuck user:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'Pubg4k12@gmail.com' AND email_confirmed_at IS NULL;
