# Kingston's Business Website

A professional website for Kingston's Business, a retail establishment in Gardnesville Township that sells electronics, groceries, and other products.

## Features

- Responsive design that works on all devices
- Product catalog with filtering capabilities
- Services information and booking
- About page with company history and team information
- Contact form with integrated data collection
- Newsletter subscription functionality
- Customer data collection and analysis capabilities

## Structure

The website consists of 5 main pages:

1. **Home** (`index.html`): Landing page with featured products, services overview, and testimonials
2. **Products** (`products.html`): Complete product catalog with filtering by category
3. **Services** (`services.html`): Detailed information about available services with a service request form
4. **About** (`about.html`): Company history, mission, team, and community involvement
5. **Contact** (`contact.html`): Contact information, contact form, and location map

## Files and Directories

```
kingston-business/
│
├── index.html                # Homepage
├── products.html             # Products page
├── services.html             # Services page
├── about.html                # About page
├── contact.html              # Contact page
├── README.md                 # Project documentation
│
├── css/
│   └── styles.css            # Main stylesheet
│
├── js/
│   ├── main.js               # Main JavaScript file
│   ├── data-collection.js    # Customer data collection functionality
│   ├── products.js           # Product-specific functionality
│   ├── services.js           # Service-specific functionality
│   ├── about.js              # About page animations
│   └── contact.js            # Contact form handling
│
└── images/
    ├── logo.png              # Kingston's Business logo
    ├── hero-bg.jpg           # Hero section background
    ├── product-*.jpg         # Product images
    ├── team-*.jpg            # Team member photos
    ├── testimonial-*.jpg     # Testimonial author photos
    ├── community-*.jpg       # Community involvement photos
    └── cta-bg.jpg            # Call-to-action background
```

## Deployment Instructions

### Deploying to GitHub Pages

1. **Create a GitHub Repository**
   - Sign in to your GitHub account
   - Click the "+" icon in the top-right corner and select "New repository"
   - Name your repository (e.g., "kingston-business")
   - Set the repository to "Public"
   - Click "Create repository"

2. **Prepare Your Files**
   - Ensure all files are organized according to the structure above
   - Make sure all file references (CSS, JS, images) use relative paths

3. **Upload Your Files**
   - You can upload files directly through the GitHub web interface:
     - In your repository, click "Add file" > "Upload files"
     - Drag and drop all your website files and folders
     - Add a commit message (e.g., "Initial website upload")
     - Click "Commit changes"
   
   - Or use Git commands if you're familiar with them:
     ```
     git clone https://github.com/your-username/kingston-business.git
     cd kingston-business
     # Copy all your website files to this directory
     git add .
     git commit -m "Initial website upload"
     git push origin main
     ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings"
   - Scroll down to the "GitHub Pages" section
   - Under "Source," select "main" branch
   - Click "Save"
   - GitHub will provide you with a URL (e.g., https://your-username.github.io/kingston-business/)

5. **Verify Deployment**
   - Visit the provided URL to make sure your site is working correctly
   - Test all links and functionality
   - Test on different devices and browsers

### Adding Your Logo

1. Replace the placeholder `logo.png` in the images folder with your actual Kingston's Business logo.
2. Ensure the logo has the correct dimensions and format (PNG recommended for logos).

### Adding Customer Data Collection

The website includes data collection functionality that allows you to:

- Track user sessions and behavior
- Collect newsletter subscriptions
- Monitor product interest
- Analyze user interactions

This data is currently stored in the browser's localStorage for demonstration purposes. In a production environment, you would:

1. Set up a server to receive and store this data
2. Modify the data collection scripts to send data to your server
3. Create a secure admin interface to view and analyze the data

## Customization

### Changing Content

1. Edit the HTML files to update text content, product listings, services, etc.
2. Update image references to point to your own images in the images folder
3. Modify contact information, business hours, and address as needed

### Modifying Design

1. Edit the `styles.css` file to change colors, typography, spacing, etc.
   - Key color variables are defined at the top of the CSS file using CSS custom properties:
     ```css
     :root {
         --primary-color: #c6131d;        /* Kingston red */
         --primary-dark: #9e0f18;         /* Darker red for hover states */
         --secondary-color: #222222;      /* Dark gray/almost black */
         /* Additional color variables... */
     }
     ```
   - Change these values to match your brand colors
   - Typography can be customized by modifying the font-family values

2. Customize JavaScript functionality in the respective JS files
   - Modify form handling, animations, and interactive features

### Adding Products

1. To add new products, locate the product section in `products.html`
2. Follow the existing product card structure:
   ```html
   <div class="product-card" data-category="category-name">
       <div class="product-image">
           <img src="images/product-name.jpg" alt="Product Name">
           <div class="product-overlay">
               <button class="view-details-btn" data-product="product-id">View Details</button>
           </div>
       </div>
       <div class="product-info">
           <h3>Product Name</h3>
           <p class="product-price">$XX.XX</p>
           <p class="product-description">Description text...</p>
       </div>
   </div>
   ```
3. Add product details to the JavaScript product database in `main.js`

## Technical Details

### Responsive Design

The website implements responsive design principles using:

- Fluid layouts with percentage-based widths
- CSS Grid and Flexbox for modern layouts
- Media queries targeting different screen sizes:
  ```css
  /* Tablet devices */
  @media (max-width: 991px) {
      /* Styles for tablets */
  }
  
  /* Mobile devices */
  @media (max-width: 768px) {
      /* Styles for mobile phones */
  }
  ```

### Browser Compatibility

The website is compatible with:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Opera (latest 2 versions)

Internet Explorer is not supported.

### Performance Optimization

1. **Image Optimization**
   - All images should be compressed before uploading
   - Consider using WebP format for better compression
   - Use appropriately sized images for different screen sizes

2. **Code Minification**
   - In a production environment, consider minifying CSS and JavaScript files
   - Use tools like Terser for JavaScript and CSSNano for CSS

3. **Lazy Loading**
   - The website implements native lazy loading for images using the `loading="lazy"` attribute
   - Further optimization can be achieved with JavaScript-based lazy loading

### Security Considerations

1. **Form Security**
   - Currently, forms submit data to browser storage for demonstration
   - For production, implement server-side validation and secure data handling
   - Consider adding CAPTCHA to prevent spam submissions

2. **Data Collection and Privacy**
   - The website includes comprehensive data collection capabilities
   - Ensure you have appropriate privacy policies in place
   - Comply with relevant data protection regulations (GDPR, CCPA, etc.)
   - Add cookie consent notices if storing cookies

## Maintenance

### Regular Updates

1. **Content Updates**
   - Regularly update product information, prices, and availability
   - Keep service information current
   - Update team information as needed

2. **Technical Maintenance**
   - Check for broken links
   - Test contact forms and other interactive elements
   - Verify that all pages load correctly
   - Test on new browser versions as they're released

### Backups

1. **GitHub Backups**
   - GitHub keeps a history of all commits, serving as a basic backup system
   - For additional security, consider downloading a zip file of your repository periodically

2. **Local Backups**
   - Maintain a local copy of your website files
   - Consider using version control even for your local copies

## Future Enhancements

1. **E-commerce Integration**
   - Add shopping cart functionality
   - Integrate payment processing
   - Implement inventory management

2. **User Accounts**
   - Allow customers to create accounts
   - Implement order history and tracking
   - Add wishlist functionality

3. **Advanced Analytics**
   - Integrate with Google Analytics or similar services
   - Create custom dashboards for business insights
   - Implement A/B testing for UI improvements

4. **Content Management System**
   - Implement a CMS for easier content updates
   - Allow non-technical staff to update products and services

## Support and Resources

For additional help with GitHub Pages, refer to the [official GitHub Pages documentation](https://docs.github.com/en/pages).

For web development assistance, consider resources such as:
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3Schools](https://www.w3schools.com/)
- [CSS-Tricks](https://css-tricks.com/)

## License

This website template is available for use by Kingston's Business. Modification and distribution rights should be discussed with the original developer.

---

© 2025 Kingston's Business. All Rights Reserved.
