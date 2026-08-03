import fs from 'fs';

// 1. Fix useMenuState.ts
let useMenuState = fs.readFileSync('src/hooks/useMenuState.ts', 'utf8');
useMenuState = useMenuState.replace(/const saved = localStorage\.getItem\('([^']+)'\);\n\s+return saved \? JSON\.parse\(saved\) : ([a-zA-Z0-9_]+);/g, (match, key, fallback) => {
  return `const saved = localStorage.getItem('${key}');
    try {
      return saved ? JSON.parse(saved) : ${fallback};
    } catch (e) {
      console.error("Error parsing ${key} from localStorage:", e);
      return ${fallback};
    }`;
});
fs.writeFileSync('src/hooks/useMenuState.ts', useMenuState);

// 2. Fix CartDrawer.tsx locationUrl Self-XSS
let cartDrawer = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');
cartDrawer = cartDrawer.replace(/href=\{customer\.locationUrl\}/g, `href={customer.locationUrl?.startsWith('http') ? customer.locationUrl : '#'}`);
fs.writeFileSync('src/components/CartDrawer.tsx', cartDrawer);

console.log("Fixes applied successfully.");
