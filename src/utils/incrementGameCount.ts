import { supabase } from "@/integrations/supabase/client";

export const incrementGameCount = async () => {
  const { error } = await supabase.rpc('increment_game_count');
  if (error) console.error('Error incrementing game count:', error);
};