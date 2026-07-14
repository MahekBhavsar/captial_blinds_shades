import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const adminDir = path.resolve('src/app/admin');
const files = walk(adminDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Colors
  content = content.replace(/color: "#e2e8f0"/g, 'color: "#1e293b"');
  
  // Backgrounds
  content = content.replace(/background: "rgba\(255,255,255,0\.05\)"/g, 'background: "#f8fafc"');
  content = content.replace(/background: "rgba\(255,255,255,0\.1\)"/g, 'background: "#f1f5f9"');
  content = content.replace(/background: "rgba\(0,0,0,0\.2\)"/g, 'background: "#f1f5f9"');

  // Borders
  content = content.replace(/border: "1px solid rgba\(255,255,255,0\.1\)"/g, 'border: "1px solid #e2e8f0"');
  content = content.replace(/border: "1px solid rgba\(255,255,255,0\.2\)"/g, 'border: "1px solid #cbd5e1"');
  
  // Specific Cancel buttons
  content = content.replace(/color: "white", border: "1px solid #cbd5e1"/g, 'color: "#64748b", border: "1px solid #cbd5e1"');
  content = content.replace(/color: "white", borderRadius: "8px", border: "1px solid #cbd5e1"/g, 'color: "#64748b", borderRadius: "8px", border: "1px solid #cbd5e1"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log("Done updating admin colors.");
