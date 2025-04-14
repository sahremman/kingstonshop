/**
 * Kingston's Business Website - Main JavaScript
 * Contains shared functionality used across the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNav();
    
    // Newsletter Form Handling
    initNewsletterForm();
    
    // FAQ Accordion
    initFaqAccordion();
    
    // Modal Functionality
    initModals();
    
    // Scroll Animation
    initScrollAnimation();
    
    // Initialize data collection
    initDataCollection();
});

/**
 * Initialize Mobile Navigation
 */
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }
}

/**
 * Initialize Newsletter Form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validate email (simple validation)
            if (!validateEmail(email)) {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#c6131d';
                return;
            }
            
            // Simulate form submission (in a real implementation, this would be an API call)
            newsletterMessage.textContent = 'Thank you for subscribing!';
            newsletterMessage.style.color = '#4CAF50';
            emailInput.value = '';
            
            // Store subscriber data
            storeSubscriberData(email);
        });
    }
}

/**
 * Initialize FAQ Accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Toggle active class
                item.classList.toggle('active');
                
                // Toggle plus/minus icon
                const icon = question.querySelector('.faq-toggle i');
                if (icon) {
                    icon.classList.toggle('fa-plus');
                    icon.classList.toggle('fa-minus');
                }
                
                // Track FAQ interaction
                if (item.classList.contains('active')) {
                    const questionText = question.querySelector('h3').textContent;
                    trackUserInteraction('FAQ', 'Open', questionText);
                }
            });
        }
    });
}

/**
 * Initialize Modals
 */
function initModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Get all modal triggers
    const feedbackTrigger = document.getElementById('feedback-trigger');
    
    // Handle feedback modal
    if (feedbackTrigger) {
        const feedbackModal = document.getElementById('feedback-modal');
        
        feedbackTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            if (feedbackModal) {
                openModal(feedbackModal);
                trackUserInteraction('Modal', 'Open', 'Feedback');
            }
        });
    }
    
    // Handle service buttons
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceModal = document.getElementById('service-modal');
            
            if (serviceModal) {
                // Populate modal with service details (this would be more dynamic in a real implementation)
                const modalDetails = serviceModal.querySelector('#modal-service-details');
                
                if (modalDetails) {
                    modalDetails.innerHTML = `
                        <h2>${getServiceTitle(serviceType)}</h2>
                        <p>${getServiceDescription(serviceType)}</p>
                        <a href="contact.html?service=${serviceType}" class="btn btn-primary">Contact Us About This Service</a>
                    `;
                }
                
                openModal(serviceModal);
                trackUserInteraction('Modal', 'Open', `Service: ${getServiceTitle(serviceType)}`);
            }
        });
    });
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Initialize product modal functionality if on products page
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    if (viewDetailsButtons.length > 0) {
        const productModal = document.getElementById('product-modal');
        
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product');
                
                if (productModal) {
                    populateProductModal(productId);
                    openModal(productModal);
                    trackUserInteraction('Product', 'View', productId);
                }
            });
        });
        
        // Initialize quantity selectors
        const quantityMinusBtn = document.querySelector('.quantity-btn.minus');
        const quantityPlusBtn = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.querySelector('.quantity-input');
        
        if (quantityMinusBtn && quantityPlusBtn && quantityInput) {
            quantityMinusBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                value = value > 1 ? value - 1 : 1;
                quantityInput.value = value;
            });
            
            quantityPlusBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                value = value + 1;
                quantityInput.value = value;
            });
        }
        
        // Initialize add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productTitle = document.getElementById('modal-title').textContent;
                const quantity = document.querySelector('.quantity-input').value;
                
                alert(`Added ${quantity} ${productTitle}(s) to cart!`);
                closeModal(productModal);
                
                // Track add to cart
                trackUserInteraction('Cart', 'Add', `${productTitle} x${quantity}`);
            });
        }
    }
}

/**
 * Initialize Scroll Animation
 */
function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-right, .slide-in-left');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('active');
        });
    }
    
    // Animate stats counter if on about page
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
}

/**
 * Animate Counter
 * @param {HTMLElement} element - The counter element to animate
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // in milliseconds
    const step = Math.ceil(target / (duration / 16)); // 60fps
    
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            clearInterval(timer);
            element.textContent = target;
        } else {
            element.textContent = current;
        }
    }, 16);
}

/**
 * Open Modal
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

/**
 * Close Modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

/**
 * Populate Product Modal
 * @param {string} productId - The ID of the product to display
 */
function populateProductModal(productId) {
    // This would typically fetch data from an API or database
    // For this example, we'll use a simple object with product data
    const productData = getProductData(productId);
    
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');
    const modalSpecs = document.getElementById('modal-specs');
    
    if (modalTitle && modalPrice && modalDescription && modalImage && modalSpecs) {
        modalTitle.textContent = productData.name;
        modalPrice.textContent = productData.price;
        modalDescription.textContent = productData.description;
        modalImage.src = productData.imageSrc;
        modalImage.alt = productData.name;
        
        // Clear existing specs
        modalSpecs.innerHTML = '';
        
        // Add specs
        productData.specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            modalSpecs.appendChild(li);
        });
    }
}

/**
 * Get Product Data
 * @param {string} productId - The ID of the product
 * @returns {Object} Product data object
 */
function getProductData(productId) {
    // This would be replaced with actual data from a database or API
    const productDatabase = {
        'laptop': {
            name: 'High-Performance Laptop',
            price: '$699.99',
            description: 'A powerful laptop perfect for work and entertainment with the latest specifications and features.',
            imageSrc: 'images/product-laptop.jpg',
            specs: [
                'Intel Core i5 Processor',
                '8GB RAM',
                '512GB SSD Storage',
                '15.6" Full HD Display',
                'Windows 11 Operating System',
                'Up to 10 Hours Battery Life'
            ]
        },
        'smartphone': {
            name: 'Premium Smartphone',
            price: '$349.99',
            description: 'A feature-rich smartphone with excellent camera quality and long battery life.',
            imageSrc: 'images/product-smartphone.jpg',
            specs: [
                '6.5" AMOLED Display',
                '128GB Storage',
                '48MP Triple Camera System',
                '5000mAh Battery',
                'Fast Charging Support',
                'Android 13'
            ]
        },
        // Add more products as needed
    };
    
    // Return the product data or a default if not found
    return productDatabase[productId] || {
        name: 'Product',
        price: '$0.00',
        description: 'Product description not available.',
        imageSrc: 'images/placeholder.jpg',
        specs: ['Specification not available']
    };
}

/**
 * Get Service Title
 * @param {string} serviceType - The service type identifier
 * @returns {string} Service title
 */
function getServiceTitle(serviceType) {
    const serviceTitles = {
        'delivery': 'Fast Delivery Service',
        'repair': 'Electronics Repair Service',
        'support': 'Customer Support Service',
        'custom-order': 'Custom Order Service',
        'warranty': 'Product Warranty Service',
        'installation': 'Installation Service'
    };
    
    return serviceTitles[serviceType] || 'Service';
}

/**
 * Get Service Description
 * @param {string} serviceType - The service type identifier
 * @returns {string} Service description
 */
function getServiceDescription(serviceType) {
    const serviceDescriptions = {
        'delivery': 'Our fast delivery service ensures your products arrive at your doorstep within 24 hours for local orders.',
        'repair': 'Our skilled technicians can diagnose and repair a wide range of electronic devices with genuine parts and warranty.',
        'support': 'Our dedicated customer support team is available 7 days a week to assist you with any inquiries or issues.',
        'custom-order': 'We can source special products that aren\'t typically available in our store through our trusted supplier network.',
        'warranty': 'We stand behind the quality of our products with comprehensive warranty coverage and a hassle-free process.',
        'installation': 'Our professional installation team can set up your electronic devices, appliances, and other products.'
    };
    
    return serviceDescriptions[serviceType] || 'Service description not available.';
}

/**
 * Validate Email
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Initialize Data Collection
 * Sets up functionality for collecting user interaction data
 */
function initDataCollection() {
    // Track page view
    trackPageView();
    
    // Track form submissions
    trackForms();
    
    // Track outbound links
    trackOutboundLinks();
}

/**
 * Track Page View
 * Records data about the current page visit
 */
function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // In a real implementation, this would send data to an analytics service
    console.log('Page View Data:', pageData);
    
    // Store in local storage for demo purposes
    storeAnalyticsData('pageView', pageData);
}

/**
 * Track Forms
 * Sets up tracking for form submissions
 */
function trackForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Don't track if the form is the newsletter form (already handled)
            if (this.id === 'newsletter-form') return;
            
            const formData = {
                formId: this.id || 'unknown',
                formAction: this.action || 'none',
                formFields: getFormFields(this),
                timestamp: new Date().toISOString()
            };
            
            // In a real implementation, this would send data to an analytics service
            console.log('Form Submission Data:', formData);
            
            // Store in local storage for demo purposes
            storeAnalyticsData('formSubmission', formData);
        });
    });
}

/**
 * Get Form Fields
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Object containing field names and types
 */
function getFormFields(form) {
    const fields = {};
    const elements = form.elements;
    
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.name && element.type !== 'submit' && element.type !== 'reset' && element.type !== 'button') {
            fields[element.name] = element.type;
        }
    }
    
    return fields;
}

/**
 * Track Outbound Links
 * Sets up tracking for clicks on links that lead outside the site
 */
function trackOutboundLinks() {
    const links = document.querySelectorAll('a');
    const currentDomain = window.location.hostname;
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            // Check if it's an external link
            if (link.hostname && link.hostname !== currentDomain) {
                const linkData = {
                    url: link.href,
                    text: link.textContent.trim(),
                    timestamp: new Date().toISOString()
                };
                
                // In a real implementation, this would send data to an analytics service
                console.log('Outbound Link Click:', linkData);
                
                // Store in local storage for demo purposes
                storeAnalyticsData('outboundLink', linkData);
            }
        });
    });
}

/**
 * Track User Interaction
 * @param {string} category - The interaction category
 * @param {string} action - The interaction action
 * @param {string} label - The interaction label
 */
function trackUserInteraction(category, action, label) {
    const interactionData = {
        category: category,
        action: action,
        label: label,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    // In a real implementation, this would send data to an analytics service
    console.log('User Interaction:', interactionData);
    
    // Store in local storage for demo purposes
    storeAnalyticsData('userInteraction', interactionData);
}

/**
 * Store Subscriber Data
 * @param {string} email - The subscriber's email
 */
function storeSubscriberData(email) {
    const subscriberData = {
        email: email,
        timestamp: new Date().toISOString(),
        source: window.location.pathname
    };
    
    // In a real implementation, this would send data to a server
    console.log('New Subscriber:', subscriberData);
    
    // Store in local storage for demo purposes
    let subscribers = JSON.parse(localStorage.getItem('kingstonBusinessSubscribers')) || [];
    subscribers.push(subscriberData);
    localStorage.setItem('kingstonBusinessSubscribers', JSON.stringify(subscribers));
}

/**
 * Store Analytics Data
 * @param {string} type - The type of analytics data
 * @param {Object} data - The data to store
 */
function storeAnalyticsData(type, data) {
    // In a real implementation, this would send data to a server
    // For this demo, we'll store it in localStorage
    let analyticsData = JSON.parse(localStorage.getItem('kingstonBusinessAnalytics')) || {};
    
    if (!analyticsData[type]) {
        analyticsData[type] = [];
    }
    
    analyticsData[type].push(data);
    localStorage.setItem('kingstonBusinessAnalytics', JSON.stringify(analyticsData));
}
