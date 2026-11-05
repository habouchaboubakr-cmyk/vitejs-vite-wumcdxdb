import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ckbpbiizzdbpqchgjjnt.supabase.co/rest/v1/';
const supabaseKey = 'sb_publishable_-ytJmcikGze-RqfLPlzvMA_h5NhKf7E';

export const supabase = createClient(supabaseUrl, supabaseKey);
