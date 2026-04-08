#!/bin/bash

echo "🔍 Checking CAMPUS360 Setup..."
echo ""

# Check Node.js
echo "1. Node.js:"
node --version || echo "❌ Node.js not found"
echo ""

# Check npm
echo "2. npm:"
npm --version || echo "❌ npm not found"
echo ""

# Check if in correct directory
echo "3. Project files:"
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found - are you in the right directory?"
fi
echo ""

# Check node_modules
echo "4. Dependencies:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    
    # Check Tailwind
    if [ -d "node_modules/tailwindcss" ]; then
        echo "✅ Tailwind CSS installed"
    else
        echo "❌ Tailwind CSS NOT installed"
        echo "   Run: npm install"
    fi
    
    # Check React
    if [ -d "node_modules/react" ]; then
        echo "✅ React installed"
    else
        echo "❌ React NOT installed"
    fi
    
    # Check React Router
    if [ -d "node_modules/react-router-dom" ]; then
        echo "✅ React Router installed"
    else
        echo "❌ React Router NOT installed"
    fi
else
    echo "❌ node_modules not found"
    echo "   Run: npm install"
fi
echo ""

# Check src files
echo "5. Source files:"
[ -f "src/main.tsx" ] && echo "✅ src/main.tsx" || echo "❌ src/main.tsx missing"
[ -f "src/App.tsx" ] && echo "✅ src/App.tsx" || echo "❌ src/App.tsx missing"
[ -f "src/index.css" ] && echo "✅ src/index.css" || echo "❌ src/index.css missing"
echo ""

# Check config files
echo "6. Config files:"
[ -f "vite.config.ts" ] && echo "✅ vite.config.ts" || echo "❌ vite.config.ts missing"
[ -f "tsconfig.json" ] && echo "✅ tsconfig.json" || echo "❌ tsconfig.json missing"
echo ""

echo "7. Recommendations:"
if [ ! -d "node_modules" ]; then
    echo "   → Run: npm install"
elif [ ! -d "node_modules/tailwindcss" ]; then
    echo "   → Run: npm install"
else
    echo "   → Everything looks good!"
    echo "   → Run: npm run dev"
    echo "   → Open: http://localhost:5173"
fi
echo ""

echo "✅ Check complete!"
