import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getOrCreateCategory(title: string, parent_id: number | null = null) {
  const existing = await prisma.category.findFirst({ where: { title, parent_id } });
  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: { title, parent_id, status: true },
  });
  return created.id;
}

async function getOrCreateFeature(name: string) {
  const existing = await prisma.featureType.findFirst({ where: { name } });
  if (existing) return existing.id;

  const created = await prisma.featureType.create({ data: { name } });
  return created.id;
}

async function assignFeatureToCategory(categoryId: number, featureName: string) {
  const feature = await prisma.featureType.findFirst({ where: { name: featureName } });
  if (!feature) {
    console.warn(`⚠️ Feature "${featureName}" not found`);
    return;
  }

  const alreadyLinked = await prisma.categoryFeature.findFirst({
    where: { categoryId, featureId: feature.id },
  });

  if (!alreadyLinked) {
    await prisma.categoryFeature.create({
      data: { categoryId, featureId: feature.id },
    });
    console.log(`✅ Linked ${featureName} to category ID ${categoryId}`);
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
    console.log(`✅ Linked "${featureName}" to category "${category?.title}" (ID: ${categoryId})`);
  }
}

async function main() {
  // 🧠 STEP 1: Feature types
  const featureNames = [
    'ideal_for',
    'finish_type',
    'style',
    'room_type',
    'material',
    'brand',
    'assembly_required',
    'with_cushions',
    'usage',
    'other_features',
    'dimensions',
    'weight',
  ];
  for (const name of featureNames) {
    await getOrCreateFeature(name);
  }

  // 🏗️ STEP 2: Category Hierarchy (your original structure preserved)
  const livingRoom = await getOrCreateCategory('Living Room');
  const sofas = await getOrCreateCategory('Sofas', livingRoom);
  await getOrCreateCategory('2-Seater', sofas);
  await getOrCreateCategory('3-Seater', sofas);
  await getOrCreateCategory('L-Shaped', sofas);

  const tvUnits = await getOrCreateCategory('TV Units', livingRoom);
  await getOrCreateCategory('Wall-Mounted', tvUnits);
  await getOrCreateCategory('Floor Units', tvUnits);
  await getOrCreateCategory('Coffee Tables', livingRoom);
  await getOrCreateCategory('Recliners', livingRoom);

  const bedroom = await getOrCreateCategory('Bedroom');
  const beds = await getOrCreateCategory('Beds', bedroom);
  await getOrCreateCategory('King Size', beds);
  await getOrCreateCategory('Queen Size', beds);
  await getOrCreateCategory('Storage Beds', beds);

  const wardrobes = await getOrCreateCategory('Wardrobes', bedroom);
  await getOrCreateCategory('2-Door', wardrobes);
  await getOrCreateCategory('3-Door', wardrobes);
  await getOrCreateCategory('Sliding Door', wardrobes);
  await getOrCreateCategory('Bedside Tables', bedroom);

  const diningRoom = await getOrCreateCategory('Dining Room');
  const diningSets = await getOrCreateCategory('Dining Sets', diningRoom);
  await getOrCreateCategory('4-Seater', diningSets);
  await getOrCreateCategory('6-Seater', diningSets);
  await getOrCreateCategory('Chairs', diningRoom);
  await getOrCreateCategory('Cabinets', diningRoom);
  await getOrCreateCategory('Sideboards', diningRoom);

  const office = await getOrCreateCategory('Office');
  const studyTables = await getOrCreateCategory('Study Tables', office);
  await getOrCreateCategory('With Storage', studyTables);
  await getOrCreateCategory('Without Storage', studyTables);

  const officeChairs = await getOrCreateCategory('Office Chairs', office);
  await getOrCreateCategory('Executive', officeChairs);
  await getOrCreateCategory('Task Chairs', officeChairs);
  await getOrCreateCategory('Bookshelves', office);

  const outdoor = await getOrCreateCategory('Outdoor');
  const gardenChairs = await getOrCreateCategory('Garden Chairs', outdoor);
  await getOrCreateCategory('Foldable', gardenChairs);
  await getOrCreateCategory('Lounge Chairs', gardenChairs);
  await getOrCreateCategory('Patio Tables', outdoor);
  await getOrCreateCategory('Swing Chairs', outdoor);

  const storage = await getOrCreateCategory('Storage');
  const shoeRacks = await getOrCreateCategory('Shoe Racks', storage);
  await getOrCreateCategory('Closed', shoeRacks);
  await getOrCreateCategory('Open', shoeRacks);
  await getOrCreateCategory('Cabinets', storage);
  await getOrCreateCategory('Chest of Drawers', storage);

  const kidsRoom = await getOrCreateCategory('Kids Room');
  const bunkBeds = await getOrCreateCategory('Bunk Beds', kidsRoom);
  await getOrCreateCategory('With Storage', bunkBeds);
  await getOrCreateCategory('Without Storage', bunkBeds);
  await getOrCreateCategory('Study Desks', kidsRoom);
  await getOrCreateCategory('Toy Storage', kidsRoom);

  // 🧩 STEP 3: Feature-category mapping
  for (const fname of ['ideal_for', 'style', 'with_cushions', 'dimensions']) {
    await assignFeatureToCategory(sofas, fname);
  }

  for (const fname of ['ideal_for', 'material', 'with_cushions', 'dimensions']) {
    await assignFeatureToCategory(beds, fname);
  }

  for (const fname of ['ideal_for', 'room_type']) {
    await assignFeatureToCategory(tvUnits, fname);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
