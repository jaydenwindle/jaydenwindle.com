#!/bin/sh
set -e

# Disable fetching content for arbitrary CIDs
ipfs config --json Gateway.NoFetch true

# Disable DNSLink resolution globally
ipfs config --json Gateway.NoDNSLink true

# Enable DNSLink for jaydenwindle.com and allow IPFS/IPNS on all domains
ipfs config --json Gateway.PublicGateways '{
  "jaydenwindle.com": {
    "NoDNSLink": false,
    "Paths": []
  }
}'

# Import identity key if file exists
if [ -f "/data/ipfs/ipfs-identity-key.pem" ]; then
  ipfs key import self -f pem-pkcs8-cleartext /ipfs-identity-key.pem
fi

# Configure deployer auth for API endpoints if provided
if [ -n "$IPFS_API_AUTH_TOKEN" ]; then
  ipfs config --json API.Authorizations '{
    "deployer": {
      "AuthSecret": "bearer:'"$IPFS_API_AUTH_TOKEN"'",
      "AllowedPaths": [
        "/api/v0/name/publish",
        "/api/v0/name/resolve",
        "/api/v0/dag/import"
      ]
    }
  }'
fi
