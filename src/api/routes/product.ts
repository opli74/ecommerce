import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import { type ApiResponse, response } from "../util/response";
import {  
    getProducts, 
    getProductById, 
    updateProduct, 
    getCategories, 
    getCategoryById,
} from "../database/product";
import type { 
    PRODUCT, 
    PRODUCT_IMAGE, 
    CATEGORY 
} from '../../util/types';


const app = new Elysia()
.use( 
    cors({ 
        origin: 'http://localhost:4321', 
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        exposeHeaders: ['Set-Cookie']
    })
)

.use( 
    jwt( { 
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: '7d',
    })
)

.use( 
    cookie( ) 
)

.onError( ({  
    code, 
    error, 
    set
} ) => 
{
    console.error( error );
    let _error = error.toString().replace( "error: ", "");

    let status = 500;
    let message = "Unexpcted error";

    switch (code) 
    {
        case 'NOT_FOUND':
        {
            message = "Not found";
            status = 404;
            break;
        }
        case 'INTERNAL_SERVER_ERROR':
        {
            message = "Internal server error";
            status = 500;
            break;
        }
    }

    set.status = status;
    return response( 
        false,
        message, 
        null,
        _error
    );
})

.get( '/product/getproducts', async (

)
: Promise< ApiResponse< PRODUCT[] > > => 
{
  try 
  {
    const products = await getProducts( ) as PRODUCT[];
    return response( 
        true, 
        "Successfully got products",
        products
    )
  }
  catch( error )
  {
    throw error;
  }
})

.get( '/product/getproduct/:id', async ({
   params 
})
: Promise< ApiResponse< PRODUCT > > => 
{ 
  try 
  {
    const product = await getProductById( params.id ) as PRODUCT; 
    return response( 
        true,
        "Successfuly got product",
        product
    )
  }
  catch( error )
  {
    throw error;
  }
},
{
    params: t.Object({
        id: t.Number( )
    })
})

.put('/product/updateproduct/:id', async ({ 
    body, 
    params 
})
: Promise< ApiResponse< boolean > > => 
{
    const { title, description, price, discount, stock, categoryId } = body

    // Construct the product object with proper types and params.id
    const product: PRODUCT = {
        id: parseInt(params.id, 10), // Convert the ID from string to number
        categoryId: parseInt(categoryId, 10), // Convert categoryId to number
        title,
        description,
        price: parseFloat(price), // Convert price to number
        discount: parseFloat(discount), // Convert discount to number
        stock: parseInt(stock, 10), // Convert stock to number
        updatedAt: new Date(), // Set updatedAt to current date
    };

    try 
    {
        const updatedProduct = await updateProduct( product );
        return response( 
            true,
            "Product updated",
            updatedProduct
        )
    } 
    catch (error) 
    {
        throw error;
    }
},
{
    body: t.Object({
        title: t.String( ),
        description: t.String( ),
        price: t.String( ),
        discount: t.String( ),
        stock: t.String( ),
        categoryId: t.String( )
    })
})

.get( '/product/getcategories', async (
 
)
: Promise< ApiResponse< CATEGORY[] > > =>
{
    try
    {
        const categories = await getCategories() as CATEGORY[];
        return response( 
            true,
            "Successfully got categories",
            categories
        );
    }
    catch( error: any )
    {
        throw error;
    }
  
})
;

export default app;