import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../../util/fetch';
import type { ApiResponse } from '../../api/util/response';
import type { PRODUCT } from '../../util/types';

const ProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PRODUCT[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // Store selected product IDs

  // Fetch the products
  useEffect(() => {
    const fetchProducts = async () => {
      try 
      {
        const response = await fetchAPI( '/product/getproducts', 'GET' );
        const data = ( await response.json() ) as ApiResponse< PRODUCT[] >;
        if( data.data )
          setProducts(data.data);
      } 
      catch (error) 
      {
        console.error('Error fetching products:', error);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle deleting a single product
  const deleteProduct = async (id: number) => {
    try 
    {
      await fetch(`http://localhost:5521/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(product => product.id !== id)); // Remove the deleted product from the state
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle selecting a product for bulk deletion
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) 
    {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } 
    else 
    {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Handle bulk deletion
  const deleteSelectedProducts = async () => {
    try 
    {
      await fetch('http://localhost:5521/api/products/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProducts }),
      });
      setProducts(products.filter(product => !selectedProducts.includes(product.id))); // Remove deleted products
      setSelectedProducts([]); // Clear selected products
    } 
    catch (error) 
    {
      console.error('Error deleting selected products:', error);
    }
  };

  // Skeleton loader for loading state
  const renderSkeletonLoader = () => {
    return (
        <>
        <button
        onClick={deleteSelectedProducts}
        disabled={selectedProducts.length === 0}
        className={`w-[168.4px] h-[40px] px-4 py-2 mb-4 rounded-md cursor-not-allowed bg-gray-300 animate-pulse`}
      >
      </button>
      <ul className="space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="h-[62px] flex items-center justify-between p-4 border rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-48 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
          </li>
        ))}
      </ul>
    </>
    );
  };

  // Render actual product list
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

        <ul className="space-y-4">
          {products.length > 0 ? (
            products.map((product: any) => (
              <li key={product.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  {/* Checkbox for selecting product */}
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  {/* Product details */}
                  <a href={`/admin/products/${product.id}`} className="text-blue-600 hover:underline">
                    {product.title} - {product.description} - {product.stock} units
                  </a>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No products found</p>
          )}
        </ul>
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
