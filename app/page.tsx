import HomeClient from '@/app/HomeClient';
import { getLinkCategories } from '@/lib/links';

export default async function Home() {
  const categories = await getLinkCategories();

  return <HomeClient categories={categories} />;
}
