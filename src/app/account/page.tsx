import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types';
import AccountForm from './account-form';

async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}

export default Account;