#!/bin/bash

echo "🔍 Checking Node.js installation..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
    echo "   Version: $(node --version)"
else
    echo "❌ Node.js is NOT installed"
    echo "   Please install from: https://nodejs.org/"
fi

echo ""

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm is installed"
    echo "   Version: $(npm --version)"
else
    echo "❌ npm is NOT installed"
fi

echo ""

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    echo "   Make sure you're in the project directory"
fi

echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists (dependencies installed)"
else
    echo "⚠️  node_modules not found"
    echo "   Run: npm install"
fi

echo ""
echo "📋 Next steps:"
echo "   1. If Node.js is not installed, install it from https://nodejs.org/"
echo "   2. Run: npm install"
echo "   3. Run: npm run dev"
