import React, { useState, useEffect } from 'react';

const IPFSIndicator: React.FC = () => {
  const [cid, setCid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    // Resolve IPNS name to CID by following the gateway redirect
    const resolveIPNS = async (ipnsName: string) => {
      setIsResolving(true);
      try {
        // Use the IPFS gateway to get the x-ipfs-roots header
        const response = await fetch(`https://ipfs.io/ipns/${ipnsName}?format=raw`, {
          method: 'HEAD',
          redirect: 'manual'
        });

        // Check the x-ipfs-roots header from the response
        const ipfsRoots = response.headers.get('x-ipfs-roots');

        if (ipfsRoots) {
          // The header contains a comma-separated list of CIDs, take the first one
          const resolvedCid = ipfsRoots.split(',').at(0)?.trim();
          if (resolvedCid) {
            setCid(resolvedCid);
          }
        }
      } catch (error) {
        console.error('Error resolving IPNS name:', error);
      } finally {
        setIsResolving(false);
      }
    };

    // Check if the page is hosted on IPFS by looking for IPFS headers
    const checkIPFSHost = async () => {
      try {
        // Fetch the current page to read headers
        const response = await fetch(window.location.href, {
          method: 'HEAD',
        });

        // Check for x-ipfs-roots header first (contains the CID directly)
        const ipfsRootsHeader = response.headers.get('x-ipfs-roots');

        // Check for x-ipfs-path header (could be /ipfs/CID or /ipns/name)
        const ipfsPath = response.headers.get('x-ipfs-path');

        // Check for x-ipfs-hash header as fallback
        const ipfsHashHeader = response.headers.get('x-ipfs-hash');

        if (ipfsRootsHeader) {
          // Use roots header - take the first CID
          const rootCid = ipfsRootsHeader.split(',').at(0)?.trim();
          if (rootCid) {
            setCid(rootCid);
          }
        } else if (ipfsPath) {
          // Parse the IPFS path
          if (ipfsPath.startsWith('/ipfs/')) {
            // Direct CID
            const cidValue = ipfsPath.replace('/ipfs/', '').split('/')[0];
            setCid(cidValue);
          } else if (ipfsPath.startsWith('/ipns/')) {
            // IPNS name - need to resolve it
            const ipnsValue = ipfsPath.replace('/ipns/', '').split('/')[0];
            resolveIPNS(ipnsValue);
          }
        } else if (ipfsHashHeader) {
          // Fallback to hash header
          setCid(ipfsHashHeader);
        }
      } catch (error) {
        console.error('Error checking IPFS headers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIPFSHost();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!cid && !isResolving) {
    return null;
  }

  if (isResolving) {
    return (
      <div className="font-mono text-neutral-700 opacity-40 text-center">
        <span className="text-neutral-500">resolving ipns...</span>
      </div>
    );
  }

  if (cid) {
    const truncatedCid = `${cid.slice(0, 4)}...${cid.slice(-4)}`;

    return (
      <div className="font-mono text-neutral-700 opacity-40 text-center w-full">
        <span>ipfs:</span>{' '}
        <a
          href={`https://ipfs.io/ipfs/${cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-neutral-100 hover:text-neutral-900"
        >
          {truncatedCid}
        </a>
      </div>
    );
  }
};

export default IPFSIndicator;
