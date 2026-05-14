import { api } from "./api"

export const getCategories = async () => {
  const res = await api.get("/categories")

  return res.data.map((item: any) => ({
    id: item.id,
    name: item.nama,
    description: item.deskripsi_kategori,
    image: `http://127.0.0.1:8000/storage/${item.gambar}`,
  }))
}