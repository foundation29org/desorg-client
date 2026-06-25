const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.ts') && !full.endsWith('.spec.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      if (!/@(Component|Directive|Pipe)\(/.test(content) || /standalone\s*:/.test(content)) {
        continue;
      }
      content = content.replace(/@(Component|Directive|Pipe)\(\{/g, '@$1({\n    standalone: false,');
      fs.writeFileSync(full, content);
    }
  }
}

walk(path.join(__dirname, '..', 'src', 'app'));
console.log('standalone: false added');
