import prisma from '../src/lib/prisma';

async function main() {
  console.log('Clearing existing data...');
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.mealPlanProduk.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.produkMakanan.deleteMany({});
  await prisma.mealPlan.deleteMany({});
  await prisma.riwayatAnalisis.deleteMany({});
  await prisma.profilKesehatan.deleteMany({});

  console.log('Seeding products...');
  const mockProducts = [
    {
      id: '1',
      namaProduk: 'Organic Brown Rice',
      kategori: 'Grains',
      gambar: '🌾',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: true,
        tags: ['Low Sodium', 'Whole Grain'],
        calories: 110,
        protein: 3,
      },
      harga: 25000,
    },
    {
      id: '2',
      namaProduk: 'Fresh Chicken Breast',
      kategori: 'Meat',
      gambar: '🍗',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: false,
        tags: ['High Protein'],
        calories: 165,
        protein: 31,
      },
      harga: 45000,
    },
    {
      id: '3',
      namaProduk: 'Greek Yogurt',
      kategori: 'Dairy',
      gambar: '🥛',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: true,
        tags: ['Low Fat', 'Probiotic'],
        calories: 59,
        protein: 10,
      },
      harga: 20000,
    },
    {
      id: '4',
      namaProduk: 'Salmon Fillet',
      kategori: 'Seafood',
      gambar: '🐟',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: false,
        tags: ['Omega-3', 'High Protein'],
        calories: 208,
        protein: 22,
      },
      harga: 75000,
    },
    {
      id: '5',
      namaProduk: 'Sweet Potato',
      kategori: 'Vegetables',
      gambar: '🍠',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: false,
        tags: ['High Fiber', 'Low Fat'],
        calories: 86,
        protein: 2,
      },
      harga: 15000,
    },
    {
      id: '6',
      namaProduk: 'Honey',
      kategori: 'Sweeteners',
      gambar: '🍯',
      nilaiGizi: {
        healthSafe: true,
        aiRecommended: true,
        tags: ['Natural Sugar', 'High Sugar'],
        calories: 64,
        protein: 0,
      },
      harga: 30000,
    },
  ];

  for (const p of mockProducts) {
    await prisma.produkMakanan.create({
      data: {
        id: p.id,
        namaProduk: p.namaProduk,
        kategori: p.kategori,
        gambar: p.gambar,
        nilaiGizi: p.nilaiGizi,
        harga: p.harga,
      },
    });
  }

  // To seed a user and health data we need to make sure we don't break existing users,
  // but if we need dummy data for testing we can create one or assume the user exists.
  // We will leave the health data dynamic per user for the API later.

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
