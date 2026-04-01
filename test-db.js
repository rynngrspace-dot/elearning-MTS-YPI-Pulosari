const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres:Riyan321%23123@db.evecnhknlwbrqupdzich.supabase.co:5432/postgres"
});

client.connect()
  .then(() => {
    console.log('Connected to Supabase!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current time from DB:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
