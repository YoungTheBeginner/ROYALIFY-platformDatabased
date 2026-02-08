import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import products from '../data/products';
import ProductCard from './ProductCard';
import API from '../api';
import { formatCurrency } from '../utils/currency';

const hashSeed = (value) => {
  if (!value) return 0;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getLuxuryPrice = (record) => {
  const seedSource = record?.id || record?.name || 'royalify';
  const seed = hashSeed(String(seedSource));
  const normalized = (seed % 1000) / 1000;
  return 1000000 + Math.round(normalized * 900000);
};

export default function ProductList(){
  const [animateCards, setAnimateCards] = useState(false);
  const [catalog, setCatalog] = useState(products);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    setAnimateCards(true);
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    let isMounted = true;

    const adaptProduct = (record) => {
      if (!record) return null;
      const currency = record.currency || 'USD';
      const price = getLuxuryPrice(record);
      const description = record.descLong || record.desc || record.descShort || '';
      const descShort = record.descShort || (description ? `${description.slice(0, 180)}${description.length > 180 ? '...' : ''}` : '');

      return {
        ...record,
        price,
        currency,
        descShort,
        descLong: description || descShort,
        priceDisplay: formatCurrency(price, { currency })
      };
    };

    const fetchCatalog = async () => {
      const staticCatalog = products
        .map(adaptProduct)
        .filter(Boolean);
      try {
        const response = await API.get('/products');
        if (!isMounted) return;
        if (Array.isArray(response.data)) {
          const hydrated = response.data
            .filter(item => item?.published !== false)
            .map(adaptProduct)
            .filter(Boolean);
          if (hydrated.length > 0) {
            const dedupedStatic = staticCatalog.filter(staticItem =>
              !hydrated.some(liveItem => liveItem.id === staticItem.id)
            );
            setCatalog([...hydrated, ...dedupedStatic]);
          } else {
            setCatalog(staticCatalog);
          }
          setCatalogError('');
        } else {
          setCatalog(staticCatalog);
          setCatalogError('');
        }
      } catch (error) {
        console.error('Failed to fetch live products:', error);
        if (!isMounted) return;
        setCatalog(products
          .map(adaptProduct)
          .filter(Boolean));
        setCatalogError('We could not reach the live catalog. Showing curated showcase items.');
      } finally {
        if (isMounted) {
          setLoadingCatalog(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let working = catalog;

    if (categoryFilter) {
      working = working.filter(p => p.category === categoryFilter);
    }

    if (searchQuery.trim() !== '') {
      const needle = searchQuery.toLowerCase();
      working = working.filter(p =>
        p.name.toLowerCase().includes(needle) ||
        (p.descShort && p.descShort.toLowerCase().includes(needle)) ||
        (p.descLong && p.descLong.toLowerCase().includes(needle)) ||
        (p.tags && p.tags.toLowerCase().includes(needle))
      );
    }

    return working;
  }, [catalog, categoryFilter, searchQuery]);

  const getCategoryTitle = (cat) => {
    const categories = {
      sword: '⚔️ Swords',
      headgear: '👑 Headgear',
      book: '📖 Books',
      crown: '💎 Crowns',
      armor: '🛡️ Armor',
      cape: '🦸 Capes',
      staff: '🪄 Staffs',
      glove: '🧤 Gloves',
      ring: '💍 Rings',
      orb: '🔮 Orbs'
    };
    return categories[cat] || 'All Items';
  };

  return (
    <div className="container page-enter">
      {catalogError && (
        <div className="catalog-alert" role="status">
          {catalogError}
        </div>
      )}
      <div style={{textAlign:'center', marginBottom: 40, animation: 'fadeUp 0.8s ease-out'}}>
        <h2 style={{color:"var(--royal-gold)", fontSize: '2.2rem', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.3px'}}>
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : categoryFilter 
              ? getCategoryTitle(categoryFilter)
              : 'The Emporium'}
        </h2>
        <p style={{opacity:.85, fontSize: '1.05rem', letterSpacing: '-0.1px'}}>
          {filteredProducts.length === 0 
            ? 'No artifacts found'
            : `${filteredProducts.length} artifact${filteredProducts.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {loadingCatalog ? (
        <div style={{textAlign: 'center', padding: '80px 20px', opacity: 0.7}}>
          <p style={{fontSize: '1.05rem'}}>Summoning the royal catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px', opacity: 0.7}}>
          <p style={{fontSize: '1.1rem', marginBottom: 20}}>No artifacts found matching your search.</p>
          <p style={{fontSize: '0.95rem', opacity: 0.8}}>Try different keywords or browse all our treasures.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((p, idx) => (
          <div 
            key={p.id} 
            style={{
              opacity: animateCards ? 1 : 0,
              animation: animateCards ? `fadeUp 0.6s ease-out ${idx * 0.08}s forwards` : 'none'
            }}
          >
            <ProductCard product={p} />
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

