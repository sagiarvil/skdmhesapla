#!/bin/bash
echo "=== MANDATE V9.0 LLMO/SEO/MOBILE-FIRST AUDIT ==="
echo ""

FAIL=0

echo "1. Checking LLMS.txt size and fragmentation..."
SIZE=$(stat -f%z public/llms.txt 2>/dev/null || echo 0)
if [ "$SIZE" -gt 25000 ]; then
    echo "❌ public/llms.txt is too large ($SIZE bytes). Should be a hub, not a monolithic file."
    FAIL=1
else
    echo "✅ public/llms.txt size is acceptable ($SIZE bytes)."
fi

echo "2. Checking for legacy llms-*.txt files in public/..."
LEGACY=$(ls public/llms-*.txt 2>/dev/null | wc -l)
if [ "$LEGACY" -gt 0 ]; then
    echo "❌ Legacy llms-*.txt files found in public/:"
    ls public/llms-*.txt
    FAIL=1
else
    echo "✅ No legacy llms-*.txt files found."
fi

echo "3. Checking Multi-Tier structure..."
for dir in "public/llms/core.md" "public/llms/entities" "public/llms/pages" "public/llms/mobile"; do
    if [ ! -e "$dir" ]; then
        echo "❌ Missing directory/file: $dir"
        FAIL=1
    else
        echo "✅ Found: $dir"
    fi
done

echo "4. Checking SSOT setup..."
if [ ! -f "src/seo/registry.types.ts" ]; then
    echo "❌ Missing src/seo/registry.types.ts"
    FAIL=1
else
    echo "✅ Found src/seo/registry.types.ts"
fi

if [ ! -f "src/seo/registry.ts" ]; then
    echo "❌ Missing src/seo/registry.ts (SSOT)"
    FAIL=1
else
    echo "✅ Found src/seo/registry.ts"
fi

if [ ! -f "src/seo/schema-builder.ts" ]; then
    echo "❌ Missing src/seo/schema-builder.ts (14KB First-Packet Generator)"
    FAIL=1
else
    echo "✅ Found src/seo/schema-builder.ts"
fi

echo "5. Checking Triple-Push Scripts..."
if [ ! -f "scripts/notify-instant-push.js" ]; then
    echo "❌ Missing scripts/notify-instant-push.js"
    FAIL=1
else
    echo "✅ Found scripts/notify-instant-push.js"
fi

echo ""
if [ $FAIL -eq 1 ]; then
    echo "🚨 AUDIT FAILED: Mandate V9.0 rules are violated. Please fix the missing components."
else
    echo "✅ AUDIT PASSED: Mandate V9.0 rules are satisfied."
fi
