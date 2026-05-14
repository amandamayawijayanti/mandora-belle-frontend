import { api } from "./api"

export const getProducts = async () => {
  const response = await api.get("/products")

  return response.data.data.map((item: any) => ({
    id: item.id,
    name: item.attributes.name,
    price: item.attributes.price,
    description: item.attributes.description,
    stock: item.attributes.stock,
    image: item.attributes.image_url,
    info_stock: item.attributes.info_stock,
    kategori_id: item.attributes.kategori_id, // 🔥 INI PENTING
  }))
}