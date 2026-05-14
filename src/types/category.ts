export interface Category {
  id: number
  nama: string
  deskripsi_kategori?: string | null
  gambar?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CategoryView {
  id: number
  name: string
  description?: string | null
  image?: string | null
  created_at?: string | null
  updated_at?: string | null
}