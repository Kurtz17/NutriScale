/**
 * Mengubah nama file, URL, atau nama produk menjadi Public URL Supabase Storage yang valid.
 * - Jika `image` berupa full URL: encodeURI agar spasi aman.
 * - Jika `image` berupa nama file (misal Lentils.jpeg): rangkai ke URL bucket.
 * - Jika `image` masih berupa emoji atau kosong tapi ada `productName`: coba format `${productName}.jpeg`
 * - Jika bukan file atau tidak ada: return null (sehingga komponen fallback ke emoji)
 */
export function getProductImageUrl(
  image?: string | null,
  productName?: string | null,
  bucket = 'product-images',
): string | null {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://jskmhvilyelokpqcgmya.supabase.co'
  ).replace(/\/$/, '');

  const buildUrl = (filePath: string) => {
    const encodedPath = filePath
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedPath}`;
  };

  const trimmed = image?.trim();

  // 1. Jika sudah berupa Full URL (misal https://...supabase.co/...)
  if (
    trimmed &&
    (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
  ) {
    return encodeURI(trimmed);
  }

  // 2. Jika berupa nama file dengan ekstensi gambar (misal: "Lentils.jpeg")
  const isImageFile = Boolean(
    trimmed && /\.(jpg|jpeg|png|webp|avif|aviv|gif|svg)$/i.test(trimmed),
  );
  if (isImageFile && trimmed) {
    return buildUrl(trimmed);
  }

  // 3. Jika image masih berupa emoji atau kosong, kembalikan urutan ekstensi yang mungkin
  if (productName?.trim()) {
    return buildUrl(`${productName.trim()}.jpeg`);
  }

  return null;
}

/**
 * Mengembalikan daftar URL kandidat berdasarkan prioritas ekstensi (.jpeg, .jpg, .png, .webp).
 */
export function getProductImageCandidates(
  image?: string | null,
  productName?: string | null,
  bucket = 'product-images',
): string[] {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://jskmhvilyelokpqcgmya.supabase.co'
  ).replace(/\/$/, '');

  const buildUrl = (filePath: string) => {
    const encodedPath = filePath
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedPath}`;
  };

  const trimmed = image?.trim();

  // 1. Jika sudah berupa Full URL
  if (
    trimmed &&
    (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
  ) {
    return [encodeURI(trimmed)];
  }

  // 2. Jika di database sudah ada nama file dengan ekstensi
  const isImageFile = Boolean(
    trimmed && /\.(jpg|jpeg|png|webp|avif|aviv|gif|svg)$/i.test(trimmed),
  );
  if (isImageFile && trimmed) {
    return [buildUrl(trimmed)];
  }

  // 3. Jika masih emoji atau kosong, coba ekstensi umum: .jpeg, .jpg, .png, .webp, .avif, .aviv
  if (productName?.trim()) {
    const cleanName = productName.trim();
    const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.aviv'];
    return extensions.map((ext) => buildUrl(`${cleanName}${ext}`));
  }

  return [];
}
