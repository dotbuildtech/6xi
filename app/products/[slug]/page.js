import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import ProductGrid from '../../../components/ProductGrid';
import Reviews from '../../../components/Reviews';
import { getProduct, getRecommendations } from '../../../lib/commerce';
export default async function ProductPage({params}){
  const {slug}=await params; const product=await getProduct(slug); if(!product)notFound();
  const more=await getRecommendations(product.id, slug);
  return <><ProductClient product={product}/><section className="recommendations"><div className="section-head"><h2>You may also like</h2></div><ProductGrid products={more}/></section><Reviews product={product}/></>
}
