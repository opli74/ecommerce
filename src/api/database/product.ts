import * as SQL from '../database/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { PRODUCT, PRODUCT_IMAGE, CATEGORY } from '../../util/types';

// CREATE TABLE categories (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(100) NOT NULL,
//     description TEXT,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE products (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     stock INT NOT NULL DEFAULT 0,         
//     price DECIMAL(10, 2) NOT NULL,         
//     discount DECIMAL(5, 2) DEFAULT 0,      
//     categoryId INT,                       
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
// );

// CREATE TABLE productImages (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     productId INT NOT NULL,           
//     imageUrl VARCHAR(255) NOT NULL,      
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
// );

interface PRODUCT_DB extends RowDataPacket
{
    id: number,
    categoryId: number,
    title: string,
    description: string,
    stock: number,
    price: number,
    discount: number,
    createdAt?: Date,
    updatedAt?: Date, 
};

interface CATEGORY_DB extends RowDataPacket
{
    id: number,
    title: string,
    description?: string,
    createdAt?: Date
};

interface PRODUCT_IMAGE_DB extends RowDataPacket
{
    id: number,
    productId: number,
    imageUrl: string,
    createdAt?: Date
};

export const getProducts = async(

) =>
{
    const rows = await SQL.execute< PRODUCT_DB[] >( 'SELECT * FROM products' );
    return rows.length > 0 ? rows : null;
}

export const getProductById = async(
    id: number
) =>
{
    const rows = await SQL.execute< PRODUCT_DB[] >( 'SELECT * FROM products WHERE id=?', [id] );
    return rows.length > 0 ? rows[0] : null;
}

export const getProductByCategoryId = async( 
    id: number
) => 
{
    const rows = await SQL.execute< PRODUCT_DB> (`
        SELECT p.id, p.categoryId, p.title, p.description, p.stock, p.price, p.createdAt, p.updatedAt AS categoryName 
        FROM products p 
        JOIN categories c ON p.categoryId=c.id 
        WHERE c.id=?`, 
        [id] 
    );
    return rows.length > 0 ? rows[0] : null;
}

export const getProductByCategoryTitle = async( 
    title: string
) => 
{
    const rows = await SQL.execute<PRODUCT_DB>(`
        SELECT p.id, p.categoryId, p.title, p.description, p.stock, p.price, p.createdAt, p.updatedAt AS categoryName 
        FROM products p 
        JOIN categories c ON p.categoryId=c.id 
        WHERE c.title=?`, 
        [title] 
    );
    return rows.length > 0 ? rows[0] : null;
}

export const deleteProductByIds = async( 
    id: number[]
) =>
{
    const [result] = await SQL.execute< ResultSetHeader[] >( 'DELETE FROM products WHERE id IN (?)', [id] );
    return result.affectedRows > 0;
}

export const updateProduct = async(
    PRODUCT: PRODUCT
) =>
{
    const [result] = await SQL.execute< ResultSetHeader[] >(`
    UPDATE products 
    SET 
      categoryId = ?, 
      title = ?, 
      description = ?, 
      stock = ?, 
      price = ?, 
      discount = ?, 
      updatedAt = NOW() 
    WHERE id = ?`,
    [
        PRODUCT.categoryId,
        PRODUCT.title,
        PRODUCT.description,
        PRODUCT.stock,
        PRODUCT.price,
        PRODUCT.discount,
        PRODUCT.id
    ]);
    return result.affectedRows > 0;
}

export const getCategories = async(

) =>
{
    const rows = await SQL.execute< CATEGORY_DB[] >( 'SELECT * FROM categories' );
    return rows.length > 0 ? rows : null;
}

export const getCategoryById = async(
    id: number
) =>
{
    const rows = await SQL.execute< CATEGORY_DB[] >( 'SELECT * FROM categories WHERE id=?', [id] );
    return rows.length > 0 ? rows[0] : null;
}

export const getImagesByProductId = async(
    id: number
) =>
{
    const rows = await SQL.execute< PRODUCT_IMAGE_DB[] >(`
        SELECT pi.id, pi.title, pi.imageUrl, p.createdAt
        FROM productimages pi
        JOIN products p ON p.id=pi.productId
        WHERE p.id=?`,
        [id]
    );
    return rows.length > 0 ? rows : null;
}

