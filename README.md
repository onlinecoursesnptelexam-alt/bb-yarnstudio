# BB YarnStudio - Admin Panel with Image Upload

A complete e-commerce admin system for managing crochet products with real image upload and file storage capabilities.

## Features

- **Product Management**: Add, edit, and delete products
- **Image Upload**: Real image upload to server folder
- **File Storage**: Images saved to `productimg/` folder
- **Data Persistence**: Product info saved to `productinfo.json`
- **Real-time Updates**: Changes immediately reflect on main site
- **Fallback System**: Works offline with localStorage

## Setup Instructions

### 1. Install Node.js
Download and install Node.js from [https://nodejs.org](https://nodejs.org)

### 2. Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
or for development with auto-restart:
```bash
npm run dev
```

### 4. Access the Application
- **Main Site**: http://localhost:3000/index.html
- **Admin Panel**: http://localhost:3000/admin.html

## Usage

### Adding Products
1. Go to admin panel (http://localhost:3000/admin.html)
2. Fill in product details:
   - Product Name
   - Description
   - Upload Image (required)
   - Discount Price
   - Original Price
3. Click "Add Product"

### Managing Products
- **Edit**: Click "Edit" button on any product
- **Delete**: Click "Delete" button (removes image file too)
- **View**: All products displayed in admin panel

### File Structure
```
Yarnstudio/
├── server.js              # Node.js server
├── package.json           # Dependencies
├── admin.html             # Admin panel
├── index.html             # Main website
├── productinfo.json       # Product database
├── productimg/            # Product images folder
├── script.js              # Frontend JavaScript
├── style.css              # Styles
└── README.md              # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (with image upload)
- `PUT /api/products/:id` - Update product (with optional image upload)
- `DELETE /api/products/:id` - Delete product (and associated image)

## Image Upload

- **Supported Formats**: JPG, JPEG, PNG, GIF
- **Max File Size**: 5MB
- **Storage**: Images saved to `productimg/` folder
- **Naming**: Automatic unique filename generation
- **Fallback**: Default image if upload fails

## Features in Detail

### Admin Panel
- Clean, responsive interface
- Real-time image preview
- Form validation
- Error handling
- Success notifications

### Main Website
- Dynamic product loading
- Shopping cart functionality
- Responsive design
- Mobile drawer navigation
- Sticky header

### Data Management
- Primary storage: `productinfo.json`
- Fallback: localStorage
- Image files: `productimg/` folder
- Automatic backup on server save

## Troubleshooting

### Server Won't Start
- Make sure Node.js is installed
- Check if port 3000 is available
- Run `npm install` to install dependencies

### Images Not Uploading
- Check `productimg/` folder exists
- Verify image file format (JPG, PNG, GIF)
- Check file size (max 5MB)

### Products Not Loading
- Check server is running
- Verify `productinfo.json` exists
- Check browser console for errors

## Development

### Adding New Features
- Admin routes in `server.js`
- Frontend logic in `admin.html`
- Main site logic in `script.js`
- Styles in `style.css`

### File Upload
Uses `multer` middleware for handling file uploads with:
- Disk storage
- File validation
- Unique naming
- Error handling

## Production Deployment

For production deployment:
1. Use a process manager like PM2
2. Set up proper file permissions
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure backup for `productinfo.json`

## License

MIT License - BB YarnStudio
