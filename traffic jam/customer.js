// Traffic Jam Restaurant - Customer App Engine

// --- STATE MANAGEMENT ---
let state = {
    activeView: 'home',
    categories: [],
    foods: [],
    filteredFoods: [],
    selectedCategory: null,
    searchQuery: '',
    cart: [],
    orderType: 'dining', // 'dining' or 'takeaway'
    tableNumber: '',
    couponCode: '',
    discount: 0,
    activeOrderId: null,
    activeFeedbackRating: 0,
    theme: 'light',
    favorites: []
};

// --- MOCK FALLBACK DATA ---
// Used if supabaseClient credentials are not yet set up or database query fails
const MOCK_CATEGORIES = [
    { id: '1', name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
    { id: '2', name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { id: '3', name: 'Chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' },
    { id: '4', name: 'Biryani', icon: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
    { id: '5', name: 'Rolls', icon: '🌯', image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=60' },
    { id: '6', name: 'Dessert', icon: '🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
    { id: '7', name: 'Cold Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60' },
    { id: '8', name: 'Coffee', icon: '☕', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60' },
    { id: '9', name: 'Mocktails', icon: '🍸', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60' }
];

const MOCK_FOODS = [
    { id: 'f1', name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella cheese, and basil leaves', price: 249, category_id: '1', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: true, available: true },
    { id: 'f2', name: 'Traffic Jam Special Pizza', description: 'Signature double-crust pizza loaded with olives, jalapenos, mushrooms, double cheese, and spicy paneer', price: 399, category_id: '1', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f3', name: 'Farmhouse Veg Pizza', description: 'Topped with crunchy onions, green capsicum, juicy tomatoes, and mushrooms', price: 299, category_id: '1', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=500&auto=format&fit=crop&q=60', popular: false, special: false, recommended: false, available: true },
    
    { id: 'f4', name: 'Crispy Veg Burger', description: 'A crispy veg patty served with fresh lettuce, onions, and creamy mayo', price: 99, category_id: '2', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: false, available: true },
    { id: 'f5', name: 'Ultimate Cheese Burger', description: 'Double patty burger stacked with melted cheddar cheese, sliced pickles, and signature house sauce', price: 189, category_id: '2', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    
    { id: 'f6', name: 'Schezwan Noodles', description: 'Spicy stir-fried noodles with crisp veggies and hot Schezwan sauce', price: 149, category_id: '3', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: false, available: true },
    { id: 'f7', name: 'Paneer Chilli Dry', description: 'Crispy cottage cheese cubes tossed in spicy chilli, soy, and garlic sauce', price: 179, category_id: '3', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=60', popular: false, special: false, recommended: true, available: true },
    
    { id: 'f8', name: 'Hyderabadi Veg Biryani', description: 'Aromatic basmati rice cooked with fresh vegetables and secret herbs, served with raita', price: 199, category_id: '4', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: true, available: true },
    { id: 'f9', name: 'Traffic Jam Special Chicken Biryani', description: 'Our flagship aromatic Dum Biryani layered with succulent marinated chicken and hard-boiled eggs', price: 279, category_id: '4', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    
    { id: 'f10', name: 'Double Egg Roll', description: 'Golden wheat wrap lined with double eggs, crunchy onions, and a splash of tasty sauces', price: 79, category_id: '5', image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: false, available: true },
    { id: 'f11', name: 'Chocolate Brownie with Ice Cream', description: 'Warm, fudgy chocolate brownie topped with vanilla ice cream and hot chocolate fudge', price: 149, category_id: '6', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f12', name: 'Classic Virgin Mojito', description: 'Refreshing blend of fresh lime juice, mint leaves, simple syrup, and sparkling soda', price: 109, category_id: '9', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: true, available: true }
];

// --- APP INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Favorites from local storage
    state.favorites = JSON.parse(localStorage.getItem('tj_favorites') || '[]');

    // 1. Initialize Theme (Dark/Light Mode)
    initTheme();

    // 2. Parse URL parameters for Table Number (e.g., ?table=05)
    parseURLParameters();

    // 3. Load Menu Data (from supabaseClient, or mock fallback)
    loadMenuData();

    // 4. Set up event listeners
    setupEventListeners();

    // 5. Hide splash screen after delay
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('fade-out');
        }
    }, 1500);

    // 6. Start Hero banner auto slide
    startHeroSlider();

    // 7. Setup storage event listener for real-time offline sync between tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'tj_order_history') {
            console.log("Order history updated in another tab. Refreshing...");
            if (state.activeView === 'history') {
                renderHistory();
            }
            if (state.activeView === 'tracking' && state.activeOrderId) {
                renderOrderTracking();
            }
        }
    });
});

// --- URL TABLE PARSING ---
function parseURLParameters() {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
        state.tableNumber = table;
        localStorage.setItem('tj_table_number', table);
        showToast(`Welcome! You are ordering from Table ${table}`);
    } else {
        const cachedTable = localStorage.getItem('tj_table_number');
        if (cachedTable) {
            state.tableNumber = cachedTable;
        }
    }
    updateTableHeaderBadge();
}

function updateTableHeaderBadge() {
    const badge = document.getElementById('headerTableBadge');
    if (badge) {
        if (state.tableNumber) {
            badge.innerText = `Table ${state.tableNumber}`;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// --- THEME ENGINE ---
function initTheme() {
    const savedTheme = localStorage.getItem('tj_theme') || 'light';
    setTheme(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const nextTheme = state.theme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }
}

function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('tj_theme', theme);
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else {
        document.body.classList.remove('dark-mode');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Instant Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            filterMenu();
        });
    }
}

// --- DATA FETCH ENGINE ---
async function loadMenuData() {
    let loadedFromSupabase = false;

    if (supabaseClient) {
        try {
            // Load Categories
            const { data: catData, error: catError } = await supabaseClient
                .from('categories')
                .select('*')
                .order('name');
            
            // Load Foods
            const { data: foodData, error: foodError } = await supabaseClient
                .from('foods')
                .select('*')
                .order('name');

            if (!catError && !foodError && catData && foodData) {
                state.categories = catData;
                state.foods = foodData;
                loadedFromSupabase = true;
                console.log("Loaded data successfully from supabaseClient!");
            } else {
                console.warn("supabaseClient fetch returned error or empty, using mock fallback. Errors:", catError, foodError);
            }
        } catch (err) {
            console.error("Failed to connect to supabaseClient database, falling back to mock data:", err);
        }
    }

    if (!loadedFromSupabase) {
        state.categories = MOCK_CATEGORIES;
        state.foods = MOCK_FOODS;
    }

    state.filteredFoods = [...state.foods];
    
    renderCategories();
    filterMenu();
}

// --- RENDERING ENGINE ---
function renderCategories() {
    // 1. Horizontal scroll categories
    const container = document.getElementById('categoriesContainer');
    if (container) {
        let html = '';
        state.categories.forEach(cat => {
            const isActive = state.selectedCategory === cat.id ? 'active' : '';
            html += `
                <div class="category-card ${isActive}" onclick="selectCategory('${cat.id}')">
                    <span class="category-icon">${cat.icon || '🍽️'}</span>
                    <span class="category-name">${cat.name}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 2. All Categories grid (for categories page)
    const grid = document.getElementById('allCategoriesGrid');
    if (grid) {
        let html = '';
        state.categories.forEach(cat => {
            html += `
                <div class="food-card" onclick="selectCategory('${cat.id}'); navigateTo('home');" style="flex-direction: row; height: 80px; align-items: center; padding: 10px;">
                    <div style="font-size: 2.2rem; margin-right: 15px;">${cat.icon || '🍽️'}</div>
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 600;">${cat.name}</h4>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }
}

function filterMenu() {
    let results = [...state.foods];

    // Filter by Category
    if (state.selectedCategory) {
        results = results.filter(food => food.category_id === state.selectedCategory);
    }

    // Filter by Search Query
    if (state.searchQuery) {
        results = results.filter(food => 
            food.name.toLowerCase().includes(state.searchQuery) || 
            (food.description && food.description.toLowerCase().includes(state.searchQuery))
        );
    }

    state.filteredFoods = results;
    renderFoods();
}

// Helper to check favorite status
function isFavorite(foodId) {
    return state.favorites.includes(foodId);
}

// Toggle favorite state
function toggleFavorite(foodId, btn) {
    const idx = state.favorites.indexOf(foodId);
    if (idx > -1) {
        state.favorites.splice(idx, 1);
        if (btn) btn.classList.remove('active');
        showToast("Removed from favorites");
    } else {
        state.favorites.push(foodId);
        if (btn) btn.classList.add('active');
        showToast("Added to favorites!");
        playChime();
    }
    localStorage.setItem('tj_favorites', JSON.stringify(state.favorites));
    
    // Refresh relevant views
    if (state.activeView === 'favorites') {
        renderFavorites();
    } else {
        renderFoods();
        if (!state.selectedCategory && !state.searchQuery) {
            renderSpecialsAndRecommended();
        }
    }
}

// Render specials and recommended scroll lists
function renderSpecialsAndRecommended() {
    const specialsContainer = document.getElementById('specialsContainer');
    const recommendedContainer = document.getElementById('recommendedContainer');
    const specialsSection = document.getElementById('specialsSection');
    const recommendedSection = document.getElementById('recommendedSection');

    // Render Specials
    if (specialsContainer && specialsSection) {
        const specials = state.foods.filter(food => food.special);
        if (specials.length === 0) {
            specialsSection.style.display = 'none';
        } else {
            specialsSection.style.display = 'block';
            let html = '';
            specials.forEach(food => {
                const imageSrc = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
                const favClass = isFavorite(food.id) ? 'active' : '';
                html += `
                    <div class="food-card" onclick="openProductDrawer('${food.id}')" style="flex-shrink: 0; width: 170px; margin-right: 12px; display: inline-block; vertical-align: top;">
                        <div class="food-img-container" style="height: 110px;">
                            <button class="fav-btn ${favClass}" onclick="event.stopPropagation(); toggleFavorite('${food.id}', this)">
                                <ion-icon name="heart"></ion-icon>
                            </button>
                            <img class="food-img" src="${imageSrc}" alt="${food.name}" style="height: 100%;">
                        </div>
                        <div class="food-info" style="padding: 10px;">
                            <h3 class="food-title" style="font-size: 0.85rem; height: 36px; overflow: hidden; margin-bottom: 5px;">${food.name}</h3>
                            <div class="food-footer" onclick="event.stopPropagation(); margin-top: 5px;">
                                <span class="food-price" style="font-size: 0.85rem;">₹${food.price}</span>
                                <button class="add-btn" style="padding: 3px 8px; font-size: 0.75rem;" onclick="addToCart('${food.id}')">
                                    <ion-icon name="add"></ion-icon> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            specialsContainer.innerHTML = html;
        }
    }

    // Render Recommended
    if (recommendedContainer && recommendedSection) {
        const recommended = state.foods.filter(food => food.recommended);
        if (recommended.length === 0) {
            recommendedSection.style.display = 'none';
        } else {
            recommendedSection.style.display = 'block';
            let html = '';
            recommended.forEach(food => {
                const imageSrc = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
                const favClass = isFavorite(food.id) ? 'active' : '';
                html += `
                    <div class="food-card" onclick="openProductDrawer('${food.id}')" style="flex-shrink: 0; width: 170px; margin-right: 12px; display: inline-block; vertical-align: top;">
                        <div class="food-img-container" style="height: 110px;">
                            <button class="fav-btn ${favClass}" onclick="event.stopPropagation(); toggleFavorite('${food.id}', this)">
                                <ion-icon name="heart"></ion-icon>
                            </button>
                            <img class="food-img" src="${imageSrc}" alt="${food.name}" style="height: 100%;">
                        </div>
                        <div class="food-info" style="padding: 10px;">
                            <h3 class="food-title" style="font-size: 0.85rem; height: 36px; overflow: hidden; margin-bottom: 5px;">${food.name}</h3>
                            <div class="food-footer" onclick="event.stopPropagation(); margin-top: 5px;">
                                <span class="food-price" style="font-size: 0.85rem;">₹${food.price}</span>
                                <button class="add-btn" style="padding: 3px 8px; font-size: 0.75rem;" onclick="addToCart('${food.id}')">
                                    <ion-icon name="add"></ion-icon> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            recommendedContainer.innerHTML = html;
        }
    }
}

// Render favorites view
function renderFavorites() {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;

    const favFoods = state.foods.filter(f => state.favorites.includes(f.id));

    if (favFoods.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: span 2; width: 100%; text-align: center; padding: 40px 20px;">
                <div class="empty-icon" style="font-size: 4rem; margin-bottom: 15px;">❤️</div>
                <div class="empty-text" style="font-weight: 500; margin-bottom: 15px;">No favorites added yet!</div>
                <button class="btn-primary" onclick="navigateTo('home')">Browse Foods</button>
            </div>
        `;
        return;
    }

    let html = '';
    favFoods.forEach(food => {
        const badgeHtml = food.special ? `<span class="food-badge">Special</span>` : (food.popular ? `<span class="food-badge">Popular</span>` : '');
        const imageSrc = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
        
        html += `
            <div class="food-card" onclick="openProductDrawer('${food.id}')">
                <div class="food-img-container">
                    <button class="fav-btn active" onclick="event.stopPropagation(); toggleFavorite('${food.id}', this)">
                        <ion-icon name="heart"></ion-icon>
                    </button>
                    ${badgeHtml}
                    <img class="food-img" src="${imageSrc}" alt="${food.name}">
                </div>
                <div class="food-info">
                    <h3 class="food-title">${food.name}</h3>
                    <p class="food-desc">${food.description || 'No description available.'}</p>
                    <div class="food-footer" onclick="event.stopPropagation();">
                        <span class="food-price">₹${food.price}</span>
                        <button class="add-btn" onclick="addToCart('${food.id}')">
                            <ion-icon name="add"></ion-icon> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderFoods() {
    const container = document.getElementById('foodsContainer');
    const title = document.getElementById('foodSectionTitle');
    const resetBtn = document.getElementById('resetCategoryFilterBtn');
    const specialsSection = document.getElementById('specialsSection');
    const recommendedSection = document.getElementById('recommendedSection');
    
    if (!container) return;

    // Toggle horizontal scroll sections visibility depending on active search/category filter
    if (state.selectedCategory || state.searchQuery) {
        if (specialsSection) specialsSection.style.display = 'none';
        if (recommendedSection) recommendedSection.style.display = 'none';
    } else {
        if (specialsSection) specialsSection.style.display = 'block';
        if (recommendedSection) recommendedSection.style.display = 'block';
        renderSpecialsAndRecommended();
    }

    // Update titles based on filters
    if (state.selectedCategory) {
        const cat = state.categories.find(c => c.id === state.selectedCategory);
        title.innerText = cat ? `${cat.name} Menu` : 'Foods';
        resetBtn.style.display = 'inline-block';
    } else if (state.searchQuery) {
        title.innerText = `Search Results (${state.filteredFoods.length})`;
        resetBtn.style.display = 'inline-block';
    } else {
        title.innerText = 'Popular Menu';
        resetBtn.style.display = 'none';
    }

    if (state.filteredFoods.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: span 2; width: 100%;">
                <div class="empty-icon">🍽️</div>
                <div class="empty-text">No delicious dishes found!</div>
            </div>
        `;
        return;
    }

    let html = '';
    // If not searching and not category filtering, let's show only popular items in the popular container
    let foodsToRender = state.filteredFoods;
    if (!state.selectedCategory && !state.searchQuery) {
        foodsToRender = state.filteredFoods.filter(f => f.popular);
    }

    foodsToRender.forEach(food => {
        const badgeHtml = food.special ? `<span class="food-badge">Special</span>` : (food.popular ? `<span class="food-badge">Popular</span>` : '');
        const imageSrc = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
        const favClass = isFavorite(food.id) ? 'active' : '';
        
        html += `
            <div class="food-card" onclick="openProductDrawer('${food.id}')">
                <div class="food-img-container">
                    <button class="fav-btn ${favClass}" onclick="event.stopPropagation(); toggleFavorite('${food.id}', this)">
                        <ion-icon name="heart"></ion-icon>
                    </button>
                    ${badgeHtml}
                    <img class="food-img" src="${imageSrc}" alt="${food.name}">
                </div>
                <div class="food-info">
                    <h3 class="food-title">${food.name}</h3>
                    <p class="food-desc">${food.description || 'No description available.'}</p>
                    <div class="food-footer" onclick="event.stopPropagation();">
                        <span class="food-price">₹${food.price}</span>
                        <button class="add-btn" onclick="addToCart('${food.id}')">
                            <ion-icon name="add"></ion-icon> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// --- CATEGORY NAVIGATION FILTER ---
function selectCategory(catId) {
    if (state.selectedCategory === catId) {
        state.selectedCategory = null; // Toggle off
    } else {
        state.selectedCategory = catId;
    }
    renderCategories();
    filterMenu();
}

function clearCategoryFilter() {
    state.selectedCategory = null;
    state.searchQuery = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderCategories();
    filterMenu();
}

// --- PRODUCT DETAILS DRAWER (BOTTOM SHEET) ---
function openProductDrawer(foodId) {
    const food = state.foods.find(f => f.id === foodId);
    if (!food) return;

    const drawer = document.getElementById('productDrawer');
    const overlay = document.getElementById('sheetOverlay');
    const content = document.getElementById('productDrawerContent');

    if (!drawer || !overlay || !content) return;

    // Default ingredients fallback
    const ingredients = ['Fresh Ingredients', 'Chef Selected', 'Locally Sourced'];
    let ingredientsHtml = ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('');

    // Related items (same category, excluding this one)
    const related = state.foods.filter(f => f.category_id === food.category_id && f.id !== food.id).slice(0, 3);
    let relatedHtml = '';
    if (related.length > 0) {
        relatedHtml = `
            <div class="sheet-ingredients" style="margin-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px; margin-bottom: 20px;">
                <h4 class="sheet-ingredients-title" style="margin-bottom: 10px;">Related Dishes</h4>
                <div style="display: flex; overflow-x: auto; gap: 10px; padding-bottom: 8px; scrollbar-width: none;">
        `;
        related.forEach(rel => {
            const relImg = rel.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60';
            relatedHtml += `
                <div onclick="openProductDrawer('${rel.id}')" style="flex-shrink: 0; width: 110px; cursor: pointer; background: var(--bg-gray); padding: 8px; border-radius: var(--radius-sm); text-align: center; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                    <img src="${relImg}" style="width: 100%; height: 55px; object-fit: cover; border-radius: 6px; margin-bottom: 4px;">
                    <div style="font-size: 0.7rem; font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: var(--text-dark);">${rel.name}</div>
                    <div style="font-size: 0.7rem; color: var(--primary); font-weight: 700; margin-top: 2px;">₹${rel.price}</div>
                </div>
            `;
        });
        relatedHtml += `
                </div>
            </div>
        `;
    }

    content.innerHTML = `
        <img class="sheet-img" src="${food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}" alt="${food.name}">
        <h2 class="sheet-food-name">${food.name}</h2>
        <div class="sheet-food-price">₹${food.price}</div>
        <p class="sheet-food-desc">${food.description || 'Our signature recipe prepared with top ingredients.'}</p>
        
        <div class="sheet-ingredients">
            <h4 class="sheet-ingredients-title">Ingredients</h4>
            <div class="sheet-ingredients-list">
                ${ingredientsHtml}
            </div>
        </div>

        ${relatedHtml}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <span style="font-weight: 600; font-size: 0.95rem;">Select Quantity</span>
            <div class="qty-selector">
                <button class="qty-btn" onclick="adjustDrawerQty(-1)">-</button>
                <span class="qty-val" id="drawerQty">1</span>
                <button class="qty-btn" onclick="adjustDrawerQty(1)">+</button>
            </div>
        </div>

        <div class="sheet-action-row">
            <button class="btn-primary" onclick="addDrawerItemToCart('${food.id}')">
                <ion-icon name="cart-outline"></ion-icon> Add to Order
            </button>
        </div>
    `;

    drawer.classList.add('open');
    overlay.classList.add('open');
}

function closeProductDrawer() {
    const drawer = document.getElementById('productDrawer');
    const overlay = document.getElementById('sheetOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

function adjustDrawerQty(change) {
    const el = document.getElementById('drawerQty');
    if (!el) return;
    let qty = parseInt(el.innerText) + change;
    if (qty < 1) qty = 1;
    el.innerText = qty;
}

function addDrawerItemToCart(foodId) {
    const qtyEl = document.getElementById('drawerQty');
    const qty = qtyEl ? parseInt(qtyEl.innerText) : 1;
    addToCart(foodId, qty);
    closeProductDrawer();
}

// --- CART LOGIC ---
function addToCart(foodId, quantity = 1) {
    const food = state.foods.find(f => f.id === foodId);
    if (!food) return;

    const existing = state.cart.find(item => item.food.id === foodId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        state.cart.push({ food, quantity });
    }

    updateCartCounts();
    showToast(`Added ${food.name} to cart!`);
    playChime();
}

function updateCartCounts() {
    const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = state.cart.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);

    // Update bottom nav badge
    const badge = document.getElementById('bottomNavCartCount');
    if (badge) {
        if (totalItems > 0) {
            badge.innerText = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Update floating cart button
    const floatBtn = document.getElementById('floatingCartBtn');
    const floatCount = document.getElementById('floatCartCount');
    const floatTotal = document.getElementById('floatCartTotal');
    if (floatBtn && floatCount && floatTotal) {
        if (totalItems > 0 && state.activeView === 'home') {
            floatCount.innerText = totalItems;
            floatTotal.innerText = totalPrice;
            floatBtn.classList.add('visible');
        } else {
            floatBtn.classList.remove('visible');
        }
    }

    // If active view is cart, re-render cart
    if (state.activeView === 'cart') {
        renderCart();
    }
}

function changeCartQty(foodId, change) {
    const item = state.cart.find(item => item.food.id === foodId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.food.id !== foodId);
    }
    updateCartCounts();
}

function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;

    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="font-size: 5rem;">🛒</div>
                <p class="empty-text">Your cart is empty.</p>
                <button class="btn-primary" onclick="navigateTo('home')">Browse Foods</button>
            </div>
        `;
        return;
    }

    let itemsHtml = '';
    let subtotal = 0;

    state.cart.forEach(item => {
        const itemTotal = item.food.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}" alt="${item.food.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.food.name}</h4>
                    <span class="cart-item-price">₹${item.food.price}</span>
                </div>
                <div class="cart-qty-ctrl">
                    <button class="cart-qty-btn" onclick="changeCartQty('${item.food.id}', -1)">-</button>
                    <span class="cart-qty-val">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="changeCartQty('${item.food.id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    // Compute bill breakdown
    // GST = 5%
    const discountAmount = state.discount > 0 ? (subtotal * state.discount) : 0;
    const discountedSubtotal = subtotal - discountAmount;
    const gst = Math.round(discountedSubtotal * 0.05);
    const grandTotal = Math.round(discountedSubtotal + gst);

    container.innerHTML = `
        <div class="cart-list">
            ${itemsHtml}
        </div>

        <div class="coupon-section">
            <input type="text" id="couponInput" class="coupon-input" placeholder="Coupon Code (e.g. TJ20)" value="${state.couponCode}">
            <button class="coupon-btn" onclick="applyCoupon()">Apply</button>
        </div>

        <div class="bill-details">
            <h3 class="bill-title">Bill Summary</h3>
            <div class="bill-row">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            ${discountAmount > 0 ? `
            <div class="bill-row">
                <span>Discount Applied (${state.couponCode})</span>
                <span style="color: var(--success);">-₹${discountAmount.toFixed(0)}</span>
            </div>
            ` : ''}
            <div class="bill-row">
                <span>GST (5%)</span>
                <span>₹${gst}</span>
            </div>
            <div class="bill-row grand-total">
                <span>Grand Total</span>
                <span>₹${grandTotal}</span>
            </div>
        </div>

        <button class="btn-primary" style="width: 100%; margin-bottom: 20px;" onclick="proceedToCheckout()">
            <ion-icon name="card-outline"></ion-icon>
            Proceed Order (₹${grandTotal})
        </button>
    `;
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'TJ20') {
        state.couponCode = 'TJ20';
        state.discount = 0.20; // 20% discount
        showToast("Coupon 'TJ20' applied! 20% Discount active.");
    } else if (code === '') {
        state.couponCode = '';
        state.discount = 0;
    } else {
        showToast("Invalid Coupon Code!");
        state.couponCode = '';
        state.discount = 0;
    }
    renderCart();
}

// --- CHECKOUT LOGIC ---
function proceedToCheckout() {
    // Navigate to checkout view
    navigateTo('checkout');

    // Populate checkout values
    const subtotal = state.cart.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);
    const discountAmount = state.discount > 0 ? (subtotal * state.discount) : 0;
    const discountedSubtotal = subtotal - discountAmount;
    const gst = Math.round(discountedSubtotal * 0.05);
    const grandTotal = Math.round(discountedSubtotal + gst);

    document.getElementById('checkoutSubtotal').innerText = `₹${subtotal}`;
    if (discountAmount > 0) {
        document.getElementById('checkoutDiscount').innerText = `-₹${discountAmount.toFixed(0)}`;
        document.getElementById('checkoutDiscountRow').style.display = 'flex';
    } else {
        document.getElementById('checkoutDiscountRow').style.display = 'none';
    }
    document.getElementById('checkoutGst').innerText = `₹${gst}`;
    document.getElementById('checkoutGrandTotal').innerText = `₹${grandTotal}`;
    document.getElementById('checkoutBtnTotal').innerText = grandTotal;

    // Fill table number if cached
    const tableInput = document.getElementById('tableNumber');
    if (tableInput && state.tableNumber) {
        tableInput.value = state.tableNumber;
    }
}

function setOrderType(type) {
    state.orderType = type;
    
    // Toggle active class on buttons
    const options = document.querySelectorAll('#orderTypeToggle .toggle-option');
    options.forEach(opt => {
        if (opt.getAttribute('data-type') === type) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    // Hide/show table number group based on dining choice
    const tableGroup = document.getElementById('tableGroup');
    const tableInput = document.getElementById('tableNumber');
    if (tableGroup && tableInput) {
        if (type === 'takeaway') {
            tableGroup.style.display = 'none';
            tableInput.removeAttribute('required');
            tableInput.value = 'Takeaway';
        } else {
            tableGroup.style.display = 'block';
            tableInput.setAttribute('required', 'true');
            tableInput.value = state.tableNumber || '';
        }
    }
}

async function handlePlaceOrder(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    const specialInstructions = document.getElementById('specialInstructions').value.trim();

    // Cache table number
    if (state.orderType === 'dining') {
        state.tableNumber = tableNumber;
        localStorage.setItem('tj_table_number', tableNumber);
        updateTableHeaderBadge();
    }

    const subtotal = state.cart.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);
    const discountAmount = state.discount > 0 ? (subtotal * state.discount) : 0;
    const grandTotal = Math.round((subtotal - discountAmount) * 1.05);

    // Save order data
    const orderData = {
        customer_name: customerName,
        phone: phone || null,
        table_number: tableNumber,
        order_type: state.orderType,
        status: 'received',
        total: grandTotal,
        special_instructions: specialInstructions || null
    };

    let savedOrder = null;

    showToast("Placing your order...", 5000);

    if (supabaseClient) {
        try {
            // 1. Insert order
            const { data: newOrder, error: orderError } = await supabaseClient
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;
            savedOrder = newOrder;

            // 2. Insert items
            const orderItems = state.cart.map(item => ({
                order_id: savedOrder.id,
                food_id: item.food.id,
                quantity: item.quantity,
                price: item.food.price,
                subtotal: item.food.price * item.quantity
            }));

            const { error: itemsError } = await supabaseClient
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            console.log("Placed order successfully with supabaseClient!");
        } catch (err) {
            console.error("supabaseClient order failed, falling back to local simulation:", err);
        }
    }

    // Local Fallback simulation if no DB connection
    if (!savedOrder) {
        savedOrder = {
            id: 'local_' + Math.random().toString(36).substr(2, 9),
            ...orderData,
            created_at: new Date().toISOString()
        };
        // Simulated progress interval
        simulateLocalOrderLifecycle(savedOrder.id);
    }

    // Save order details to customer history
    const orderHistory = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    orderHistory.unshift({
        id: savedOrder.id,
        date: savedOrder.created_at,
        total: savedOrder.total,
        status: savedOrder.status,
        table: savedOrder.table_number,
        items: state.cart.map(item => `${item.food.name} x${item.quantity}`).join(', ')
    });
    localStorage.setItem('tj_order_history', JSON.stringify(orderHistory));

    // Clear cart
    state.cart = [];
    state.couponCode = '';
    state.discount = 0;
    updateCartCounts();

    // Show Success Screen
    state.activeOrderId = savedOrder.id;
    document.getElementById('successOrderId').innerText = savedOrder.id.substring(0, 12);
    document.getElementById('successTable').innerText = savedOrder.table_number;
    document.getElementById('successTotal').innerText = `₹${savedOrder.total}`;
    
    navigateTo('success');
    playChime();
}

// Simulated local order timeline progress if supabaseClient is offline
function simulateLocalOrderLifecycle(orderId) {
    const statuses = ['received', 'preparing', 'ready', 'delivered'];
    let idx = 0;
    const interval = setInterval(() => {
        idx++;
        if (idx >= statuses.length) {
            clearInterval(interval);
        }
        const orderHistory = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
        const ord = orderHistory.find(o => o.id === orderId);
        if (ord) {
            ord.status = statuses[idx];
            localStorage.setItem('tj_order_history', JSON.stringify(orderHistory));
            
            // Trigger tracking view refresh if active
            if (state.activeOrderId === orderId && state.activeView === 'tracking') {
                renderOrderTracking();
            }
        }
    }, 15000); // changes status every 15 seconds locally
}

// --- ORDER TRACKING VIEW ---
async function trackActiveOrder() {
    navigateTo('tracking');
    renderOrderTracking();

    // Setup realtime subscription to orders table
    if (supabaseClient && state.activeOrderId && !state.activeOrderId.startsWith('local_')) {
        const channel = supabaseClient
            .channel('db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${state.activeOrderId}`
                },
                (payload) => {
                    console.log('Order status updated in realtime:', payload.new);
                    // Update state history status
                    updateLocalHistoryStatus(payload.new.id, payload.new.status);
                    renderOrderTracking();
                    showToast(`Order status updated to: ${payload.new.status.toUpperCase()}`);
                    playChime();
                }
            )
            .subscribe();
    }
}

function updateLocalHistoryStatus(orderId, status) {
    const orderHistory = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    const ord = orderHistory.find(o => o.id === orderId);
    if (ord) {
        ord.status = status;
        localStorage.setItem('tj_order_history', JSON.stringify(orderHistory));
    }
}

async function renderOrderTracking() {
    if (!state.activeOrderId) return;

    let order = null;

    // Attempt to load current status from history cache or DB
    const orderHistory = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    const cachedOrder = orderHistory.find(o => o.id === state.activeOrderId);

    if (supabaseClient && !state.activeOrderId.startsWith('local_')) {
        try {
            const { data, error } = await supabaseClient
                .from('orders')
                .select('*')
                .eq('id', state.activeOrderId)
                .single();
            if (data && !error) {
                order = {
                    id: data.id,
                    status: data.status,
                    table: data.table_number,
                    total: data.total
                };
            }
        } catch (err) {
            console.error("Error fetching live tracking details from database:", err);
        }
    }

    if (!order && cachedOrder) {
        order = {
            id: cachedOrder.id,
            status: cachedOrder.status,
            table: cachedOrder.table,
            total: cachedOrder.total,
            items: cachedOrder.items
        };
    }

    if (!order) return;

    // Update tracking text
    document.getElementById('trackOrderId').innerText = order.id.substring(0, 12);
    document.getElementById('trackTableNumber').innerText = order.table;
    document.getElementById('trackItems').innerText = order.items || 'TJ Menu Items';

    const statusBadge = document.getElementById('trackStatusBadge');
    if (statusBadge) {
        statusBadge.innerText = order.status.toUpperCase();
        statusBadge.className = `history-status-badge status-${order.status}`;
    }

    // Timeline steps activation
    const steps = ['received', 'preparing', 'ready', 'delivered'];
    const currentIdx = steps.indexOf(order.status);

    steps.forEach((step, idx) => {
        const el = document.getElementById(`step-${step}`);
        if (el) {
            el.classList.remove('active', 'completed');
            if (idx < currentIdx) {
                el.classList.add('completed');
            } else if (idx === currentIdx) {
                el.classList.add('active');
            }
        }
    });

    // Show feedback form if delivered
    const feedbackBox = document.getElementById('feedbackFormContainer');
    if (feedbackBox) {
        if (order.status === 'delivered' || order.status === 'ready') {
            feedbackBox.style.display = 'block';
        } else {
            feedbackBox.style.display = 'none';
        }
    }
}

// --- FEEDBACK RATING ENGINE ---
function setFeedbackRating(rating) {
    state.activeFeedbackRating = rating;
    const stars = document.querySelectorAll('#feedbackStars ion-icon');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.setAttribute('name', 'star');
            star.style.color = '#FF6B00';
        } else {
            star.setAttribute('name', 'star-outline');
            star.style.color = '#ccc';
        }
    });
}

async function submitFeedback() {
    if (state.activeFeedbackRating === 0) {
        showToast("Please select a star rating!");
        return;
    }

    const review = document.getElementById('feedbackReview').value.trim();
    const data = {
        order_id: state.activeOrderId.startsWith('local_') ? null : state.activeOrderId,
        rating: state.activeFeedbackRating,
        review: review || null
    };

    showToast("Submitting feedback...");

    if (supabaseClient && data.order_id) {
        try {
            const { error } = await supabaseClient.from('feedback').insert([data]);
            if (error) throw error;
        } catch (err) {
            console.error("Failed to submit feedback to database:", err);
        }
    }

    showToast("Thank you for your feedback!", 3000);
    
    // Clear feedback input
    document.getElementById('feedbackReview').value = '';
    setFeedbackRating(0);
    
    // Hide feedback panel and go home
    document.getElementById('feedbackFormContainer').style.display = 'none';
    navigateTo('home');
}

// --- ORDER HISTORY VIEW ---
function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;

    const history = JSON.parse(localStorage.getItem('tj_order_history') || '[]');

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="font-size: 5rem;">🕒</div>
                <p class="empty-text">No previous orders found.</p>
                <button class="btn-primary" onclick="navigateTo('home')">Order Now</button>
            </div>
        `;
        return;
    }

    let html = '';
    history.forEach(order => {
        const formattedDate = new Date(order.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="history-item">
                <div class="history-header">
                    <div>
                        <span class="history-id">ID: ${order.id.substring(0, 10)}</span>
                        <div class="history-date">${formattedDate}</div>
                    </div>
                    <span class="history-status-badge status-${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="history-foods">${order.items}</div>
                <div class="history-footer">
                    <span class="history-total">Total: ₹${order.total}</span>
                    <div style="display: flex; gap: 8px;">
                        <button class="add-btn" style="background-color: var(--text-dark); color: #fff; padding: 4px 10px; font-size: 0.75rem;" onclick="repeatOrder('${order.id}')">
                            Repeat
                        </button>
                        <button class="add-btn" style="background-color: var(--warning); color: #fff; padding: 4px 10px; font-size: 0.75rem;" onclick="openCustomerInvoice('${order.id}')">
                            Invoice
                        </button>
                        <button class="add-btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="trackPreviousOrder('${order.id}')">
                            Track
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function repeatOrder(orderId) {
    const history = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    const order = history.find(o => o.id === orderId);
    if (!order) return;

    // Parse food items list (e.g. Margherita Pizza x2, Burger x1)
    // For simplicity, search the food items names and add them back to cart
    showToast("Adding items to cart...");
    const items = order.items.split(', ');
    
    items.forEach(itemStr => {
        const parts = itemStr.split(' x');
        const name = parts[0];
        const qty = parts[1] ? parseInt(parts[1]) : 1;
        
        const food = state.foods.find(f => f.name === name);
        if (food) {
            addToCart(food.id, qty);
        }
    });

    navigateTo('cart');
}

function trackPreviousOrder(orderId) {
    state.activeOrderId = orderId;
    trackActiveOrder();
}

// --- CUSTOMER INVOICE GENERATION ---
function openCustomerInvoice(orderId) {
    const modal = document.getElementById('customerInvoiceModal');
    const body = document.getElementById('customerInvoiceBody');
    if (!modal || !body) return;

    const history = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    const order = history.find(o => o.id === orderId);
    if (!order) return;

    const formattedDate = new Date(order.date).toLocaleString();

    let itemsHtml = '';
    if (order.items) {
        const items = order.items.split(', ');
        items.forEach(itemStr => {
            const parts = itemStr.split(' x');
            const name = parts[0];
            const qty = parts[1] ? parts[1] : '1';
            const food = state.foods.find(f => f.name === name);
            const price = food ? food.price : 150; 
            itemsHtml += `
                <tr>
                    <td style="padding: 6px 0; color: var(--text-dark);">${name} x${qty}</td>
                    <td style="padding: 6px 0; text-align: right; color: var(--text-dark);">₹${price * parseInt(qty)}</td>
                </tr>
            `;
        });
    }

    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--primary); letter-spacing: 0.5px; margin-bottom: 5px;">TRAFFIC JAM RESTAURANT</h2>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Barbil Road, Barbil, Odisha</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Ph: +91 70081 23456</div>
        </div>
        <div style="border-top: 1px dashed #ccc; margin: 12px 0;"></div>
        <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px; color: var(--text-dark);">
            <div style="display: flex; justify-content: space-between;"><span>Date:</span><span style="font-weight: 500;">${formattedDate}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Order ID:</span><span style="font-weight: 500; font-family: monospace;">#${order.id.substring(0, 12)}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Table Arrangement:</span><span style="font-weight: 700;">${order.table === 'Takeaway' ? 'Takeaway' : 'Table ' + order.table}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Order Status:</span><span class="history-status-badge status-${order.status}" style="padding: 2px 8px; font-size: 0.7rem;">${order.status.toUpperCase()}</span></div>
        </div>
        <div style="border-top: 1px dashed #ccc; margin: 12px 0;"></div>
        <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 1px dashed #ccc; font-weight: 600; color: var(--text-muted);">
                    <th style="text-align: left; padding: 6px 0;">Item Description</th>
                    <th style="text-align: right; padding: 6px 0;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        <div style="border-top: 1px dashed #ccc; margin: 12px 0;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dark); margin-bottom: 4px;">
            <span>GST (5% Incl.)</span>
            <span>₹${(order.total * 0.0476).toFixed(0)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: var(--primary);">
            <span>GRAND TOTAL</span>
            <span>₹${order.total}</span>
        </div>
        <div style="border-top: 1px dashed #ccc; margin: 12px 0;"></div>
        <div style="text-align: center; font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; line-height: 1.4;">
            Thank you for dining at Traffic Jam!<br>
            Please visit us again.
        </div>
    `;

    modal.classList.add('open');
}

function closeCustomerInvoiceModal() {
    const modal = document.getElementById('customerInvoiceModal');
    if (modal) modal.classList.remove('open');
}

// --- SPA VIEW NAVIGATION ROUTER ---
function navigateTo(viewId) {
    state.activeView = viewId;

    // Hide all views, activate the requested one
    const views = ['home', 'categories', 'favorites', 'cart', 'checkout', 'success', 'tracking', 'history'];
    views.forEach(v => {
        const el = document.getElementById(`${v}View`);
        if (el) {
            if (v === viewId) el.classList.add('active');
            else el.classList.remove('active');
        }
    });

    // Update active state in bottom nav
    const navItems = {
        'home': 'navHome',
        'categories': 'navCategories',
        'cart': 'navCart',
        'history': 'navHistory'
    };

    // Remove active class from all
    Object.values(navItems).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    // Add active class to corresponding bottom nav item
    if (navItems[viewId]) {
        const activeNavEl = document.getElementById(navItems[viewId]);
        if (activeNavEl) activeNavEl.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle view specific loads
    if (viewId === 'cart') {
        renderCart();
    } else if (viewId === 'history') {
        renderHistory();
    } else if (viewId === 'favorites') {
        renderFavorites();
    } else if (viewId === 'home') {
        filterMenu();
        updateCartCounts();
    }

    // Update floating cart visibility
    updateCartCounts();
}

// --- HERO BANNER CAROUSEL ---
let currentSlide = 0;
function moveCarousel(slideIdx) {
    currentSlide = slideIdx;
    const carousel = document.getElementById('carouselInner');
    const dots = document.querySelectorAll('#carouselDots .dot');
    
    if (carousel) {
        carousel.style.transform = `translateX(-${slideIdx * 33.333}%)`;
    }

    dots.forEach((dot, idx) => {
        if (idx === slideIdx) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function startHeroSlider() {
    setInterval(() => {
        if (state.activeView === 'home') {
            currentSlide = (currentSlide + 1) % 3;
            moveCarousel(currentSlide);
        }
    }, 5000);
}

// --- TOAST NOTIFICATIONS SYSTEM ---
function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>${message}</span>
        <ion-icon name="close-outline" style="cursor: pointer; font-size: 1.2rem; margin-left: 10px;" onclick="this.parentElement.remove()"></ion-icon>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// --- PREMIUM SOUND EFFECTS GENERATOR ---
// Web Audio API Synthesizer - 0 assets load latency, premium quality chime
function playChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // High premium ring synthesizer
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4
        osc2.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.1); // D5

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.warn("Audio chime block by browser auto-play restrictions or un-initialized API.");
    }
}
