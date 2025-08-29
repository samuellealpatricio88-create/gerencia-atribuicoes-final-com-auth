import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ooqropeglqnghjywxcor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcXJvcGVnbHFuZ2hqeXd4Y29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODkxOTMsImV4cCI6MjA3MjA2NTE5M30.ws0Lq36JwRClRLAhTx1894uuk21gm6fDjcZWlpo7ZQk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


