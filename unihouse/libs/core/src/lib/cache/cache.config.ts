export interface CacheRule {
    pattern: RegExp;                // Match URL
    ttl: number;                    // Time to cache in milliseconds
    methods?: string[];             // HTTP method list to cache, default is GET only
    response_statuses?: number[];   // HTTP Response Status, default is all
  }
  
  export const CACHE_RULES: CacheRule[] = [
    { pattern: /0\/env\/type\/?$/, ttl: 60 * 60 * 1000 },
    { pattern: /0\/sr\/[0-9]+\/access\/positions\/[0-9]+\/?$/, ttl: 1 * 10 * 1000 },
  ];
  