#!/bin/sh
set -e

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

# Announce public address (if configured)
if [ -n "$SWARM_PORT" ] && [ -n "$SWARM_DOMAIN" ]; then
  ipfs config --json Addresses.AppendAnnounce '["/dns4/'"$SWARM_DOMAIN"'/tcp/'"$SWARM_PORT"'"]'
  echo "Announcing swarm address: /dns4/$SWARM_DOMAIN/tcp/$SWARM_PORT"
fi

# Add website to IPFS
echo "Adding website to IPFS..."
CID=$(ipfs add --recursive --quieter --cid-version=1 /data/dist)
echo "Website added with CID: $CID"

# Pin the content
echo "Pinning content..."
ipfs pin add "$CID"
echo "Content pinned successfully."

# Publish to IPNS using default identity key
echo "Publishing to IPNS..."
ipfs name publish /ipfs/$CID --allow-offline
