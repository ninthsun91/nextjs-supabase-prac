'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import type { Database, Tables } from '@/types';

type ProfileForm = {
  username: string | null;
  fullname: string | null;
  website: string | null;
  avatarUrl: string | null;
}

function AccountForm({ user }: { user: User | null }) {
  const supabase = createClientComponentClient<Database>();

  const [loading, setLoading] = useState<boolean>(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const userId = user?.id;
      if (userId === undefined) {
        throw new Error('User ID is undefined');
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', userId)
        .single();

      if (!!error && status !== 406) {
        throw error;
      }

      if (!!data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error fetching user profile');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const updateProfile = async ({ username, website, avatarUrl }: ProfileForm) => {
    try {
      setLoading(true);

      const userId = user?.id;
      if (userId === undefined) {
        throw new Error('User ID is undefined');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: fullname,
          username,
          website,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (!!error) throw error;

      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, website, avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountForm;
