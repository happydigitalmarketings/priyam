# Dynamic Categories - Quick Start Guide

## What's New

Categories are now **fully dynamic**! Users can add, edit, and delete categories directly from the admin panel. No more hardcoded category lists.

## Getting Started

### 1. Start Your App
```bash
npm run dev
```

### 2. Access Admin Categories
1. Go to: `http://localhost:3000/admin`
2. Navigate to: **Categories** (new menu item in sidebar)

### 3. Add Your First Category
1. Click **"Add New Category"** button
2. Fill in the form:
   - **Name** - E.g., "Kasavu Sarees" (required)
   - **Slug** - E.g., "kasavu-sarees" (auto-generates if left empty)
   - **Description** - Optional category description
   - **Image** - Upload a category image (optional)
   - **Display Order** - Controls sort order (0, 1, 2, etc.)
   - **Active** - Check to show in product filters

3. Click **"Create Category"**

### 4. Use Categories in Products
When creating/editing products, categories are now fetched from your dynamic category list.

### 5. View in Frontend
- Visit: `http://localhost:3000/products`
- See category buttons that match your admin-defined categories
- Click to filter products by category

## Key Features

✅ **Add Categories** - Create new categories with images  
✅ **Edit Categories** - Update category details  
✅ **Delete Categories** - Remove categories you don't need  
✅ **Sort Categories** - Control display order with order field  
✅ **Image Upload** - Add images to categories via Cloudinary  
✅ **Active/Inactive** - Hide categories without deleting them  
✅ **Responsive** - Works on mobile, tablet, and desktop  

## Default Categories

The system comes with 6 default categories (created automatically):
- Kasavu Sarees
- Set Sarees
- Tissue Sarees
- Handloom Sarees
- Designer Sarees
- Silk Kasavu Sarees

You can edit or delete these anytime from the admin panel.

## File Structure

```
models/
  └── Category.js (new) - Database schema for categories

pages/
  admin/
    └── categories.js (new) - Admin dashboard for managing categories
  api/
    admin/
      └── categories.js (new) - API for category CRUD operations

scripts/
  └── migrate-categories.js (new) - Optional: seed default categories

components/
  └── AdminLayout.js (updated) - Added Categories menu item
```

## API Endpoints

### Create Category
```
POST /api/admin/categories
Body: {
  name: "My Category",
  slug: "my-category",
  description: "Description",
  image: "https://...",
  order: 0,
  active: true
}
```

### Get All Categories
```
GET /api/admin/categories
```

### Update Category
```
PATCH /api/admin/categories
Body: {
  id: "category_id",
  name: "Updated Name",
  ... other fields
}
```

### Delete Category
```
DELETE /api/admin/categories
Body: { id: "category_id" }
```

## Frontend Integration

Both the public products page and admin product management page now:
- Fetch categories dynamically from the API
- Display only active categories
- Sort by order field
- Filter products based on selected category

## Troubleshooting

### Categories not showing?
1. Check admin panel → Categories
2. Ensure categories have `active: true`
3. Refresh the products page

### Image upload not working?
1. Verify Cloudinary credentials in `.env.local`
2. Check browser console for errors
3. Ensure image file is under 10MB

### Default categories not showing?
1. Categories are created automatically on first use
2. Or manually add via admin panel
3. To seed: `node scripts/migrate-categories.js` (requires env vars)

## Next Steps

1. ✅ **Add categories** from admin panel
2. ✅ **Upload images** to make categories visual
3. ✅ **Assign products** to categories when creating products
4. ✅ **Test filtering** on products page
5. ✅ **Adjust order** to customize display sequence

Enjoy your dynamic category system! 🎉
