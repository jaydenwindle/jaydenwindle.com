#!/bin/sh
set -ex

# Disable fetching content for arbitrary CIDs
ipfs config --json Gateway.NoFetch true

# Disable DNSLink resolution globally
ipfs config --json Gateway.NoDNSLink true

# Enable DNSLink for yourdomain.com
ipfs config --json Gateway.PublicGateways '{"jaydenwindle.com": {"NoDNSLink": false, "Paths": []}}'

# Set identity PrivKey from environment variable if provided
if [ -n "$IPFS_IDENTITY_PRIVKEY" ]; then
  ipfs config Identity.PrivKey "$IPFS_IDENTITY_PRIVKEY"
fi
