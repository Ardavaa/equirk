// Authentication configuration for Internet Identity
export const AUTH_CONFIG = {
  // Internet Identity provider URLs
  IDENTITY_PROVIDER: {
    // For local development (when running dfx locally)
    local: 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943',
    // For production (Internet Computer mainnet)
    production: 'https://identity.ic0.app',
    // For IC testnet
    testnet: 'https://identity.ic0.app'
  },
  
  // Get the appropriate identity provider based on environment
  getIdentityProvider: () => {
    // For now, always use production Internet Identity
    // This avoids the need to run local dfx with Internet Identity canister
    return AUTH_CONFIG.IDENTITY_PROVIDER.production;
    
    // Uncomment below if you want to use local II when dfx is running
    // const hostname = window.location.hostname;
    // if (hostname === 'localhost' || hostname === '127.0.0.1') {
    //   return AUTH_CONFIG.IDENTITY_PROVIDER.local;
    // } else {
    //   return AUTH_CONFIG.IDENTITY_PROVIDER.production;
    // }
  },
  
  // Session timeout (in nanoseconds) - 8 hours
  MAX_TIME_TO_LIVE: BigInt(8 * 60 * 60 * 1000 * 1000 * 1000),
  
  // Idle timeout (in milliseconds) - 30 minutes
  IDLE_TIMEOUT: 30 * 60 * 1000,
}; 