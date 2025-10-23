#!/bin/sh
set -e

# Disable fetching content for arbitrary CIDs
ipfs config --json Gateway.NoFetch true

# Disable DNSLink resolution globally
ipfs config --json Gateway.NoDNSLink true

# Enable DNSLink for jaydenwindle.com
ipfs config --json Gateway.PublicGateways '{"jaydenwindle.com": {"NoDNSLink": false, "Paths": []}}'

# Set identity PrivKey from environment variable if provided
if [ -n "$IPFS_IDENTITY_PRIVKEY" ]; then
  ipfs config Identity.PrivKey "$IPFS_IDENTITY_PRIVKEY"
fi

# Configure deployer auth for API endpoints if provided
if [ -n "$IPFS_API_AUTH_TOKEN" ]; then
  ipfs config --json API.Authorizations '{
    "deployer": {
      "AuthSecret": "bearer:'"$IPFS_API_AUTH_TOKEN"'",
      "AllowedPaths": [
        "/api/v0/name/publish",
        "/api/v0/dag/import"
      ]
    }
  }'
fi
