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

  // Brands
await prisma.brand.createMany({
  data: [
    { id: 4, name: 'Example Brand 12345', logo_url: 'https://example.com/logo.png', status: false, created_at: new Date("2025-06-30T06:29:42.735Z") },
    { id: 5, name: 'Example Brand ', logo_url: 'https://example.com/logo.png', status: false, created_at: new Date("2025-07-07T06:45:19.870Z") },
    { id: 6, name: ' Brand ', logo_url: 'https://example.com/logo.png', status: true, created_at: new Date("2025-07-07T06:56:36.869Z") },
    { id: 7, name: 'new brand', logo_url: null, status: false, created_at: new Date("2025-07-07T07:41:20.449Z") },
    { id: 8, name: 'test brand', logo_url: null, status: true, created_at: new Date("2025-07-07T07:42:37.304Z") },
    { id: 11, name: 'final check', logo_url: null, status: false, created_at: new Date("2025-07-07T09:41:56.566Z") },
    { id: 12, name: 'brand toast1', logo_url: null, status: false, created_at: new Date("2025-07-07T09:48:10.675Z") },
  ],
  skipDuplicates: true
});

// Categories
await prisma.category.createMany({
  data: [
    { id: 6, title: 'TV Units', parent_id: 1, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.481Z"), updatedAt: new Date("2025-06-27T15:43:38.481Z") },
    { id: 9, title: 'Coffee Tables', parent_id: 1, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.498Z"), updatedAt: new Date("2025-06-27T15:43:38.498Z") },
    { id: 10, title: 'Recliners', parent_id: 1, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.504Z"), updatedAt: new Date("2025-06-27T15:43:38.504Z") },
    { id: 12, title: 'Beds', parent_id: 11, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.514Z"), updatedAt: new Date("2025-06-27T15:43:38.514Z") },
    { id: 13, title: 'King Size', parent_id: 22, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.520Z"), updatedAt: new Date("2025-07-03T06:59:42.336Z") },
    { id: 16, title: 'Wardrobes', parent_id: 11, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.539Z"), updatedAt: new Date("2025-06-27T15:43:38.539Z") },
    { id: 20, title: 'Bedside Tables', parent_id: 11, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.563Z"), updatedAt: new Date("2025-06-27T15:43:38.563Z") },
    { id: 23, title: '4-Seater', parent_id: 22, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.581Z"), updatedAt: new Date("2025-06-27T15:43:38.581Z") },
    { id: 24, title: '6-Seater', parent_id: 22, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.587Z"), updatedAt: new Date("2025-06-27T15:43:38.587Z") },
    { id: 26, title: 'Cabinets', parent_id: 21, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.598Z"), updatedAt: new Date("2025-06-27T15:43:38.598Z") },
    { id: 27, title: 'Sideboards', parent_id: 21, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.604Z"), updatedAt: new Date("2025-06-27T15:43:38.604Z") },
    { id: 29, title: 'Study Tables', parent_id: 28, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.615Z"), updatedAt: new Date("2025-07-03T06:58:43.418Z") },
    { id: 32, title: 'Office Chairs', parent_id: 28, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.633Z"), updatedAt: new Date("2025-06-27T15:43:38.633Z") },
    { id: 35, title: 'Bookshelves', parent_id: 28, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.651Z"), updatedAt: new Date("2025-06-27T15:43:38.651Z") },
    { id: 37, title: 'Garden Chairs', parent_id: 36, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.664Z"), updatedAt: new Date("2025-06-27T15:43:38.664Z") },
    { id: 40, title: 'Patio Tables', parent_id: 36, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.681Z"), updatedAt: new Date("2025-06-27T15:43:38.681Z") },
    { id: 41, title: 'Swing Chairs', parent_id: 36, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.688Z"), updatedAt: new Date("2025-06-27T15:43:38.688Z") },
    { id: 43, title: 'Shoe Racks', parent_id: 42, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.706Z"), updatedAt: new Date("2025-07-03T05:27:45.534Z") },
    { id: 46, title: 'Cabinets', parent_id: 42, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.724Z"), updatedAt: new Date("2025-06-27T15:43:38.724Z") },
    { id: 47, title: 'Chest of Drawers', parent_id: 42, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.730Z"), updatedAt: new Date("2025-06-27T15:43:38.730Z") },
    { id: 49, title: 'Bunk Beds', parent_id: 48, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.742Z"), updatedAt: new Date("2025-06-27T15:43:38.742Z") },
    { id: 52, title: 'Study Desks', parent_id: 48, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.761Z"), updatedAt: new Date("2025-06-27T15:43:38.761Z") },
    { id: 53, title: 'Toy Storage', parent_id: 48, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-06-27T15:43:38.767Z"), updatedAt: new Date("2025-07-03T06:58:59.790Z") },
    { id: 59, title: 'wooden bed', parent_id: 11, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-01T11:03:40.583Z"), updatedAt: new Date("2025-07-04T12:29:56.494Z") },
    { id: 60, title: 'modular furniture', parent_id: 28, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-01T11:06:46.686Z"), updatedAt: new Date("2025-07-06T18:29:08.412Z") },
    { id: 62, title: 'office chairs check', parent_id: 28, position: null, status: false, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T05:14:36.148Z"), updatedAt: new Date("2025-07-02T05:14:36.148Z") },
    { id: 64, title: 'checkl list category', parent_id: 2, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T05:31:11.976Z"), updatedAt: new Date("2025-07-02T05:31:11.976Z") },
    { id: 67, title: 'check outdoor', parent_id: 36, position: null, status: false, frontDisplay: null, appIcon: '1751436386852-Screenshot 2025-06-26 182655.png', webImage: '1751436386898-Screenshot 2025-06-26 182655.png', mainImage: '1751436386925-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:06:26.967Z"), updatedAt: new Date("2025-07-02T06:06:26.967Z") },
    { id: 68, title: 'check outdoor list', parent_id: 36, position: null, status: true, frontDisplay: null, appIcon: '1751436673593-Screenshot 2025-06-26 182655.png', webImage: '1751436673655-Screenshot 2025-06-26 182655.png', mainImage: '1751436673681-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:11:13.700Z"), updatedAt: new Date("2025-07-03T06:59:23.937Z") },
    { id: 69, title: 'check outdoor list list', parent_id: 36, position: null, status: false, frontDisplay: null, appIcon: '1751436942978-Screenshot 2025-06-26 182655.png', webImage: '1751436943022-Screenshot 2025-06-26 182655.png', mainImage: '1751436943050-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:15:43.075Z"), updatedAt: new Date("2025-07-02T06:15:43.075Z") },
    { id: 70, title: 'check storage sub', parent_id: 42, position: null, status: false, frontDisplay: null, appIcon: null, webImage: '1751437024185-Screenshot 2025-06-26 182655.png', mainImage: '1751437024231-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:17:04.267Z"), updatedAt: new Date("2025-07-02T06:17:04.267Z") },
    { id: 73, title: 'Lights', parent_id: 72, position: null, status: true, frontDisplay: null, appIcon: '1751437861132-Screenshot 2025-06-26 182655.png', webImage: '1751437861194-Screenshot 2025-06-26 182655.png', mainImage: '1751437861221-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:31:01.247Z"), updatedAt: new Date("2025-07-03T06:58:53.057Z") },
    { id: 74, title: 'ceiling light', parent_id: 118, position: null, status: true, frontDisplay: null, appIcon: '1751437981506-Screenshot 2025-06-26 182655.png', webImage: '1751437981575-Screenshot 2025-06-26 182655.png', mainImage: '1751437981606-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T06:33:01.648Z"), updatedAt: new Date("2025-07-04T08:52:03.069Z") },
    { id: 82, title: 'dining table image check', parent_id: 21, position: null, status: false, frontDisplay: null, appIcon: '1751461248820-Screenshot 2025-06-26 182655.png', webImage: '1751461248989-Screenshot 2025-06-26 182655.png', mainImage: '1751461249026-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-02T13:00:49.052Z"), updatedAt: new Date("2025-07-02T13:00:49.052Z") },
    { id: 88, title: 'check status', parent_id: 75, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-03T09:46:25.106Z"), updatedAt: new Date("2025-07-03T09:46:25.106Z") },
    { id: 93, title: 'living sub', parent_id: 91, position: null, status: false, frontDisplay: null, appIcon: '1751537319872-Screenshot 2025-06-26 182655.png', webImage: '1751537320265-sofa.avif', mainImage: '1751537320265-sofa2.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-03T10:08:40.274Z"), updatedAt: new Date("2025-07-04T12:58:20.810Z") },
    { id: 105, title: 'check urls sub1', parent_id: 104, position: null, status: false, frontDisplay: null, appIcon: '1751612014060-sofa.avif', webImage: '1751612014060-sofa2.jpg', mainImage: '1751612014075-Screenshot 2025-06-26 182655.png', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-04T06:53:34.129Z"), updatedAt: new Date("2025-07-04T12:58:20.810Z") },
    { id: 111, title: 'status true', parent_id: 114, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-04T07:02:27.594Z"), updatedAt: new Date("2025-07-05T05:06:18.383Z") },
    { id: 119, title: 'living room status', parent_id: 118, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-04T08:50:58.145Z"), updatedAt: new Date("2025-07-04T08:50:58.145Z") },
    { id: 127, title: 'new path check', parent_id: 126, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-04T12:16:25.207Z"), updatedAt: new Date("2025-07-04T12:16:25.207Z") },
    { id: 130, title: 'final check sub1', parent_id: 129, position: null, status: true, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-05T05:05:51.861Z"), updatedAt: new Date("2025-07-05T05:06:18.383Z") },
    { id: 132, title: 'Furniture', parent_id: null, position: null, status: false, frontDisplay: null, appIcon: '1752053767952-sofa.avif', webImage: '1752053767953-sofa2.jpg', mainImage: '1752053767989-sofa.avif', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T09:36:08.011Z"), updatedAt: new Date("2025-07-09T09:36:08.011Z") },
    { id: 133, title: 'sofas', parent_id: 132, position: null, status: false, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T09:36:30.583Z"), updatedAt: new Date("2025-07-09T09:36:30.583Z") },
    { id: 134, title: '3-seater Sofas', parent_id: 133, position: null, status: false, frontDisplay: null, appIcon: '1752053817082-sofa.avif', webImage: '1752053817083-sofa2.jpg', mainImage: '1752053817119-sofa.avif', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T09:36:57.169Z"), updatedAt: new Date("2025-07-09T09:36:57.169Z") },
    { id: 135, title: '2-seater sofa', parent_id: 133, position: null, status: false, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T09:56:22.045Z"), updatedAt: new Date("2025-07-09T09:56:22.045Z") },
    { id: 136, title: 'recliner sofa', parent_id: 133, position: null, status: false, frontDisplay: null, appIcon: '1752055008219-sofa2.jpg', webImage: '1752055008220-sofa.avif', mainImage: '1752055008261-sofa.avif', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T09:56:35.260Z"), updatedAt: new Date("2025-07-09T09:56:48.281Z") },
    { id: 138, title: 'Recliner', parent_id: 132, position: null, status: false, frontDisplay: null, appIcon: '1752055336179-sofa.avif', webImage: '1752055336179-sofa2.jpg', mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T10:02:16.229Z"), updatedAt: new Date("2025-07-09T10:02:16.229Z") },
    { id: 139, title: '2-seater recliner', parent_id: 138, position: null, status: false, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T10:02:31.837Z"), updatedAt: new Date("2025-07-09T10:02:31.837Z") },
    { id: 140, title: '3-seater recliner', parent_id: 138, position: null, status: false, frontDisplay: null, appIcon: null, webImage: null, mainImage: null, filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T10:02:43.387Z"), updatedAt: new Date("2025-07-09T10:02:43.387Z") },
    { id: 141, title: 'Mattress', parent_id: null, position: null, status: false, frontDisplay: null, appIcon: '1752062208373-bed.jpg', webImage: '1752062208374-bed2.jpg', mainImage: '1752062208507-bed.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T11:56:48.516Z"), updatedAt: new Date("2025-07-09T11:56:48.516Z") },
    { id: 143, title: 'Foam', parent_id: 142, position: null, status: true, frontDisplay: null, appIcon: '1752062278180-bed.jpg', webImage: '1752062278181-bed2.jpg', mainImage: '1752062278311-bed.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T11:57:58.319Z"), updatedAt: new Date("2025-07-09T11:58:02.749Z") },
    { id: 144, title: 'Furnishings', parent_id: null, position: null, status: false, frontDisplay: null, appIcon: '1752062467232-bedsheet.jpg', webImage: '1752062467369-bedsheet2.webp', mainImage: '1752062467429-bedsheet.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T12:01:07.476Z"), updatedAt: new Date("2025-07-09T12:03:37.689Z") },
    { id: 145, title: 'King size matress', parent_id: 141, position: null, status: false, frontDisplay: null, appIcon: '1752062537874-bed.jpg', webImage: '1752062537874-bedsheet.jpg', mainImage: '1752062537988-bedsheet2.webp', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T12:02:18.045Z"), updatedAt: new Date("2025-07-09T12:02:18.045Z") },
    { id: 146, title: 'Foam', parent_id: 145, position: null, status: false, frontDisplay: null, appIcon: '1752062563034-bed.jpg', webImage: '1752062563034-bed2.jpg', mainImage: '1752062563211-bedsheet.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T12:02:43.278Z"), updatedAt: new Date("2025-07-09T12:02:43.278Z") },
    { id: 147, title: 'bedsheets', parent_id: 144, position: null, status: true, frontDisplay: null, appIcon: '1752062649061-bedsheet2.webp', webImage: '1752062649244-bed.jpg', mainImage: '1752062649245-bedsheet.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T12:04:09.266Z"), updatedAt: new Date("2025-07-09T12:04:52.906Z") },
    { id: 148, title: 'king size bedsheets', parent_id: 147, position: null, status: false, frontDisplay: null, appIcon: '1752062718395-bedsheet.jpg', webImage: '1752062718537-bedsheet2.webp', mainImage: '1752062718594-bed2.jpg', filterTypeId: null, featureTypeId: null, createdAt: new Date("2025-07-09T12:05:18.642Z"), updatedAt: new Date("2025-07-09T12:05:18.642Z") },
  ],
  skipDuplicates: true
});

// Colors
await prisma.color.createMany({
  data: [
    { id: 2, label: 'White', hex_code: '#FFFFFF', status: true },
    { id: 3, label: 'Blue', hex_code: '#FF0000', status: true },
    { id: 4, label: 'Green', hex_code: '#FF0000', status: false },
    { id: 5, label: 'black', hex_code: null, status: true },
    { id: 6, label: 'Blueeee', hex_code: null, status: true },
    { id: 7, label: 'pink', hex_code: null, status: false },
    { id: 9, label: 'final', hex_code: '#7C5D5D', status: true },
  ],
  skipDuplicates: true
});

// Featuretype
await prisma.featureType.createMany({
  data: [
    { id: 7, name: 'assembly_required' },
    { id: 21, name: 'bigger' },
    { id: 25, name: 'BODY FEATURES' },
    { id: 19, name: 'create check' },
    { id: 11, name: 'dimensions1' },
    { id: 2, name: 'finish_type' },
    { id: 23, name: 'General' },
    { id: 1, name: 'ideal_for' },
    { id: 22, name: 'larger' },
    { id: 5, name: 'material' },
    { id: 24, name: 'model name' },
    { id: 10, name: 'other_features' },
    { id: 13, name: 'Premium Feature' },
    { id: 16, name: 'Premium Feature1' },
    { id: 4, name: 'room_type' },
    { id: 20, name: 'smaller' },
    { id: 17, name: 'test123' },
    { id: 9, name: 'usage' },
    { id: 12, name: 'weight' },
    { id: 8, name: 'with_cushions' },
  ],
  skipDuplicates: true
});

// Filtertype
await prisma.filterType.createMany({
  data: [
    { id: 2, name: 'Chair filter1' },
    { id: 1, name: 'Color Filter' },
  ],
  skipDuplicates: true
});

// Size_Uom
await prisma.sizeUOM.createMany({
  data: [
    { id: 6, title: 'small', status: true },
    { id: 7, title: 'large', status: false },
    { id: 8, title: 'extra large', status: true },
    { id: 9, title: 'small1', status: false },
    { id: 10, title: 'mm', status: true },
  ],
  skipDuplicates: true
});

}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
