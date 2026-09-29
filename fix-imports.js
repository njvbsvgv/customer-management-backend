const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : full.endsWith('.ts') ? [full] : [];
  });
}

for (const file of walk(srcDir)) {
  const content = fs.readFileSync(file, 'utf8');
  const updated = content.replace(
    /from\s+(['"])src\/([^'"]+)\1/g,
    (_, quote, target) => {
      let rel = path.relative(path.dirname(file), path.join(srcDir, target));
      rel = rel.split(path.sep).join('/');
      if (!rel.startsWith('.')) rel = './' + rel;
      return `from ${quote}${rel}${quote}`;
    },
  );
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('fixed:', path.relative(__dirname, file));
  }
}