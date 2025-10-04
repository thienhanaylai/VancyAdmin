import FectApi from "./FectApi";

const ProductService = {
  getAllProduct() {
    return FectApi.get("/product");
  },

  getProduct(id) {
    return FectApi.get(`/product/${id}`);
  },

  createProduct(ProductData) {
    return FectApi.post("/product", ProductData);
  },

  updateProduct(id, ProductData) {
    return FectApi.put(`/product/${id}`, ProductData);
  },

  deleteProduct(id) {
    return FectApi.delete(`/product/${id}`);
  },
};

export default ProductService;
