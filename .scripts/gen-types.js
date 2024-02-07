const { exec } = require('node:child_process');

const projectId = process.env.SUPABASE_PROJECT_REF;
const schema = process.env.SUPABASE_SCHEMA;
const outputPath = 'src/types/supabase.ts';
const command = `supabase gen types typescript --project-id ${projectId} --schema ${schema} > ${outputPath}`;

console.log('Generating types from Supabase...');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Command stderr: ${stderr}`);
    return;
  }
  
  console.log(`Types generated at ${outputPath}`);
  console.log(stdout);
});
