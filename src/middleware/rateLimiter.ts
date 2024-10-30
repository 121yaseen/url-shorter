import { Request, Response, NextFunction } from "express";

interface Bucket {
  ip: string;
  tokenCount: number;
  lastUpdated: number;
}

class IpRateLimiter {
  bucketSize = 2;
  tokenRefreshTimeInterval = 1 * 60000; // in milliseconds
  buckets: Record<string, Bucket> = {};

  private getOrCreateBucket(ip: string): Bucket {
    const now = Date.now();
    let bucket = this.buckets[ip];

    if (!bucket) {
      bucket = { ip, tokenCount: this.bucketSize, lastUpdated: now };
      this.buckets[ip] = bucket;
    } else if (now - bucket.lastUpdated >= this.tokenRefreshTimeInterval) {
      bucket.tokenCount = this.bucketSize;
      bucket.lastUpdated = now;
    }
    return bucket;
  }

  ipLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //   const ip = req.ip || req.socket.remoteAddress;
    const ip = req.method == "GET" ? req.query.ip : req.body.ip;
    if (!ip) {
      res.status(400).send("IP is required");
      return;
    }

    let bucket: Bucket = this.getOrCreateBucket(ip);

    if (bucket.tokenCount <= 0) {
      res.status(429).send("Too many requests");
      return;
    }

    bucket.tokenCount -= 1;
    next();
  };
}

export default new IpRateLimiter();
