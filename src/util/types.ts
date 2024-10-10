export interface USER
{
    id?: number,
    name: string,
    email: string,
    password?: string,
    isAdmin: boolean,
    createdAt?: Date,
    updatedAt?: Date, 
};

export interface PRODUCT 
{
    id: number;
    categoryId: number;
    title: string;
    description: string;
    stock: number;
    price: number;
    discount: number;
    updatedAt?: Date; 
}

export interface CATEGORY
{
    id: number,
    title: string,
    description?: string,
};

export interface PRODUCT_IMAGE
{
    id: number,
    productId: number,
    imageUrl: string,
};