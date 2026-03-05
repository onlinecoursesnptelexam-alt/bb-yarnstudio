const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Define absolute paths
const productinfoPath = path.join(__dirname, 'productinfo.json');
const productimgDir = path.join(__dirname, 'productimg');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, productimgDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Ensure productimg folder exists
if (!fs.existsSync(productimgDir)) {
    fs.mkdirSync(productimgDir, { recursive: true });
}

// Ensure productinfo.json exists
if (!fs.existsSync(productinfoPath)) {
    const defaultProducts = [
        {
            id: 1,
            name: 'Crochet Handbag',
            description: 'Stylish handmade crochet handbag.',
            image: 'productimg/handbag.jpg',
            discountPrice: 999,
            originalPrice: 1499
        },
        {
            id: 2,
            name: 'Crochet Summer Top',
            description: 'Lightweight and breathable design.',
            image: 'productimg/top.jpg',
            discountPrice: 799,
            originalPrice: 1199
        }
    ];
    fs.writeFileSync(productinfoPath, JSON.stringify(defaultProducts, null, 2));
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productinfoPath, 'utf8'));
        res.json(products);
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ error: 'Error reading products' });
    }
});

// Add new product
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productinfoPath, 'utf8'));
        
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: req.body.name,
            description: req.body.description,
            image: req.file ? 'productimg/' + req.file.filename : req.body.image || 'productimg/default.jpg',
            discountPrice: parseInt(req.body.discountPrice),
            originalPrice: parseInt(req.body.originalPrice)
        };
        
        products.push(newProduct);
        fs.writeFileSync(productinfoPath, JSON.stringify(products, null, 2));
        
        res.json(newProduct);
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Error saving product' });
    }
});

// Update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productinfoPath, 'utf8'));
        const index = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update product data
        products[index] = {
            ...products[index],
            name: req.body.name,
            description: req.body.description,
            discountPrice: parseInt(req.body.discountPrice),
            originalPrice: parseInt(req.body.originalPrice)
        };
        
        // Update image if new one was uploaded
        if (req.file) {
            products[index].image = 'productimg/' + req.file.filename;
        } else if (req.body.image) {
            products[index].image = req.body.image;
        }
        
        fs.writeFileSync(productinfoPath, JSON.stringify(products, null, 2));
        
        res.json(products[index]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productinfoPath, 'utf8'));
        const index = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Delete associated image file if it exists
        const product = products[index];
        if (product.image && product.image.startsWith('productimg/')) {
            const imagePath = path.join(__dirname, product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        products.splice(index, 1);
        fs.writeFileSync(productinfoPath, JSON.stringify(products, null, 2));
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Admin panel: http://localhost:' + PORT + '/admin.html');
    console.log('Main site: http://localhost:' + PORT + '/index.html');
});
