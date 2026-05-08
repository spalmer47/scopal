import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { FIRM } from '../lib/constants';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: `${FIRM.legalName} — Insights`,
    description: 'Legal insights for SaaS founders from Scott A. Palmer, fractional general counsel.',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
