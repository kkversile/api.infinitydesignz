// src/common/utils/category-slug.util.ts
import type { PrismaClient } from '@prisma/client';
import slugifyLib from 'slugify';

const slugify = (s: string) => slugifyLib(s, { lower: true, strict: true });

export interface SlimCategory { id: number; title: string; parentId: number | null; }

/**
 * Walks up parents and returns ancestors (root...parent) + self
 */
export async function fetchChain(
  prisma: PrismaClient,
  cat: SlimCategory
): Promise<SlimCategory[]> {
  const chain: SlimCategory[] = [];
  let cur: SlimCategory | null = cat;
  while (cur) {
    chain.push(cur);
    if (!cur.parentId) break;
    const parent = await prisma.category.findUnique({
      where: { id: cur.parentId },
      select: { id: true, title: true, parentId: true },
    });
    cur = parent as SlimCategory | null;
  }
  return chain.reverse(); // root ... self
}

/**
 * Build the path you want:
 * - For root:           /<rootTitle>-<id>
 * - For second level:   /<rootTitle>/<subTitle>-<id>
 * - For third level:    /<root>/<sub>/<list>-<id>
 * Rules: only the LAST segment gets "-<id>"
 */
export function buildCategoryPathFromChain(chain: SlimCategory[]): string {
  if (!chain.length) return '/';
  const parts = chain.map((c) => slugify(c.title));
  // append "-id" on last segment only
  const lastIdx = parts.length - 1;
  parts[lastIdx] = `${parts[lastIdx]}-${chain[lastIdx].id}`;
  return '/' + parts.join('/');
}

/**
 * Convenience: from a full SlimCategory, fetch parents and return slug path.
 */
export async function buildCategorySlugFor(
  prisma: PrismaClient,
  cat: SlimCategory
): Promise<string> {
  const chain = await fetchChain(prisma, cat);
  return buildCategoryPathFromChain(chain);
}

/**
 * Batched builder when you already have MANY categories loaded:
 * Provide a map so we don't re-hit DB for each ancestor.
 */
export function buildCategorySlugFromMap(
  id: number,
  map: Map<number, SlimCategory>
): string {
  const chain: SlimCategory[] = [];
  let cur = map.get(id) || null;
  while (cur) {
    chain.push(cur);
    cur = cur.parentId ? map.get(cur.parentId) || null : null;
  }
  chain.reverse();
  return buildCategoryPathFromChain(chain);
}

/**
 * Build the full slug chain for a category ID:
 *  - /main-<id>
 *  - /main/sub-<id>
 *  - /main/sub/list-<id>
 */
export async function buildSlugFromId(
  prisma: PrismaClient,
  id: number
): Promise<string> {
  const chain: Array<{ id: number; title: string; parentId: number | null }> = [];
  let cur = await prisma.category.findUnique({
    where: { id },
    select: { id: true, title: true, parentId: true },
  });

  while (cur) {
    chain.push(cur);
    if (!cur.parentId) break;
    cur = await prisma.category.findUnique({
      where: { id: cur.parentId },
      select: { id: true, title: true, parentId: true },
    });
  }

  chain.reverse();
  const parts = chain.map((c) => slugify(c.title));
  if (parts.length) {
    const last = chain[chain.length - 1];
    parts[parts.length - 1] = `${parts[parts.length - 1]}-${last.id}`;
  }
  return "/" + parts.join("/");
}