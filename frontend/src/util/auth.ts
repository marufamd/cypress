import { ref } from 'vue';
import { supabase } from '@/util/supabase';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export const user = ref<UserData | null>(null);

export async function fetchUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    user.value = null;
    return;
  }

  const baseUser = session.user;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', baseUser.id)
    .maybeSingle();

    console.log('details:', baseUser.id);
    console.log('profile:', profile);
    console.log('error:', error);

  user.value = {
    id: baseUser.id,
    email: baseUser.email!,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
  };
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) fetchUser();
  else user.value = null;
});
