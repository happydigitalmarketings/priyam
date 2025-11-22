import connectDB from '../../lib/db';
import Category from '../../models/Category';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Fetch only active categories sorted by order
      const categories = await Category.find({ active: true })
        .sort({ order: 1 })
        .select('name slug description image')
        .lean();

      return res.status(200).json(categories);
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
