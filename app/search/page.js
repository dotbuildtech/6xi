import SearchClient from './SearchClient';
import { getProducts } from '../../lib/commerce';
export default async function Search({searchParams}){
  const params = await searchParams; const products=await getProducts(80);
  return <SearchClient products={products} initialQuery={params?.q || ''}/>;
}
