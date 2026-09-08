import { Injectable } from '@angular/core';
import { supabaseClient } from '../../../config/supabase.client';

/**
 * Client-side convenience layer for the administration UI.
 *
 * This is deliberately not the source of authorization truth: every protected
 * API route still validates the bearer token and the role on the server.
 */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  async signInAsAdmin(email: string, password: string): Promise<boolean> {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return false;

    const isAdmin = await this.hasAdminRole();
    if (!isAdmin) {
      await this.signOut();
    }

    return isAdmin;
  }

  async hasAdminRole(): Promise<boolean> {
    // getUser() validates the current session with Supabase Auth. Do not make
    // authorization decisions from user_metadata: users can edit it themselves.
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    const user = userData.user;
    if (userError || !user) return false;

    // RLS only permits a user to read their own profile. Failure is treated as
    // denial so a missing policy or an unavailable database never opens admin.
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return !profileError && profile?.role === 'ADMIN';
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async signOut(): Promise<void> {
    await supabaseClient.auth.signOut();
  }
}
