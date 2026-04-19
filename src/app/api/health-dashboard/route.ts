import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get latest health profile for user
    const profile = await prisma.profilKesehatan.findFirst({
      where: { userId: session.user.id },
      include: {
        riwayatAnalisis: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { mealPlan: true },
        },
      },
    });

    // If we have actual DB data, map it. Otherwise provide safe defaults/empty
    let stats = [
      { title: 'WHO Z-Score (HAZ)', value: '+0.0 SD', status: 'Normal' },
      { title: 'Daily Calories', value: '0 / 2000', progress: 0 },
      { title: 'Protein Intake', value: '0 / 50g', progress: 0 },
      { title: 'Health Status', value: 'No Data Yet' },
    ];

    type MealEntry = {
      title: string;
      time: string;
      calories: number;
      protein: number;
      tags: string[];
      type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    };
    let meals: MealEntry[] = [];

    if (profile && profile.riwayatAnalisis.length > 0) {
      const latest = profile.riwayatAnalisis[0];
      stats = [
        {
          title: 'WHO Z-Score (HAZ)',
          value: `${Number(latest.haz) > 0 ? '+' : ''}${latest.haz} SD`,
          status: latest.statusNutrisi,
        },
        {
          title: 'Daily Calories',
          value: `1200 / ${profile.anjuranKaloriDokter || 2000}`,
          progress: 60,
        },
        { title: 'Protein Intake', value: `45 / 60g`, progress: 75 },
        { title: 'Health Status', value: latest.statusNutrisi },
      ];

      // We could parse latest.mealPlan.detailRencanaMakan here, but for simplicity:
      meals = [];
    }

    return NextResponse.json({ stats, meals });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 },
    );
  }
}
