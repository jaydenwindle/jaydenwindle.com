#!/bin/sh
set -e

echo "Starting IPFS configuration..."

# Disable fetching content for arbitrary CIDs
ipfs config --json Gateway.NoFetch true

# Disable DNSLink resolution globally
ipfs config --json Gateway.NoDNSLink true

# Enable DNSLink for domain
ipfs config --json Gateway.PublicGateways '{
  "'"$DOMAIN"'": {
    "NoDNSLink": false,
    "Paths": []
  }
}'

echo "IPFS configuration complete."

# Add website to IPFS
echo "Adding website to IPFS..."
CID=$(ipfs add -r -Q /data/website)
echo "Website added with CID: $CID"

# Pin the content
echo "Pinning content..."
ipfs pin add "$CID"
echo "Content pinned successfully."

# Publish to IPNS using default identity key
echo "Publishing to IPNS..."
IPNS_OUTPUT=$(ipfs name publish /ipfs/$CID --allow-offline)
IPNS_NAME=$(echo "$IPNS_OUTPUT" | ipfs cid format -v 1 -b base36)

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
echo "CID: $CID"
echo "IPNS: $IPNS_NAME"
echo "=========================================="
