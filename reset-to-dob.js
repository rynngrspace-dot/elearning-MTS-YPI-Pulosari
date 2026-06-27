const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Read DATABASE_URL from .env
const envPath = path.join(__dirname, ".env");
let connectionString = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
  if (match) {
    connectionString = match[1];
  }
}

if (!connectionString) {
  console.error("❌ Gagal mendapatkan DATABASE_URL dari file .env");
  process.exit(1);
}

const client = new Client({
  connectionString,
});

async function main() {
  await client.connect();
  console.log("Mengambil data siswa dari database...");
  
  const query = `
    SELECT u.id as "userId", u.name, s."tanggalLahir"
    FROM "User" u
    JOIN "Student" s ON s."userId" = u.id
    WHERE u.role = 'STUDENT';
  `;
  const res = await client.query(query);
  
  console.log(`Ditemukan ${res.rows.length} siswa. Mulai memperbarui password berdasarkan tanggal lahir...`);
  
  for (const row of res.rows) {
    const userId = row.userId;
    const name = row.name;
    const dob = row.tanggalLahir;
    
    let plainPassword = "123";
    if (dob) {
      const cleanDob = String(dob).trim();
      const matchIso = cleanDob.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (matchIso) {
        plainPassword = `${matchIso[1]}${matchIso[2]}${matchIso[3]}`;
      } else {
        const matchIndo = cleanDob.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (matchIndo) {
          plainPassword = `${matchIndo[3]}${matchIndo[2]}${matchIndo[1]}`;
        } else {
          const digits = cleanDob.replace(/\D/g, "");
          if (digits.length >= 8) {
            plainPassword = digits.substring(0, 8);
          } else {
            plainPassword = digits || "123";
          }
        }
      }
    }
    
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    await client.query('UPDATE "User" SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    console.log(`✔ Updated: ${name} -> password: ${plainPassword}`);
  }
  
  console.log("\n✅ Semua password siswa berhasil dikembalikan ke default tanggal lahir (YYYYMMDD) / 123.");
  await client.end();
}

main().catch(err => {
  console.error("Terjadi kesalahan:", err);
});
