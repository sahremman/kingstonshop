/**
 * Kingston's Business Website - Data Collection
 * This file contains functions for collecting, processing, and analyzing customer data
 */

// Initialize data collection system
document.addEventListener('DOMContentLoaded', function() {
    // Set up session tracking
    initSession();
    
    // Track user behavior
    trackUserBehavior();
    
    // Add admin functions if on admin page
    if (window.location.pathname.includes('admin')) {
        setupAdminInterface();
    }
});

/**
 * Initialize Session
 * Creates a unique session ID and stores basic information
 */
function initSession() {
    // Generate a session ID if one doesn't exist
    if (!sessionStorage.getItem('sessionId')) {
        const sessionId = generateUniqueId();
        sessionStorage.setItem('sessionId', sessionId);
        
        // Record session start data
        const sessionData = {
            id: sessionId,
            startTime: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language
        };
        
        // Store session data
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        
        // Save to persistent storage for analytics
        let sessions = JSON.parse(localStorage.getItem('kingstonBusinessSessions')) || [];
        sessions.push(sessionData);
        localStorage.setItem('kingstonBusinessSessions', JSON.stringify(sessions));
    }
}

/**
 * Track User Behavior
 * Records various user interactions with the website
 */
function trackUserBehavior() {
    // Track mouse movement and clicks
    trackMouseActivity();
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track time spent on page
    trackTimeOnPage();
    
    // Track product interest
    trackProductInterest();
}

/**
 * Track Mouse Activity
 * Records mouse movements and clicks for heatmap analysis
 */
function trackMouseActivity() {
    let mouseData = [];
    const sampleRate = 100; // Record every 100ms to avoid excessive data
    let lastRecordTime = Date.now();
    
    // Track mouse movement
    document.addEventListener('mousemove', function(event) {
        const currentTime = Date.now();
        
        // Sample data at the specified rate
        if (currentTime - lastRecordTime >= sampleRate) {
            mouseData.push({
                type: 'move',
                x: event.clientX,
                y: event.clientY,
                time: new Date().toISOString()
            });
            
            lastRecordTime = currentTime;
            
            // Limit the amount of data stored
            if (mouseData.length > 1000) {
                // Save the data and clear the array
                saveMouseData();
            }
        }
    });
    
    // Track clicks
    document.addEventListener('click', function(event) {
        const clickData = {
            type: 'click',
            x: event.clientX,
            y: event.clientY,
            element: getElementPath(event.target),
            time: new Date().toISOString()
        };
        
        mouseData.push(clickData);
    });
    
    // Save data when user leaves the page
    window.addEventListener('beforeunload', function() {
        saveMouseData();
    });
    
    // Save mouse data to storage
    function saveMouseData() {
        if (mouseData.length === 0) return;
        
        const sessionId = sessionStorage.getItem('sessionId');
        const pageUrl = window.location.pathname;
        
        const dataPackage = {
            sessionId: sessionId,
            pageUrl: pageUrl,
            data: mouseData,
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would be sent to a server
        // For this demo, we'll store a summary in localStorage
        let mouseActivityData = JSON.parse(localStorage.getItem('kingstonBusinessMouseData')) || [];
        
        // Store a summary to prevent excessive storage use
        const summary = {
            sessionId: sessionId,
            pageUrl: pageUrl,
            timestamp: new Date().toISOString(),
            moveCount: mouseData.filter(item => item.type === 'move').length,
            clickCount: mouseData.filter(item => item.type === 'click').length,
            clicks: mouseData.filter(item => item.type === 'click')
        };
        
        mouseActivityData.push(summary);
        localStorage.setItem('kingstonBusinessMouseData', JSON.stringify(mouseActivityData));
        
        // Clear the array after saving
        mouseData = [];
    }
}

/**
 * Track Scroll Depth
 * Records how far users scroll down each page
 */
function trackScrollDepth() {
    let maxScrollPercentage = 0;
    let scrollMilestones = [25, 50, 75, 100];
    let reachedMilestones = [];
    
    window.addEventListener('scroll', function() {
        // Calculate scroll percentage
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);
        
        // Update maximum scroll depth
        if (scrollPercentage > maxScrollPercentage) {
            maxScrollPercentage = scrollPercentage;
            
            // Check if we've hit any milestones
            scrollMilestones.forEach(milestone => {
                if (scrollPercentage >= milestone && !reachedMilestones.includes(milestone)) {
                    reachedMilestones.push(milestone);
                    
                    // Record milestone
                    recordScrollMilestone(milestone);
                }
            });
        }
    });
    
    // Save data when user leaves the page
    window.addEventListener('beforeunload', function() {
        saveScrollData();
    });
    
    function recordScrollMilestone(milestone) {
        const scrollData = {
            sessionId: sessionStorage.getItem('sessionId'),
            pageUrl: window.location.pathname,
            milestone: milestone,
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would be sent to a server
        console.log('Scroll Milestone:', scrollData);
    }
    
    function saveScrollData() {
        const scrollData = {
            sessionId: sessionStorage.getItem('sessionId'),
            pageUrl: window.location.pathname,
            maxScrollPercentage: maxScrollPercentage,
            reachedMilestones: reachedMilestones,
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would be sent to a server
        // For this demo, we'll store in localStorage
        let scrollDepthData = JSON.parse(localStorage.getItem('kingstonBusinessScrollData')) || [];
        scrollDepthData.push(scrollData);
        localStorage.setItem('kingstonBusinessScrollData', JSON.stringify(scrollDepthData));
    }
}

/**
 * Track Time on Page
 * Records how long users spend on each page
 */
function trackTimeOnPage() {
    const startTime = Date.now();
    let timeSpent = 0;
    let isActive = true;
    
    // Check if user is active on the page
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            // User left the page
            isActive = false;
            timeSpent += Date.now() - startTime;
        } else {
            // User returned to the page
            isActive = true;
        }
    });
    
    // Save data when user leaves the page
    window.addEventListener('beforeunload', function() {
        if (isActive) {
            timeSpent += Date.now() - startTime;
        }
        
        saveTimeData();
    });
    
    function saveTimeData() {
        const timeData = {
            sessionId: sessionStorage.getItem('sessionId'),
            pageUrl: window.location.pathname,
            timeSpentMs: timeSpent,
            timeSpentReadable: formatTime(timeSpent),
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would be sent to a server
        // For this demo, we'll store in localStorage
        let timeOnPageData = JSON.parse(localStorage.getItem('kingstonBusinessTimeData')) || [];
        timeOnPageData.push(timeData);
        localStorage.setItem('kingstonBusinessTimeData', JSON.stringify(timeOnPageData));
    }
    
    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
}

/**
 * Track Product Interest
 * Records which products users are interested in
 */
function trackProductInterest() {
    // Track product views
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Track when a product card is visible in the viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Product is visible, record view after a short delay to ensure actual interest
                    setTimeout(() => {
                        const productElement = entry.target.querySelector('h3');
                        const productName = productElement ? productElement.textContent : 'Unknown Product';
                        
                        recordProductView(productName);
                    }, 2000); // 2 second delay
                    
                    // Unobserve after recording
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 }); // 70% of the product must be visible
        
        observer.observe(card);
    });
    
    function recordProductView(productName) {
        const productData = {
            sessionId: sessionStorage.getItem('sessionId'),
            productName: productName,
            action: 'view',
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would be sent to a server
        // For this demo, we'll store in localStorage
        let productInterestData = JSON.parse(localStorage.getItem('kingstonBusinessProductInterest')) || [];
        productInterestData.push(productData);
        localStorage.setItem('kingstonBusinessProductInterest', JSON.stringify(productInterestData));
    }
}

/**
 * Get Element Path
 * Returns a CSS-like selector path for the clicked element
 * @param {HTMLElement} element - The element to get the path for
 * @returns {string} The element path
 */
function getElementPath(element) {
    const path = [];
    let currentElement = element;
    
    while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
        let selector = currentElement.nodeName.toLowerCase();
        
        if (currentElement.id) {
            selector += `#${currentElement.id}`;
            path.unshift(selector);
            break;
        } else {
            let sibling = currentElement;
            let siblingIndex = 1;
            
            while (sibling = sibling.previousElementSibling) {
                if (sibling.nodeName.toLowerCase() === selector) {
                    siblingIndex++;
                }
            }
            
            if (siblingIndex > 1) {
                selector += `:nth-of-type(${siblingIndex})`;
            }
        }
        
        path.unshift(selector);
        currentElement = currentElement.parentNode;
    }
    
    return path.join(' > ');
}

/**
 * Generate Unique ID
 * Creates a unique identifier for session tracking
 * @returns {string} A unique ID
 */
function generateUniqueId() {
    // Create a timestamp component
    const timestamp = new Date().getTime();
    
    // Create a random component
    const random = Math.floor(Math.random() * 1000000);
    
    // Combine and convert to base 36 (alphanumeric)
    return `${timestamp.toString(36)}-${random.toString(36)}`;
}

/**
 * Setup Admin Interface
 * Creates the data visualization interface for admin users
 */
function setupAdminInterface() {
    // Create tabs for different data types
    createDataTabs();
    
    // Load and display the data
    displaySessionData();
    displayNewsletterData();
    displayInteractionData();
    displayProductInterestData();
}

/**
 * Create Data Tabs
 * Sets up the tabbed interface for the admin panel
 */
function createDataTabs() {
    const adminContainer = document.getElementById('admin-container');
    
    if (!adminContainer) return;
    
    // Create tab structure
    const tabsHtml = `
        <div class="admin-tabs">
            <button class="tab-btn active" data-tab="sessions">Sessions</button>
            <button class="tab-btn" data-tab="newsletter">Newsletter</button>
            <button class="tab-btn" data-tab="interactions">Interactions</button>
            <button class="tab-btn" data-tab="products">Product Interest</button>
            <button class="tab-btn" data-tab="export">Export Data</button>
        </div>
        <div class="tab-content">
            <div id="sessions-tab" class="tab-pane active">
                <h2>Session Data</h2>
                <div id="session-stats" class="stat-cards"></div>
                <div id="session-chart" class="chart-container"></div>
                <div id="session-table" class="data-table"></div>
            </div>
            <div id="newsletter-tab" class="tab-pane">
                <h2>Newsletter Subscribers</h2>
                <div id="newsletter-stats" class="stat-cards"></div>
                <div id="newsletter-chart" class="chart-container"></div>
                <div id="newsletter-table" class="data-table"></div>
            </div>
            <div id="interactions-tab" class="tab-pane">
                <h2>User Interactions</h2>
                <div id="interaction-stats" class="stat-cards"></div>
                <div id="interaction-chart" class="chart-container"></div>
                <div id="interaction-table" class="data-table"></div>
            </div>
            <div id="products-tab" class="tab-pane">
                <h2>Product Interest</h2>
                <div id="product-stats" class="stat-cards"></div>
                <div id="product-chart" class="chart-container"></div>
                <div id="product-table" class="data-table"></div>
            </div>
            <div id="export-tab" class="tab-pane">
                <h2>Export Data</h2>
                <div class="export-options">
                    <button id="export-all" class="btn btn-primary">Export All Data</button>
                    <button id="export-sessions" class="btn btn-secondary">Export Sessions</button>
                    <button id="export-newsletter" class="btn btn-secondary">Export Subscribers</button>
                    <button id="export-interactions" class="btn btn-secondary">Export Interactions</button>
                    <button id="export-products" class="btn btn-secondary">Export Product Interest</button>
                </div>
                <div id="export-result"></div>
            </div>
        </div>
    `;
    
    adminContainer.innerHTML = tabsHtml;
    
    // Add tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Add export functionality
    setupExportButtons();
}

/**
 * Display Session Data
 * Shows statistics and visualizations of user sessions
 */
function displaySessionData() {
    const sessionStats = document.getElementById('session-stats');
    const sessionChart = document.getElementById('session-chart');
    const sessionTable = document.getElementById('session-table');
    
    if (!sessionStats || !sessionChart || !sessionTable) return;
    
    // Get session data
    const sessions = JSON.parse(localStorage.getItem('kingstonBusinessSessions')) || [];
    
    if (sessions.length === 0) {
        sessionStats.innerHTML = '<p>No session data available.</p>';
        return;
    }
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const uniqueUsers = new Set(sessions.map(session => session.userAgent)).size;
    
    // Display statistics
    sessionStats.innerHTML = `
        <div class="stat-card">
            <h3>Total Sessions</h3>
            <p>${totalSessions}</p>
        </div>
        <div class="stat-card">
            <h3>Unique Users</h3>
            <p>${uniqueUsers}</p>
        </div>
    `;
    
    // Create table
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Start Time</th>
                    <th>Referrer</th>
                    <th>Device</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add the first 20 sessions (to avoid excessive rendering)
    sessions.slice(0, 20).forEach(session => {
        tableHtml += `
            <tr>
                <td>${session.id}</td>
                <td>${new Date(session.startTime).toLocaleString()}</td>
                <td>${session.referrer || 'Direct'}</td>
                <td>${detectDevice(session.userAgent)}</td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    sessionTable.innerHTML = tableHtml;
}

/**
 * Display Newsletter Data
 * Shows statistics and visualizations of newsletter subscribers
 */
function displayNewsletterData() {
    const newsletterStats = document.getElementById('newsletter-stats');
    const newsletterChart = document.getElementById('newsletter-chart');
    const newsletterTable = document.getElementById('newsletter-table');
    
    if (!newsletterStats || !newsletterChart || !newsletterTable) return;
    
    // Get newsletter data
    const subscribers = JSON.parse(localStorage.getItem('kingstonBusinessSubscribers')) || [];
    
    if (subscribers.length === 0) {
        newsletterStats.innerHTML = '<p>No subscriber data available.</p>';
        return;
    }
    
    // Calculate statistics
    const totalSubscribers = subscribers.length;
    
    // Group subscribers by source page
    const sourcePages = {};
    subscribers.forEach(sub => {
        const source = sub.source || 'unknown';
        sourcePages[source] = (sourcePages[source] || 0) + 1;
    });
    
    // Display statistics
    newsletterStats.innerHTML = `
        <div class="stat-card">
            <h3>Total Subscribers</h3>
            <p>${totalSubscribers}</p>
        </div>
    `;
    
    // Create table
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Date Subscribed</th>
                    <th>Source Page</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add all subscribers
    subscribers.forEach(sub => {
        tableHtml += `
            <tr>
                <td>${sub.email}</td>
                <td>${new Date(sub.timestamp).toLocaleString()}</td>
                <td>${sub.source || 'unknown'}</td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    newsletterTable.innerHTML = tableHtml;
}

/**
 * Display Interaction Data
 * Shows statistics and visualizations of user interactions
 */
function displayInteractionData() {
    const interactionStats = document.getElementById('interaction-stats');
    const interactionChart = document.getElementById('interaction-chart');
    const interactionTable = document.getElementById('interaction-table');
    
    if (!interactionStats || !interactionChart || !interactionTable) return;
    
    // Get analytics data
    const analyticsData = JSON.parse(localStorage.getItem('kingstonBusinessAnalytics')) || {};
    const interactions = analyticsData.userInteraction || [];
    
    if (interactions.length === 0) {
        interactionStats.innerHTML = '<p>No interaction data available.</p>';
        return;
    }
    
    // Calculate statistics
    const totalInteractions = interactions.length;
    
    // Group interactions by category
    const categories = {};
    interactions.forEach(interaction => {
        const category = interaction.category || 'unknown';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    // Display statistics
    interactionStats.innerHTML = `
        <div class="stat-card">
            <h3>Total Interactions</h3>
            <p>${totalInteractions}</p>
        </div>
    `;
    
    // Add category stats
    Object.keys(categories).forEach(category => {
        interactionStats.innerHTML += `
            <div class="stat-card">
                <h3>${category} Interactions</h3>
                <p>${categories[category]}</p>
            </div>
        `;
    });
    
    // Create table
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Action</th>
                    <th>Label</th>
                    <th>Page</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add the first 50 interactions (to avoid excessive rendering)
    interactions.slice(0, 50).forEach(interaction => {
        tableHtml += `
            <tr>
                <td>${interaction.category}</td>
                <td>${interaction.action}</td>
                <td>${interaction.label}</td>
                <td>${interaction.page}</td>
                <td>${new Date(interaction.timestamp).toLocaleString()}</td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    interactionTable.innerHTML = tableHtml;
}

/**
 * Display Product Interest Data
 * Shows statistics and visualizations of product interest
 */
function displayProductInterestData() {
    const productStats = document.getElementById('product-stats');
    const productChart = document.getElementById('product-chart');
    const productTable = document.getElementById('product-table');
    
    if (!productStats || !productChart || !productTable) return;
    
    // Get product interest data
    const productInterest = JSON.parse(localStorage.getItem('kingstonBusinessProductInterest')) || [];
    
    if (productInterest.length === 0) {
        productStats.innerHTML = '<p>No product interest data available.</p>';
        return;
    }
    
    // Calculate statistics
    const totalViews = productInterest.length;
    
    // Group by product
    const products = {};
    productInterest.forEach(item => {
        const product = item.productName || 'unknown';
        products[product] = (products[product] || 0) + 1;
    });
    
    // Display statistics
    productStats.innerHTML = `
        <div class="stat-card">
            <h3>Total Product Views</h3>
            <p>${totalViews}</p>
        </div>
    `;
    
    // Add top products
    const topProducts = Object.entries(products)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    topProducts.forEach(([product, views]) => {
        productStats.innerHTML += `
            <div class="stat-card">
                <h3>${product}</h3>
                <p>${views} views</p>
            </div>
        `;
    });
    
    // Create table
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Action</th>
                    <th>Session</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add all product interactions
    productInterest.forEach(item => {
        tableHtml += `
            <tr>
                <td>${item.productName}</td>
                <td>${item.action}</td>
                <td>${item.sessionId}</td>
                <td>${new Date(item.timestamp).toLocaleString()}</td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    productTable.innerHTML = tableHtml;
}

/**
 * Setup Export Buttons
 * Adds functionality to data export buttons
 */
function setupExportButtons() {
    const exportAll = document.getElementById('export-all');
    const exportSessions = document.getElementById('export-sessions');
    const exportNewsletter = document.getElementById('export-newsletter');
    const exportInteractions = document.getElementById('export-interactions');
    const exportProducts = document.getElementById('export-products');
    const exportResult = document.getElementById('export-result');
    
    if (!exportAll || !exportResult) return;
    
    exportAll.addEventListener('click', function() {
        const allData = {
            sessions: JSON.parse(localStorage.getItem('kingstonBusinessSessions')) || [],
            subscribers: JSON.parse(localStorage.getItem('kingstonBusinessSubscribers')) || [],
            analytics: JSON.parse(localStorage.getItem('kingstonBusinessAnalytics')) || {},
            productInterest: JSON.parse(localStorage.getItem('kingstonBusinessProductInterest')) || [],
            scrollData: JSON.parse(localStorage.getItem('kingstonBusinessScrollData')) || [],
            timeData: JSON.parse(localStorage.getItem('kingstonBusinessTimeData')) || []
        };
        
        downloadJSON(allData, 'kingstons-business-all-data');
        
        exportResult.innerHTML = `
            <div class="success-message">
                <p>All data exported successfully!</p>
                <p>Filename: kingstons-business-all-data.json</p>
            </div>
        `;
    });
    
    if (exportSessions) {
        exportSessions.addEventListener('click', function() {
            const sessions = JSON.parse(localStorage.getItem('kingstonBusinessSessions')) || [];
            downloadJSON(sessions, 'kingstons-business-sessions');
            
            exportResult.innerHTML = `
                <div class="success-message">
                    <p>Session data exported successfully!</p>
                    <p>Filename: kingstons-business-sessions.json</p>
                </div>
            `;
        });
    }
    
    if (exportNewsletter) {
        exportNewsletter.addEventListener('click', function() {
            const subscribers = JSON.parse(localStorage.getItem('kingstonBusinessSubscribers')) || [];
            downloadJSON(subscribers, 'kingstons-business-subscribers');
            
            exportResult.innerHTML = `
                <div class="success-message">
                    <p>Subscriber data exported successfully!</p>
                    <p>Filename: kingstons-business-subscribers.json</p>
                </div>
            `;
        });
    }
    
    if (exportInteractions) {
        exportInteractions.addEventListener('click', function() {
            const analytics = JSON.parse(localStorage.getItem('kingstonBusinessAnalytics')) || {};
            downloadJSON(analytics, 'kingstons-business-interactions');
            
            exportResult.innerHTML = `
                <div class="success-message">
                    <p>Interaction data exported successfully!</p>
                    <p>Filename: kingstons-business-interactions.json</p>
                </div>
            `;
        });
    }
    
    if (exportProducts) {
        exportProducts.addEventListener('click', function() {
            const productInterest = JSON.parse(localStorage.getItem('kingstonBusinessProductInterest')) || [];
            downloadJSON(productInterest, 'kingstons-business-product-interest');
            
            exportResult.innerHTML = `
                <div class="success-message">
                    <p>Product interest data exported successfully!</p>
                    <p>Filename: kingstons-business-product-interest.json</p>
                </div>
            `;
        });
    }
}

/**
 * Download JSON
 * Creates and downloads a JSON file with the provided data
 * @param {Object} data - The data to download
 * @param {string} filename - The name for the downloaded file
 */
function downloadJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Detect Device
 * Determines the device type from a user agent string
 * @param {string} userAgent - The user agent string
 * @returns {string} The device type
 */
function detectDevice(userAgent) {
    if (/mobile/i.test(userAgent)) {
        return 'Mobile';
    } else if (/tablet/i.test(userAgent)) {
        return 'Tablet';
    } else if (/ipad/i.test(userAgent)) {
        return 'iPad';
    } else {
        return 'Desktop';
    }
}
