const multer = require('multer');
const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const upload = multer({ storage, fileFilter })
const uploadSingle = upload.single('image')



const uploadImage = (req, res) => {

    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ error: err.message })
        } else if (req.file) {

            const { id, index } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'Please specify the product id' })
            }


            const product = await Product.findById(id)


            if (!product) {
                return res.status(400).json({ error: 'Product not found' })
            }


            

            product.images[index] = `/uploads/${req.file.filename}`

            await product.save()

            return res.status(200).json({
                message: 'file uploaded successfully',
                image: `/uploads/${req.file.filename}`
            })
        } else {
            console.log('No file uploaded')
            return res.status(400).json({ error: 'No file uploaded' })
        }
    })
}


const deleteImage = asyncHandler(async (req, res) => {
    try {
        const { id, index } = req.body;


        if (!id || (!index && index !== 0)) {
            return res.status(400).json({ message: 'Please specify the image correctly' })
        }


        const product = await Product.findById(id)


        if (!product) {
            return res.status(400).json({ message: 'Product not found' })
        }

        if(product.images.length === 1){
            return res.status(402).json({ message: 'Product must have at least one image' })
        }

        if (index < 0 || index >= product.images.length) {
            return res.status(400).json({ message: 'Invalid image index' })
        }

        product.images.splice(index, 1)
        await product.save()

        return res.status(200).json({ message: 'Image deleted successfully', product });


    } catch (error) {
        return res.status(400).json({ error: 'Something went wrong' })
    }

})



module.exports = {
    uploadImage,
    deleteImage
}