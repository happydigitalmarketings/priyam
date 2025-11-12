import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import Header from '../../components/Header';

export default function ProductPage({ product }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  function addToCart(){
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const existing = cart.find(i=>i.product._id===product._id);
    if(existing){ existing.qty += 1; } else { cart.push({ product, qty:1, price: product.price }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/cart');
  }
  return (
    <div>
      <Head><title>{product.title} - MyStore</title></Head>
    
      <main className="max-w-4xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-6 bg-white rounded shadow p-6">
          <div className="flex items-center justify-center bg-gray-100 h-80">{product.images?.[0] ? <img src={product.images[0]} alt={product.title} /> : 'No image'}</div>
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 text-2xl font-semibold">₹{product.price}</div>
            <button onClick={addToCart} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
          </div>
        </div>
      </main>
    </div>
  );
}
export async function getStaticPaths() {
  const connectDB = (await import('../../lib/db')).default;
  const Product = (await import('../../models/Product')).default;
  
  try {
    await connectDB();
    const products = await Product.find({}, 'slug');
    const paths = products.map(product => ({
      params: { slug: product.slug }
    }));
    
    return {
      paths,
      fallback: true
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: true
    };
  }
}

export async function getStaticProps({ params }) {
  const connectDB = (await import('../../lib/db')).default;
  const Product = (await import('../../models/Product')).default;
  
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug });
    
    if (!product) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product))
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true
    };
  }
}
