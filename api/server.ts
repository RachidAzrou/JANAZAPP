// api/server.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Basic health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    res.status(200).json({ status: 'ok', message: 'JanazApp API is running' });
    return;
  }

  // Handle other API routes here as needed
  res.status(200).json({
    message: 'JanazApp API',
    method: req.method,
    url: req.url,
  });
}
