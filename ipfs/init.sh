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

# Configure auth for API endpoints
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
