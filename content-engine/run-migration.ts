import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vsnefzxbdzcgugslwtqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbmVmenhiZHpjZ3Vnc2x3dHFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIzMjIzOSwiZXhwIjoyMDg2ODA4MjM5fQ.zqfq-u4jsTQx8bF7GhfFbaP5laxVbK4QJ5PY_TWmkm8'
);

async function main() {
  // Test if table exists by trying to select
  const { error } = await supabase.from('articles').select('id').limit(1);

  if (error && error.code === 'PGRST205') {
    console.log('Table does not exist. Please run the migration SQL in Supabase Dashboard:');
    console.log('  https://supabase.com/dashboard/project/vsnefzxbdzcgugslwtqo/sql');
    console.log('  File: content-engine/migrations/001-articles.sql');
    process.exit(1);
  } else if (error) {
    console.log('Error:', error.message);
    process.exit(1);
  } else {
    console.log('articles table exists and is accessible!');
  }
}

main();
