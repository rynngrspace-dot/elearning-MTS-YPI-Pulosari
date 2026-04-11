const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const filePath = path.join(publicDir, 'template_siswa.xlsx');

const data = [
    { Nama: 'Contoh Siswa Laki', NISN: '1234567891', Gender: 'L' },
    { Nama: 'Contoh Siswa Perempuan', NISN: '1234567892', Gender: 'P' }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

XLSX.writeFile(workbook, filePath);

console.log(`✅ Template created at: ${filePath}`);
