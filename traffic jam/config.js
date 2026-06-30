// Traffic Jam Restaurant - Supabase Configuration
const SUPABASE_URL = "https://otrjdwzrricdsobiafip.supabase.co";
const SUPABASE_KEY = "sb_publishable_Uv-wv9F23OzWAIhJdbwxUQ_ybSPlge-";

// Initialize Supabase Client
// Note: window.supabase is the CDN namespace; we use supabaseClient to avoid conflict
const supabaseClient = (window.supabase && window.supabase.createClient)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
