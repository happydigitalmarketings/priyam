import mongoose from 'mongoose';
import connectDB from '../lib/db.js';
import Category from '../models/Category.js';

const defaultCategories = [
  { name: 'Kasavu Sarees', slug: 'kasavu-sarees', order: 0, active: true },
  { name: 'Set Sarees', slug: 'set-sarees', order: 1, active: true },
  { name: 'Tissue Sarees', slug: 'tissue-sarees', order: 2, active: true },
  { name: 'Handloom Sarees', slug: 'handloom-sarees', order: 3, active: true },
  { name: 'Designer Sarees', slug: 'designer-sarees', order: 4, active: true },
  { name: 'Silk Kasavu Sarees', slug: 'silk-kasavu-sarees', order: 5, active: true },
];

async function migrateCategories() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Categories already exist (${existingCount} total). Skipping migration.`);
      process.exit(0);
    }

    // Insert default categories
    await Category.insertMany(defaultCategories);
    console.log(`✓ Successfully added ${defaultCategories.length} default categories`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCategories();
