const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const addCategory = asyncHandler(async (req, res) => {
    try {


        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }); // case insensitive
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name
        })


        category.save();
        return res.status(200).json({ category })


    } catch (error) {
        return res.status(400).json({ error })
    }
})


const deleteCategory = asyncHandler(async (req, res) => {


    try {

        const { categoryId } = req.params;

        const existingCategory = await Category.findById(categoryId);

        if (!existingCategory) {
            return res.status(400).json({ message: 'Category not found' });
        }

        await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({ message: 'Category deleted successfully' })



    } catch (error) {

        return res.status(400).json({ message: error.message })
    }


})


const updateCategory = asyncHandler(async (req, res) => {

    try {

        const { name } = req.body;
        const { categoryId } = req.params;
        const categories = await Category.find();

        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(400).json({ message: 'Category not found' });
        }


        if (!name) {
            return res.status(401).json({ message: 'Please add all fields' });
        }

        const duplicateCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: categoryId } });
        if (duplicateCategory) {
            return res.status(402).json({ message: 'Category already exists' });
        }

        existingCategory.name = name;
        existingCategory.save();

        return res.status(200).json({ existingCategory })

    } catch (error) {

        return res.status(400).json({ message: error.message })

    }


})


const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json(categories)

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})


const readCategory = asyncHandler(async (req, res) => {
    try {

        const { productId } = req.params;

        const product = await Product.findById(productId);


        const id = product.category;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: 'Category not found' })
        }


        return res.status(200).json(category)


    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})


module.exports = { addCategory, deleteCategory, updateCategory, getCategories, readCategory }