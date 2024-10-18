import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../../util/fetch';
import type { ApiResponse } from '../../api/util/response';
import type { PRODUCT } from '../../util/types';

const ProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PRODUCT[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Fetch the products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchAPI('/product/getproducts', 'GET');
        const data = (await response.json()) as ApiResponse<PRODUCT[]>;
        if (data.data) setProducts(data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle deleting a single product
  const deleteProduct = async (id: number) => {
    try {
      await fetch(`http://localhost:5521/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle selecting a product for bulk deletion
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Handle selecting all products
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  // Handle bulk deletion
  const deleteSelectedProducts = async () => {
    try {
      await fetch('http://localhost:5521/api/products/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProducts }),
      });
      setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting selected products:', error);
    }
  };

  // Skeleton loader for loading state
  const renderSkeletonLoader = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 animate-pulse">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100"></th>
              <th className="px-6 py-3 bg-gray-100"></th>
              <th className="px-6 py-3 bg-gray-100"></th>
              <th className="px-6 py-3 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-48 h-4 bg-gray-300 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-8 bg-gray-300 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render actual product table
  const renderProductList = () => {
    return (
      <>
        {/* Bulk delete button */}
        <button
          onClick={deleteSelectedProducts}
          disabled={selectedProducts.length === 0}
          className={`px-4 py-2 mb-4 text-white font-semibold rounded-md ${
            selectedProducts.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Delete Selected ({selectedProducts.length})
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </th>
                <th className="px-6 py-3 bg-gray-100 text-left text-sm font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 bg-gray-100 text-left text-sm font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 bg-gray-100 text-left text-sm font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 bg-gray-100 text-left text-sm font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-100"
                  >
                    {/* Checkbox for selecting product */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    {/* Product details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {product.title}
                      </a>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </td>
                    {/* Stock */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      £{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => 
                        {
                          if (product.discount == 0.00)
                            return 'N/A';
                          else 
                          return `${product.discount}%`;
                        }
                      )()}
                    </td>
                    {/* Delete button */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Products</h2>

      {/* Render either the skeleton loader or the actual product list */}
      {loading ? renderSkeletonLoader() : renderProductList()}
    </div>
  );
};

export default ProductsList;
