#!/bin/sh
set -e

# Configure access restrictions (if accessing via DNSLink)
if [ -n "$DNSLINK_DOMAIN" ]; then
  # Disable fetching content for arbitrary CIDs
  ipfs config --json Gateway.NoFetch true

  # Disable DNSLink resolution globally
  ipfs config --json Gateway.NoDNSLink true

  # Enable DNSLink for domain
  ipfs config --json Gateway.PublicGateways '{
    "'"$DNSLINK_DOMAIN"'": {
      "NoDNSLink": false,
      "Paths": [],
    }
  }'
fi

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

if [ -n "$IPNS_PUBLISH_KEY_NAME" ]; then
  # Import IPNS key
  if [ -n "$IPNS_PUBLISH_KEY" ] && [ "$IPNS_PUBLISH_KEY_NAME" != "self" ]; then
    KEY_FILE="/tmp/ipns-key.pem"
    echo "$IPNS_PUBLISH_KEY" >"$KEY_FILE"
    ipfs key import "$IPNS_PUBLISH_KEY_NAME" -f pem-pkcs8-cleartext "$KEY_FILE" || :
    rm "$KEY_FILE"
  fi

  # Publish to IPNS
  ipfs name publish --key="$IPNS_PUBLISH_KEY_NAME" /ipfs/$CID --allow-offline
fi
