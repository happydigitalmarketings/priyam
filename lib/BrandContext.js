import { createContext } from 'react';

const BrandContext = createContext({
  siteName: 'Priyam Supermarket',
  primaryColor: '#8B4513',
  primaryColorDark: '#703810',
  logo: '/images/logo.png',
  slug: null,
});

export default BrandContext;
