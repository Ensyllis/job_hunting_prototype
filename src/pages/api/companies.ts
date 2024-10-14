import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let cachedClient: MongoClient;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return cachedClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await connectToDatabase();
    const db = client.db('JobHuntPipeline');
    const collection = db.collection('data');
    const companies = await collection.find({}).toArray();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
