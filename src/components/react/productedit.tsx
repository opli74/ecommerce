import React, { useEffect, useState } from 'react';

interface ProductEditProps {
  id: string | undefined; // Expect the 'id' as a prop
}

const ProductEdit: React.FC<ProductEditProps> = ({ id }) => {
  const [product, setProduct] = useState<any>(null);      // Holds the product data
  const [categories, setCategories] = useState<any[]>([]); // Holds the list of categories
  const [loading, setLoading] = useState(true);            // Loading state for fetching product
  const [saving, setSaving] = useState(false);             // Loading state for saving the product
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch product and categories when the component mounts
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try 
      {
        // Fetch product by ID
        const productResponse = await fetch(`http://localhost:5521/api/products/${id}`);
        const productData = await productResponse.json();
        setProduct(productData.data);

        // Fetch list of categories
        const response = await fetch('http://localhost:5521/api/categories');
        const json = await response.json();
        setCategories( json.data ); // Assuming categories data is in `data`
      } 
      catch ( error: any ) 
      {
        setError('Error fetching product or categories');
        console.error('Error fetching product or categories:', error );
      } 
      finally 
      {
        setLoading(false); // Stop loading state
      }
    };

    fetchProductAndCategories();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true); // Start saving state

    const formData = new FormData(event.currentTarget);
    const updatedProduct = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      discount: parseFloat( formData.get('discount') as string),
      stock: parseInt(formData.get('stock') as string, 10),
      categoryId: formData.get('categoryId'),
    };

    try {
      const response = await fetch(`http://localhost:5521/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) 
        setError('Error updating product');

    } 
    catch ( error: any ) 
    {
      setError('Error updating product');
    } 
    finally 
    {
      setSaving(false); // Stop saving state
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading product and categories...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Render form when product and categories data are available
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={product?.title || ''}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={product?.description || ''}
            required
            className="border border-gray-300 p-2 w-full rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            defaultValue={product?.price || 0}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Discount</label>
          <input
            type="number"
            name="discount"
            step="0.01"
            defaultValue={product?.discount || 0}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={product?.stock || 0}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId || ''}
            required
            className="border border-gray-300 p-2 w-full rounded"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Save button with loading state */}
        <button
          type="submit"
          className={`px-4 py-2 text-white font-semibold rounded-md ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
