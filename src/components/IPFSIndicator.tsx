import React, { useState, useEffect } from 'react';

const IPFSIndicator: React.FC = () => {
  const [cid, setCid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    // Resolve IPNS name to CID
    const resolveIPNS = async (ipnsName: string) => {
      setIsResolving(true);
      try {
        // Try to resolve using a public IPFS gateway
        const response = await fetch(`https://ipfs.io/api/v0/name/resolve?arg=${ipnsName}`);
        const data = await response.json();

        if (data.Path) {
          // Extract CID from the resolved path
          const resolvedCid = data.Path.replace('/ipfs/', '').split('/')[0];
          setCid(resolvedCid);
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

        // Check for x-ipfs-path header (could be /ipfs/CID or /ipns/name)
        const ipfsPath = response.headers.get('x-ipfs-path');

        // Check for x-ipfs-hash header as fallback
        const ipfsHashHeader = response.headers.get('x-ipfs-hash');

        if (ipfsPath) {
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
      <div className="font-mono text-neutral-600 opacity-40 text-center">
        <span className="text-neutral-500">resolving ipns...</span>
      </div>
    );
  }

  if (cid) {
    const truncatedCid = `${cid.slice(0, 4)}...${cid.slice(-4)}`;

    return (
      <div className="font-mono text-neutral-600 opacity-40 text-center w-full">
        <span>ipfs:</span>{' '}
        <a
          href={`https://ipfs.io/ipfs/${cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-400 hover:opacity-60"
        >
          {truncatedCid}
        </a>
      </div>
    );
  }
};

export default IPFSIndicator;
