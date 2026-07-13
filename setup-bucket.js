require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateBucket() {
  const { data: buckets, error: getError } = await supabase.storage.listBuckets();
  if (getError) {
    console.error("Error listing buckets:", getError);
    return;
  }
  console.log("Existing buckets:", buckets.map(b => b.name));
  
  const scansBucket = buckets.find(b => b.name === 'scans');
  if (!scansBucket) {
    console.log("Creating 'scans' bucket...");
    const { data, error } = await supabase.storage.createBucket('scans', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    if (error) {
      console.error("Error creating bucket:", error);
    } else {
      console.log("Bucket created successfully:", data);
    }
  } else {
    console.log("'scans' bucket already exists.");
  }
}

checkAndCreateBucket();
