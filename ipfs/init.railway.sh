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

# Announce public address for peers behind proxy/NAT
SWARM_PORT="${SWARM_PORT:-4001}"
SWARM_DOMAIN="${SWARM_DOMAIN:-$DOMAIN}"
ipfs config --json Addresses.AppendAnnounce '["/dns4/'"$SWARM_DOMAIN"'/tcp/'"$SWARM_PORT"'"]'

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
ipfs name publish /ipfs/$CID --allow-offline
