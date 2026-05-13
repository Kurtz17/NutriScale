export type Produk = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  price: number;
  stok: number;
  label_risiko: string;
  image: string;
  tags: string[];
};

export type ProductFormData = {
  name: string;
  category: string;
  calories: string;
  protein: string;
  harga: string;
  stok: string;
  label_risiko: string;
  image: string;
  tags: string[];
};
