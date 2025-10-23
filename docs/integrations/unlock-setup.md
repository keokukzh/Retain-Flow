# Unlock Protocol Integration Setup

## Overview

Unlock Protocol is a decentralized membership protocol built on Ethereum that enables creators to monetize their content through NFT-based memberships. This integration allows RetainFlow to offer Web3-native membership options and token-gated content.

## Prerequisites

- Ethereum wallet (MetaMask, WalletConnect, etc.)
- Unlock Protocol account
- Polygon network access (recommended for lower gas fees)
- Basic understanding of Web3 concepts

## Installation

### 1. Set up Unlock Protocol

#### Option A: Use Existing Locks
1. Browse [Unlock Protocol](https://unlock-protocol.com)
2. Find existing locks for your use case
3. Note the lock address and network

#### Option B: Create New Lock
1. Go to [Unlock Dashboard](https://app.unlock-protocol.com)
2. Connect your wallet
3. Create a new lock
4. Configure pricing and duration
5. Deploy to your preferred network

### 2. Configure Network

Recommended networks:
- **Polygon**: Low gas fees, fast transactions
- **Ethereum**: Mainnet, higher gas fees
- **Arbitrum**: Layer 2, lower fees than Ethereum

### 3. Configure RetainFlow

Add the following environment variables:

```bash
# Unlock Protocol Configuration
UNLOCK_NETWORK=polygon
UNLOCK_PROVIDER_URL=https://rpc.unlock-protocol.com
```

## Usage

### Membership Verification

Check if a user has an active membership:

```javascript
import { UnlockService } from '@/services/unlock.service';

// Verify membership
const hasMembership = await UnlockService.hasActiveMembership(
  userAddress,
  lockAddress
);

if (hasMembership) {
  // Grant access to premium content
} else {
  // Show upgrade prompt
}
```

### API Endpoints

#### Verify Membership
```bash
POST /api/integrations/unlock/verify
{
  "userAddress": "0x123...",
  "lockAddress": "0x456...",
  "network": "polygon"
}
```

#### Get Available Locks
```bash
GET /api/integrations/unlock/locks?network=polygon
```

## Use Cases

### 1. Token-Gated Content

Restrict access to premium content based on NFT ownership:

```javascript
// Check membership before showing content
const hasAccess = await UnlockService.hasActiveMembership(
  userAddress,
  premiumContentLock
);

if (hasAccess) {
  // Show premium content
  renderPremiumContent();
} else {
  // Show upgrade prompt
  renderUpgradePrompt();
}
```

### 2. Exclusive Community Access

Provide access to exclusive Discord channels or forums:

```javascript
// Verify membership for Discord role
const hasMembership = await UnlockService.hasActiveMembership(
  userAddress,
  communityLock
);

if (hasMembership) {
  // Assign VIP role in Discord
  await discordService.assignRole(userId, 'VIP');
}
```

### 3. Premium Features

Unlock advanced features for NFT holders:

```javascript
// Check for premium features access
const hasPremiumAccess = await UnlockService.hasActiveMembership(
  userAddress,
  premiumFeaturesLock
);

if (hasPremiumAccess) {
  // Enable premium features
  enablePremiumFeatures(userId);
}
```

## Smart Contract Integration

### Lock Contract ABI

```javascript
const lockABI = [
  {
    "inputs": [{"name": "keyOwner", "type": "address"}],
    "name": "getHasValidKey",
    "outputs": [{"name": "isValid", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "keyExpirationTimestampFor",
    "outputs": [{"name": "timestamp", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];
```

### Web3 Provider Setup

```javascript
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  process.env.UNLOCK_PROVIDER_URL
);

const lockContract = new ethers.Contract(
  lockAddress,
  lockABI,
  provider
);
```

## Frontend Integration

### Wallet Connection

```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Membership Check Component

```tsx
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function MembershipGate({ lockAddress, children }) {
  const { address } = useAccount();
  const [hasMembership, setHasMembership] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      checkMembership();
    }
  }, [address]);

  const checkMembership = async () => {
    try {
      const response = await fetch('/api/integrations/unlock/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          lockAddress: lockAddress
        })
      });
      
      const data = await response.json();
      setHasMembership(data.hasMembership);
    } catch (error) {
      console.error('Error checking membership:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Checking membership...</div>;
  
  if (!hasMembership) {
    return (
      <div>
        <h2>Premium Content</h2>
        <p>You need a membership to access this content.</p>
        <button onClick={() => window.open(`https://app.unlock-protocol.com/locks/${lockAddress}`, '_blank')}>
          Get Membership
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Best Practices

### Security
- Verify membership on both frontend and backend
- Use multiple signature verification
- Implement proper error handling
- Monitor for suspicious activity

### User Experience
- Provide clear upgrade paths
- Show membership benefits
- Handle wallet connection gracefully
- Offer alternative payment methods

### Performance
- Cache membership status
- Use batch verification when possible
- Implement proper loading states
- Optimize for mobile wallets

## Troubleshooting

### Common Issues

1. **Wallet not connecting**
   - Check if wallet is installed
   - Verify network configuration
   - Ensure proper RPC endpoints

2. **Membership verification failing**
   - Check lock address and network
   - Verify user has valid key
   - Check key expiration

3. **Transaction failures**
   - Ensure sufficient gas fees
   - Check network congestion
   - Verify wallet has enough ETH

### Debug Mode

Enable debug logging:
```javascript
// In Unlock service
console.log('Unlock request:', { userAddress, lockAddress, network });
console.log('Unlock response:', result);
```

### Support

- [Unlock Protocol Documentation](https://docs.unlock-protocol.com)
- [Unlock Protocol Discord](https://discord.gg/unlock-protocol)
- [RetainFlow Support](mailto:support@aidevelo.ai)
