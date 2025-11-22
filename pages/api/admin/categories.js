import connectDB from '../../../lib/db';
import Category from '../../../models/Category';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Verify admin for POST, PATCH, DELETE
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
      const cookies = req.headers.cookie || '';
      const token = cookies.split('token=')[1] ? cookies.split('token=')[1].split(';')[0] : null;
      const user = token ? await verifyToken(token) : null;

      if (!user || user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    if (req.method === 'GET') {
      const categories = await Category.find().sort({ order: 1 }).lean();
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const { name, slug: customSlug, description, image, order, active } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      // Generate slug from name if not provided
      const slug = customSlug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      // Check if slug already exists
      const existing = await Category.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: 'Category slug already exists' });
      }

      const category = await Category.create({
        name,
        slug,
        description: description || '',
        image: image || '',
        order: order || 0,
        active: active !== false,
      });

      return res.status(201).json(category);
    }

    if (req.method === 'PATCH') {
      const { id, name, slug, description, image, order, active } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Check if new slug conflicts with existing category
      if (slug && slug !== category.slug) {
        const existing = await Category.findOne({ slug });
        if (existing) {
          return res.status(400).json({ message: 'Slug already in use by another category' });
        }
        category.slug = slug;
      }

      if (name) category.name = name;
      if (description !== undefined) category.description = description;
      if (image !== undefined) category.image = image;
      if (order !== undefined) category.order = order;
      if (active !== undefined) category.active = active;
      category.updatedAt = new Date();

      await category.save();

      return res.status(200).json(category);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }

      await Category.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Category deleted' });
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Category API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
