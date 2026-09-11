# TERMINAL ACCEPTANCE COMMANDS (cURL & AST)
1. Single H1 Test:
curl -sL "https://skdmhesapla.com/" | grep -E -o "<h1[^>]*>.*?</h1>" | wc -l

2. Canonical Test:
curl -sL "https://skdmhesapla.com/" | grep -E -i '<link[^>]+rel=["\x27]canonical["\x27]'

3. Sub-14KB AST Budget Test:
curl -s -A "GPTBot" "https://skdmhesapla.com/" | wc -c
