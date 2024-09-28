const Product = require('../models/productModel');
const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');


const addProduct = asyncHandler(async (req, res) => {
    try {


        const { name, price, description, quantity, category, brand, countInStock } = req.fields;

        if (!name || !price || !description || !quantity || !category || !brand || !countInStock) {
            return res.status(401).json({ error: 'Please provide all fields' })
        }


        const product = await Product.create({ name, price, description, quantity, category, brand, countInStock });

        await product.save();

        return res.status(201).json({ product });

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

const getProducts = asyncHandler(async (req, res) => {
    try {
        // Pagination and keyword search
        const pageSize = 12;
        const page = Number(req.query.page) || 1;
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword, // Mongoose regex search by name
                    $options: 'i', // Case-insensitive search
                },
            }
            : {};


        // Get count of filtered products (without pagination)
        const count = await Product.countDocuments({ ...keyword });

        // Get products with pagination
        let products = await Product.find({ ...keyword })

        // Extracting filters from query
        const categories = req.query.category.split(',')
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const rating = req.query.rating;
        const sortBy = req.query.sortBy;

        if (categories[0] === '') {
            categories.splice(0, 1);
        }
        // Apply filters if requested
        if (categories && categories.length > 0) {
            products = products.filter((p) => categories.includes(p.category.toString()));
        }
        if (minPrice) {
            products = products.filter((p) => p.price >= minPrice);
        }
        if (maxPrice) {
            products = products.filter((p) => p.price <= maxPrice);
        }
        if (rating) {
            products = products.filter((p) => p.rating >= rating);
        }

        // Apply sorting if requested
        if (sortBy) {
            if (sortBy === 'lowest') {
                products = products.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'highest') {
                products = products.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'a-z') {
                products = products.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'z-a') {
                products = products.sort((a, b) => b.name.localeCompare(a.name));
            }
        }


        // Get all products without pagination (for filtering without page limit, if needed)
        const allProducts = products;


        // Pagination
        products = products.slice((page - 1) * pageSize, page * pageSize);

        // If no products found, return a message
        if (!products || products.length === 0) {
            return res.status(200).json({ message: 'No products found', products: [] });
        }
        
        return res.status(200).json({
            products,
            page,
            pages: Math.ceil(allProducts.length / pageSize),
            hasMore: page * pageSize < allProducts.length,
            allProducts,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});



const getProduct = asyncHandler(async (req, res) => {
    try {

        console.log(req.params.id)
        const product = await Product.findById(req.params.id);

        const category = await Category.findById(product.category);


        // get the user review of the product
        let review = null;
        if (req.query.userId) {
            const user = await User.findById(req.query.userId);
            review = product.reviews.find((r) => r.user.toString() === user._id.toString());
        }

        if (!product) {
            return res.status(400).json({ error: 'Product not found' })
        }



        return res.status(200).json({ product, category: category.name, review });


    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    try {


        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(400).json({ error: 'Product not found' })
        }

        const { name, price, description, quantity, category, brand } = req.fields;

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.quantity = quantity || product.quantity;
        product.brand = brand || product.brand;
        product.category = category || product.category;

        const updatedProduct = await product.save();


        return res.status(201).json({ updatedProduct });

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})


const deleteProduct = asyncHandler(async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(400).json({ error: 'Product not found' })
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Product deleted' })


    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

})


const getAllProducts = asyncHandler(async (req, res) => {

    try {
        const products = await Product.find({});

        if (!products) {
            return res.status(400).json({ error: 'Products not found' })
        }

        return res.status(200).json(products);

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

const createProductReview = asyncHandler(async (req, res) => {
    try {


        const { rating, comment, userId } = req.body;
        const product = await Product.findById(req.params.id);



        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }

        const user = await User.findById(userId);


        if (!user) {
            return res.status(402).json({ error: 'User not found' });
        }

        // Check if the review already exists
        const alreadyReviewed = product.reviews.find((item) => {
            return item.user.toString() === user._id.toString();
        });

        if (alreadyReviewed) {
            return res.status(403).json({ error: 'Product already reviewed' });
        }

        const review = {
            name: user.firstName + ' ' + user.lastName,
            rating: Number(rating),
            comment,
            user: user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        // Calculate the average rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        return res.status(201).json({ message: 'Review added' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


const deleteProductReview = asyncHandler(async (req, res) => {
    try {
        
        const { id } = req.params;
        const { userId } = req.body;


        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }


        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        
        const review = product.reviews.find((item) => {
            return item.user.toString() === user._id.toString();
        });

        if (!review) {
            return res.status(400).json({ error: 'Review not found' });
        }


        product.reviews = product.reviews.filter((item) => {
            return item.user.toString() !== user._id.toString();
        });

        
        product.numReviews = product.reviews.length;
        
        console.log(product.reviews)
        // Calculate the average rating
        if (product.reviews.length > 0) {
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        } else {
            product.rating = 0;
        }


        await product.save();


        return res.status(200).json({ message: 'Review deleted' });


    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})



const getTopProducts = asyncHandler(async (req, res) => {
    try {


        const products = await Product.find({}).sort({ rating: -1 }).limit(5);

        return res.status(200).json({ products });


    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})



const getNewProducts = asyncHandler(async (req, res) => {
    try {

        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

        return res.status(200).json({ products });

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})



const getProductsByCategory = asyncHandler(async (req, res) => {


    try {

        const products = await Product.find().exec();
        const categories = await Category.find().exec();
        const uniqueCategories = new Set();
        const results = [];
        const categoriesResult = [];



        products.forEach((product) => {
            if (!uniqueCategories.has(product.category.toString())) {
                uniqueCategories.add(product.category.toString());
                results.push(product);
                categories.find((category) => {
                    if (category._id.toString() === product.category.toString()) {
                        categoriesResult.push(category);
                    }
                })
            }
        });


        return res.status(200).json({ products: results, categories: categoriesResult });


    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

})


const getRelatedProducts = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const otherProducts = await Product.find({ _id: { $ne: product._id } });

        const highestPrice = Math.max(...otherProducts.map(p => p.price));
        const lowestPrice = Math.min(...otherProducts.map(p => p.price));

        const averagePrice = (highestPrice + lowestPrice) / 2;

        const maxPrice = product.price + averagePrice;
        const minPrice = product.price - averagePrice;

        let relatedByCategory = otherProducts.filter(p => p.category.toString() === product.category.toString());
        
        let relatedByBrand = otherProducts.filter(p => p.brand.toString() === product.brand.toString());

        let result = [...new Set([...relatedByCategory, ...relatedByBrand])];

        if (result.length >= 4) {
            return res.status(200).json({ products: result });
        }

        let relatedByPrice = otherProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
        relatedByPrice = relatedByPrice.slice(0, 4);


        result = [...new Set([...result, ...relatedByPrice])];

        result = result.slice(0, 4);

        return res.status(200).json({ products: result });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    createProductReview,
    deleteProductReview,
    getTopProducts,
    getNewProducts,
    getProductsByCategory,
    getRelatedProducts
}
