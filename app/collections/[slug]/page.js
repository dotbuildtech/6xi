import { notFound } from 'next/navigation';
import CollectionClient from './CollectionClient';
import { getCollection } from '../../../lib/commerce';
export default async function CollectionPage({params}){
  const {slug}=await params; const collection=await getCollection(slug); if(!collection)notFound();
  return <CollectionClient initial={collection.products || []} title={collection.title}/>;
}
