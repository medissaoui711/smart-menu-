const fs = require('fs');
const content = fs.readFileSync('src/hooks/useMenuState.ts', 'utf8');

const updated = content.replace(/const saved = localStorage\.getItem\('([^']+)'\);\n\s+return saved \? JSON\.parse\(saved\) : ([a-zA-Z0-9_]+);/g, (match, key, fallback) => {
  return `const saved = localStorage.getItem('${key}');
    try {
      return saved ? JSON.parse(saved) : ${fallback};
    } catch (e) {
      console.error("Error parsing ${key} from localStorage:", e);
      return ${fallback};
    }`;
});

fs.writeFileSync('src/hooks/useMenuState.ts', updated);
