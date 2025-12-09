import { connectDB } from '../lib/db';
import Product from '../models/Product';
import Category from '../models/Category';

function generateSiteMap(products, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      <url>
        <loc>https://www.minukkisarees.com</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://www.minukkisarees.com/products</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.minukkisarees.com/about</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>https://www.minukkisarees.com/contact</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>https://www.minukkisarees.com/blog</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- Product URLs -->
      ${products
        .map(({ slug, updatedAt }) => {
          return `
      <url>
        <loc>${`https://www.minukkisarees.com/product/${slug}`}</loc>
        <lastmod>${updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
        })
        .join('')}

      <!-- Category URLs -->
      ${categories
        .map(({ name }) => {
          const slug = name.toLowerCase().replace(/\s+/g, '-');
          return `
      <url>
        <loc>${`https://www.minukkisarees.com/products?category=${slug}`}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
        })
        .join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  try {
    // Note: You may need to adjust this based on your actual DB connection setup
    const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
    const categories = await Category.find({}, { name: 1 }).lean();

    const sitemap = generateSiteMap(products || [], categories || []);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://www.minukkisarees.com</loc>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://www.minukkisarees.com/products</loc>
          <priority>0.9</priority>
        </url>
      </urlset>
    `;
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(basicSitemap);
    res.end();

    return {
      props: {},
    };
  }
}

export default function Sitemap() {
  return null;
}
