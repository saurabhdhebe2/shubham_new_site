import ClientShell from './ClientShell';
import { getVideosByCategory } from '@/lib/youtube';
import { STATIC_PROJECTS } from '@/lib/data';

export const revalidate = 3600;

export default async function Page() {
  const videos = await getVideosByCategory('all');
  return <ClientShell videos={videos.length ? videos : STATIC_PROJECTS} />;
}
