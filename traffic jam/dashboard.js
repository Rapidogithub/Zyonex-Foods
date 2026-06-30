// Traffic Jam Restaurant - Reception & Admin Dashboard Engine

// --- STATE MANAGEMENT ---
let adminState = {
    isLoggedIn: false,
    isOfflineMode: false,
    activeTab: 'live-orders',
    orders: [],
    categories: [],
    foods: [],
    feedbacks: [],
    selectedOrder: null,
    menuSearchQuery: '',
    settings: {
        soundAlerts: true,
        pollingInterval: 30000
    }
};

// --- MOCK OFFLINE SEED DATA ---
const MOCK_ORDERS = [
    {
        id: 'ord_918237',
        customer_name: 'Debashis Mohanty',
        phone: '9876543210',
        table_number: '04',
        order_type: 'dining',
        status: 'received',
        total: 512,
        special_instructions: 'Make chicken biryani spicy and double gravy.',
        created_at: new Date(Date.now() - 5 * 60000).toISOString() // 5 mins ago
    },
    {
        id: 'ord_827391',
        customer_name: 'Anjali Sharma',
        phone: '7008123456',
        table_number: '12',
        order_type: 'dining',
        status: 'preparing',
        total: 366,
        special_instructions: 'No onions in noodles please.',
        created_at: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
    },
    {
        id: 'ord_102837',
        customer_name: 'Rajesh Gupta',
        phone: '',
        table_number: '08',
        order_type: 'dining',
        status: 'ready',
        total: 104,
        special_instructions: '',
        created_at: new Date(Date.now() - 25 * 60000).toISOString() // 25 mins ago
    },
    {
        id: 'ord_564738',
        customer_name: 'Vikram Singh',
        phone: '9988776655',
        table_number: 'Takeaway',
        order_type: 'takeaway',
        status: 'delivered',
        total: 838,
        special_instructions: 'Pack extra tissues and cutlery.',
        created_at: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
    }
];

const MOCK_ORDER_ITEMS = {
    'ord_918237': [
        { id: 'oi1', food_name: 'Traffic Jam Special Chicken Biryani', quantity: 1, price: 279, subtotal: 279 },
        { id: 'oi2', food_name: 'Classic Virgin Mojito', quantity: 2, price: 109, subtotal: 218 }
    ],
    'ord_827391': [
        { id: 'oi3', food_name: 'Schezwan Noodles', quantity: 2, price: 149, subtotal: 298 },
        { id: 'oi4', food_name: 'Coca Cola (Can)', quantity: 1, price: 40, subtotal: 40 }
    ],
    'ord_102837': [
        { id: 'oi5', food_name: 'Crispy Veg Burger', quantity: 1, price: 99, subtotal: 99 }
    ],
    'ord_564738': [
        { id: 'oi6', food_name: 'Traffic Jam Special Pizza', quantity: 2, price: 399, subtotal: 798 }
    ]
};

const MOCK_CATEGORIES = [
    { id: '1', name: 'Pizza', icon: '🍕' },
    { id: '2', name: 'Burger', icon: '🍔' },
    { id: '3', name: 'Chinese', icon: '🍜' },
    { id: '4', name: 'Biryani', icon: '🍛' },
    { id: '5', name: 'Rolls', icon: '🌯' },
    { id: '6', name: 'Dessert', icon: '🍰' },
    { id: '7', name: 'Cold Drinks', icon: '🥤' },
    { id: '8', name: 'Coffee', icon: '☕' },
    { id: '9', name: 'Mocktails', icon: '🍸' }
];

const MOCK_FOODS = [
    { id: 'f1', name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella cheese, and basil leaves', price: 249, category_id: '1', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: true, available: true },
    { id: 'f2', name: 'Traffic Jam Special Pizza', description: 'Signature double-crust pizza loaded with olives, jalapenos, mushrooms, double cheese, and spicy paneer', price: 399, category_id: '1', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f4', name: 'Crispy Veg Burger', description: 'A crispy veg patty served with fresh lettuce, onions, and creamy mayo', price: 99, category_id: '2', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: false, available: true },
    { id: 'f5', name: 'Ultimate Cheese Burger', description: 'Double patty burger stacked with melted cheddar cheese, sliced pickles, and signature house sauce', price: 189, category_id: '2', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f6', name: 'Schezwan Noodles', description: 'Spicy stir-fried noodles with veggies', price: 149, category_id: '3', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: false, available: true },
    { id: 'f9', name: 'Traffic Jam Special Chicken Biryani', description: 'Our flagship chicken Dum Biryani', price: 279, category_id: '4', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f11', name: 'Chocolate Brownie with Ice Cream', description: 'Warm, fudgy chocolate brownie', price: 149, category_id: '6', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60', popular: true, special: true, recommended: true, available: true },
    { id: 'f12', name: 'Classic Virgin Mojito', description: 'Refreshing blend of lime and mint', price: 109, category_id: '9', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', popular: true, special: false, recommended: true, available: true }
];

const MOCK_FEEDBACKS = [
    { id: 'fb1', order_id: 'ord_564738', rating: 5, review: 'Fantastic service! The double-crust pizza was extremely fresh and yummy.', created_at: new Date(Date.now() - 40 * 60000).toISOString() },
    { id: 'fb2', order_id: 'ord_102837', rating: 4, review: 'Nice crispy burger, served hot and fast.', created_at: new Date(Date.now() - 10 * 60000).toISOString() }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has active session in supabaseClient Auth
    checkAuthentication();

    // Sound configuration checkbox binding
    const soundToggle = document.getElementById('settingsSoundAlerts');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            adminState.settings.soundAlerts = e.target.checked;
        });
    }

    // Initialize QR code generation helper settings
    initQrHelper();
});

// --- AUTHENTICATION ENGINE ---
async function checkAuthentication() {
    if (supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                adminState.isLoggedIn = true;
                adminState.isOfflineMode = false;
                hideLoginOverlay();
                startDashboardService();
            }
        } catch (e) {
            console.error("supabaseClient authentication session check error:", e);
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const btn = document.getElementById('loginSubmitBtn');

    btn.innerText = "Signing in...";
    btn.disabled = true;

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                alert(`Authentication failed: ${error.message}`);
                btn.innerText = "Log In";
                btn.disabled = false;
            } else {
                adminState.isLoggedIn = true;
                adminState.isOfflineMode = false;
                hideLoginOverlay();
                startDashboardService();
            }
        } catch (err) {
            alert(`Error connecting to authentication server: ${err.message}`);
            btn.innerText = "Log In";
            btn.disabled = false;
        }
    } else {
        alert("supabaseClient is not configured yet! Click 'Enter Offline Preview Panel' below to evaluate the dashboard layout.");
        btn.innerText = "Log In";
        btn.disabled = false;
    }
}

function enterOfflineDashboard() {
    adminState.isLoggedIn = true;
    adminState.isOfflineMode = true;
    hideLoginOverlay();
    
    document.getElementById('realtimeIndicator').style.display = 'none';
    document.getElementById('offlineIndicator').style.display = 'flex';

    // Populate offline data variables
    adminState.categories = [...MOCK_CATEGORIES];
    adminState.foods = [...MOCK_FOODS];
    adminState.feedbacks = [...MOCK_FEEDBACKS];

    // Load initial offline orders from localStorage + fallback mocks
    const cachedOrders = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
    const transformedCached = cachedOrders.map(o => ({
        id: o.id,
        customer_name: o.customer_name || o.items || 'Walk-in Customer',
        phone: o.phone || '',
        table_number: o.table || o.table_number || 'Takeaway',
        order_type: o.order_type || (o.table === 'Takeaway' ? 'takeaway' : 'dining'),
        status: o.status || 'received',
        total: o.total || 0,
        special_instructions: o.special_instructions || '',
        created_at: o.date || o.created_at || new Date().toISOString()
    }));

    adminState.orders = [...transformedCached];
    MOCK_ORDERS.forEach(mock => {
        if (!adminState.orders.some(o => o.id === mock.id)) {
            adminState.orders.push(mock);
        }
    });

    startDashboardService();
    startOfflineSimulation();

    // Setup storage event listener for real-time offline sync between tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'tj_order_history' && adminState.isOfflineMode) {
            console.log("Customer order history changed in another tab, reloading...");
            refreshDashboardData();
        }
    });
}

function hideLoginOverlay() {
    document.getElementById('loginOverlay').classList.add('hidden');
}

function handleLogout() {
    if (supabaseClient && !adminState.isOfflineMode) {
        supabaseClient.auth.signOut();
    }
    location.reload();
}

// --- DASHBOARD SERVICE ENGINE ---
function startDashboardService() {
    // 1. Load initial data
    refreshDashboardData();

    // 2. Setup Realtime subscription if online
    if (supabaseClient && !adminState.isOfflineMode) {
        setupRealtimeSubscription();
    }

    // 3. Start Poller backup scheduler
    startBackupPoller();
}

// --- DATA REFRESH LOGIC ---
async function refreshDashboardData() {
    if (adminState.isOfflineMode) {
        // Reload from local storage to catch new client-placed orders
        const cachedOrders = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
        const transformedCached = cachedOrders.map(o => ({
            id: o.id,
            customer_name: o.customer_name || 'Customer',
            phone: o.phone || '',
            table_number: o.table || o.table_number || 'Takeaway',
            order_type: o.order_type || (o.table === 'Takeaway' ? 'takeaway' : 'dining'),
            status: o.status || 'received',
            total: o.total || 0,
            special_instructions: o.special_instructions || '',
            created_at: o.date || o.created_at || new Date().toISOString()
        }));

        const currentOrders = [...transformedCached];
        MOCK_ORDERS.forEach(mock => {
            if (!currentOrders.some(o => o.id === mock.id)) {
                currentOrders.push(mock);
            }
        });

        // Chime on new orders
        const prevCount = adminState.orders.filter(o => o.status === 'received').length;
        const newCount = currentOrders.filter(o => o.status === 'received').length;
        if (newCount > prevCount && prevCount > 0) {
            playIncomingOrderChime();
            showAdminToast(`New order received!`);
        }

        adminState.orders = currentOrders;
        renderAllDashboardData();
        return;
    }

    if (!supabaseClient) return;

    try {
        // Fetch Categories
        const { data: catData } = await supabaseClient.from('categories').select('*').order('name');
        if (catData) adminState.categories = catData;

        // Fetch Menu Foods
        const { data: foodData } = await supabaseClient.from('foods').select('*').order('name');
        if (foodData) adminState.foods = foodData;

        // Fetch Feedbacks
        const { data: fbData } = await supabaseClient.from('feedback').select('*').order('created_at', { ascending: false });
        if (fbData) adminState.feedbacks = fbData;

        // Fetch Orders
        const { data: orderData } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
        if (orderData) {
            // Check if there are new orders that weren't in the list before, to trigger a notification sound
            const prevCount = adminState.orders.length;
            const newOrders = orderData.filter(o => o.status === 'received');
            
            if (prevCount > 0 && orderData.length > prevCount && newOrders.length > 0) {
                playIncomingOrderChime();
            }
            
            adminState.orders = orderData;
        }

        renderAllDashboardData();
    } catch (err) {
        console.error("Dashboard refresh error:", err);
    }
}

function renderAllDashboardData() {
    renderLiveOrdersBoard();
    renderAnalytics();
    renderMenuEditor();
    renderFeedbacksTable();
    populateCategoryDropdown();
    
    // Refresh Customer list if on Customers Tab
    if (adminState.activeTab === 'customers') {
        renderCustomersTable();
    }
}

// --- LIVE KANBAN BOARD RENDER ---
function renderLiveOrdersBoard() {
    const columns = {
        'received': document.getElementById('list-received'),
        'preparing': document.getElementById('list-preparing'),
        'ready': document.getElementById('list-ready'),
        'delivered': document.getElementById('list-delivered')
    };

    const counters = {
        'received': document.getElementById('count-received'),
        'preparing': document.getElementById('count-preparing'),
        'ready': document.getElementById('count-ready'),
        'delivered': document.getElementById('count-delivered')
    };

    // Reset lists html
    Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });
    
    // Count columns
    const counts = { received: 0, preparing: 0, ready: 0, delivered: 0 };

    // Sort orders by timestamp (newest first)
    const sortedOrders = [...adminState.orders].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    sortedOrders.forEach(order => {
        const colKey = order.status;
        if (!columns[colKey]) return; // Skip cancelled

        counts[colKey]++;

        // Formulate items snippet if stored locally or query details
        const typeBadge = order.order_type === 'takeaway' ? 'Takeaway' : `Table ${order.table_number}`;
        const timeStr = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'order-card';
        card.onclick = () => openOrderDetailsModal(order.id);

        let actionBtnHtml = '';
        if (order.status === 'received') {
            actionBtnHtml = `
                <button class="btn-icon success" title="Accept Order" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'preparing')">
                    <ion-icon name="checkmark"></ion-icon>
                </button>
                <button class="btn-icon danger" title="Cancel Order" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'cancelled')">
                    <ion-icon name="close"></ion-icon>
                </button>
            `;
        } else if (order.status === 'preparing') {
            actionBtnHtml = `
                <button class="btn-icon success" title="Mark Ready" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'ready')">
                    <ion-icon name="restaurant"></ion-icon>
                </button>
            `;
        } else if (order.status === 'ready') {
            actionBtnHtml = `
                <button class="btn-icon info" title="Deliver Order" onclick="event.stopPropagation(); updateOrderStatus('${order.id}', 'delivered')">
                    <ion-icon name="bicycle"></ion-icon>
                </button>
            `;
        }

        card.innerHTML = `
            <div class="order-card-header">
                <span class="order-card-id">#${order.id.substring(0, 8)}</span>
                <span class="order-card-time">${timeStr}</span>
            </div>
            <h4 class="order-card-customer">${order.customer_name}</h4>
            <div style="margin-bottom: 10px;">
                <span class="order-card-table">${typeBadge}</span>
            </div>
            <div class="order-card-footer">
                <span class="order-card-total">₹${order.total}</span>
                <div class="order-card-actions">
                    ${actionBtnHtml}
                </div>
            </div>
        `;

        columns[colKey].appendChild(card);
    });

    // Update column counters
    Object.keys(counters).forEach(key => {
        if (counters[key]) counters[key].innerText = counts[key];
    });

    // Update sidebar live order count badge (only received orders)
    const badge = document.getElementById('liveOrderCountBadge');
    if (badge) {
        if (counts.received > 0) {
            badge.innerText = counts.received;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// --- UPDATE ORDER STATUS ENGINE ---
async function updateOrderStatus(orderId, nextStatus) {
    if (adminState.isOfflineMode) {
        const order = adminState.orders.find(o => o.id === orderId);
        if (order) {
            order.status = nextStatus;

            // Sync status back to local storage order history
            const history = JSON.parse(localStorage.getItem('tj_order_history') || '[]');
            const historyOrder = history.find(o => o.id === orderId);
            if (historyOrder) {
                historyOrder.status = nextStatus;
                localStorage.setItem('tj_order_history', JSON.stringify(history));
            }

            showAdminToast(`Order status updated to: ${nextStatus.toUpperCase()}`);
            playActionChime();
            renderLiveOrdersBoard();
            renderAnalytics();
        }
        return;
    }

    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: nextStatus })
            .eq('id', orderId);

        if (error) throw error;

        showAdminToast(`Status changed to ${nextStatus}`);
        playActionChime();
        refreshDashboardData();
    } catch (err) {
        console.error("Failed to update status:", err);
    }
}

// --- ORDER DETAIL POPUP MODAL ---
async function openOrderDetailsModal(orderId) {
    const order = adminState.orders.find(o => o.id === orderId);
    if (!order) return;

    adminState.selectedOrder = order;

    const modal = document.getElementById('orderDetailsModal');
    const body = document.getElementById('modalOrderDetailsBody');
    if (!modal || !body) return;

    body.innerHTML = `<h4>Loading order items...</h4>`;
    modal.classList.add('open');

    // Fetch order items
    let items = [];
    if (adminState.isOfflineMode) {
        items = MOCK_ORDER_ITEMS[orderId] || [];
    } else if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('order_items')
                .select('*, foods(name)')
                .eq('order_id', orderId);
            if (data && !error) {
                items = data.map(i => ({
                    food_name: i.foods ? i.foods.name : 'TJ Dish',
                    quantity: i.quantity,
                    price: i.price,
                    subtotal: i.subtotal
                }));
            }
        } catch (err) {
            console.error("Error loading order items:", err);
        }
    }

    let itemsRowsHtml = '';
    items.forEach(item => {
        itemsRowsHtml += `
            <tr style="border-bottom: 1px solid #f6f6f6;">
                <td style="padding: 10px 0;">${item.food_name}</td>
                <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 0; text-align: right;">₹${item.price}</td>
                <td style="padding: 10px 0; text-align: right;">₹${item.subtotal}</td>
            </tr>
        `;
    });

    const timestamp = new Date(order.created_at).toLocaleString();
    const orderTypeLabel = order.order_type === 'takeaway' ? 'Takeaway Order' : `Dine-in (Table ${order.table_number})`;

    body.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px dashed var(--border-color); padding-bottom: 12px;">
            <div>
                <strong style="font-size: 1.1rem; color: var(--primary);">#${order.id.substring(0, 12)}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${timestamp}</div>
            </div>
            <span class="history-status-badge status-${order.status}">${order.status.toUpperCase()}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 0.85rem;">
            <div>
                <span class="stat-label">Customer Name</span>
                <div style="font-weight: 600; margin-top: 2px;">${order.customer_name}</div>
            </div>
            <div>
                <span class="stat-label">Phone Number</span>
                <div style="font-weight: 600; margin-top: 2px;">${order.phone || 'N/A'}</div>
            </div>
            <div>
                <span class="stat-label">Dining Arrangement</span>
                <div style="font-weight: 600; margin-top: 2px;">${orderTypeLabel}</div>
            </div>
            <div>
                <span class="stat-label">Grand Total Bill</span>
                <div style="font-weight: 700; color: var(--primary); margin-top: 2px;">₹${order.total}</div>
            </div>
        </div>

        ${order.special_instructions ? `
        <div style="background-color: #fff9e6; border-left: 4px solid var(--warning); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 0.8rem;">
            <strong>Instructions:</strong> "${order.special_instructions}"
        </div>
        ` : ''}

        <div style="margin-top: 20px;">
            <h5 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Ordered Items</h5>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.8rem;">
                <thead>
                    <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 6px 0; background: none; font-weight: 600;">Item Name</th>
                        <th style="padding: 6px 0; background: none; font-weight: 600; text-align: center;">Qty</th>
                        <th style="padding: 6px 0; background: none; font-weight: 600; text-align: right;">Price</th>
                        <th style="padding: 6px 0; background: none; font-weight: 600; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRowsHtml || `<tr><td colspan="4" style="text-align: center; padding: 10px 0;">No items found.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;

    // Cache the loaded order items on state for printing logic
    adminState.selectedOrder.itemsList = items;
}

function closeOrderModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) modal.classList.remove('open');
}

// --- PRINT RECEIPT ENGINE ---
function printActiveOrderInvoice() {
    const order = adminState.selectedOrder;
    if (!order || !order.itemsList) return;

    const receiptDiv = document.getElementById('receiptPrintContainer');
    if (!receiptDiv) return;

    let itemsRows = '';
    order.itemsList.forEach(item => {
        itemsRows += `
            <tr>
                <td style="padding: 4px 0;">${item.food_name} x${item.quantity}</td>
                <td style="padding: 4px 0; text-align: right;">₹${item.subtotal}</td>
            </tr>
        `;
    });

    const timestamp = new Date(order.created_at).toLocaleString();

    receiptDiv.innerHTML = `
        <div class="receipt-header">
            <div class="receipt-title">TRAFFIC JAM RESTAURANT</div>
            <div style="font-size: 9pt; margin-top: 4px;">Barbil Road, Barbil, Odisha</div>
            <div style="font-size: 9pt;">Ph: +91 70081 23456</div>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-row">
            <span>Date:</span>
            <span>${timestamp}</span>
        </div>
        <div class="receipt-row">
            <span>Order ID:</span>
            <span>#${order.id.substring(0, 10)}</span>
        </div>
        <div class="receipt-row">
            <span>Customer:</span>
            <span>${order.customer_name}</span>
        </div>
        <div class="receipt-row" style="font-weight: bold;">
            <span>Arrangement:</span>
            <span>${order.order_type === 'takeaway' ? 'Takeaway' : 'Table ' + order.table_number}</span>
        </div>
        <div class="receipt-divider"></div>
        <table class="receipt-item-grid">
            <thead>
                <tr>
                    <th style="text-align: left;">Item Description</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>
        <div class="receipt-divider"></div>
        <div class="receipt-row">
            <span>GST (5% Incl.)</span>
            <span>₹${(order.total * 0.0476).toFixed(0)}</span>
        </div>
        <div class="receipt-row" style="font-weight: bold; font-size: 13pt;">
            <span>GRAND TOTAL</span>
            <span>₹${order.total}</span>
        </div>
        <div class="receipt-divider"></div>
        <div style="text-align: center; font-size: 8pt; margin-top: 15px;">
            Thank you for dining at Traffic Jam!<br>
            Please visit again soon.
        </div>
    `;

    // Trigger printing dialog
    window.print();
}

// --- ANALYTICS DASHBOARD CHART ENGINE ---
let revenueChartInstance = null;
let statusChartInstance = null;

function renderAnalytics() {
    const orders = adminState.orders;
    const completedOrders = orders.filter(o => o.status === 'delivered');

    // Computes sales statistics by daily/weekly/monthly ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyRev = completedOrders
        .filter(o => new Date(o.created_at) >= startOfToday)
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

    const weeklyRev = completedOrders
        .filter(o => new Date(o.created_at) >= startOfWeek)
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

    const monthlyRev = completedOrders
        .filter(o => new Date(o.created_at) >= startOfMonth)
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

    const totalRev = completedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const totalCount = orders.length;
    
    const feedbackCount = adminState.feedbacks.length;
    const avgRating = feedbackCount > 0 ? (adminState.feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbackCount) : 0;

    document.getElementById('analyticDailyRevenue').innerText = `₹${dailyRev.toFixed(0)}`;
    document.getElementById('analyticWeeklyRevenue').innerText = `₹${weeklyRev.toFixed(0)}`;
    document.getElementById('analyticMonthlyRevenue').innerText = `₹${monthlyRev.toFixed(0)}`;
    document.getElementById('analyticRevenue').innerText = `₹${totalRev.toFixed(0)}`;
    document.getElementById('analyticOrders').innerText = totalCount;
    document.getElementById('analyticRating').innerText = feedbackCount > 0 ? `${avgRating.toFixed(1)} / 5` : '0.0 / 5';

    // Graph calculations
    // 1. Orders by status
    const statusCounts = { received: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => {
        if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
        else statusCounts.cancelled++;
    });

    // 2. Revenue trend by day (last 5 days)
    const dates = [];
    const revenues = [];
    for (let i = 4; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        dates.push(dateStr);
        
        // Sum revenue of orders completed on that day
        const dayRev = orders
            .filter(o => o.status === 'delivered' && new Date(o.created_at).toDateString() === d.toDateString())
            .reduce((sum, o) => sum + parseFloat(o.total), 0);
        
        // Simulating some small values for aesthetics in offline mode if actual logs are low
        if (adminState.isOfflineMode && dayRev === 0) {
            revenues.push(2000 + (i * 1200) - (Math.random() * 500));
        } else {
            revenues.push(dayRev);
        }
    }

    // Chart.js rendering
    const ctxTrend = document.getElementById('revenueTrendChart');
    const ctxStatus = document.getElementById('statusChart');

    if (!ctxTrend || !ctxStatus) return;

    if (revenueChartInstance) revenueChartInstance.destroy();
    if (statusChartInstance) statusChartInstance.destroy();

    // Chart 1: Revenue Trends (Line Chart)
    revenueChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Sales (₹)',
                data: revenues,
                borderColor: '#FF6B00',
                backgroundColor: 'rgba(255, 107, 0, 0.05)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#f0f0f0' }, ticks: { font: { family: 'Poppins' } } },
                x: { grid: { display: false }, ticks: { font: { family: 'Poppins' } } }
            }
        }
    });

    // Chart 2: Order Statuses (Doughnut Chart)
    statusChartInstance = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: ['Received', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
            datasets: [{
                data: [statusCounts.received, statusCounts.preparing, statusCounts.ready, statusCounts.delivered, statusCounts.cancelled],
                backgroundColor: ['#0284c7', '#f59e0b', '#22c55e', '#64748b', '#ef4444'],
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 10 } } }
            }
        }
    });
}

// --- MENU EDITOR TAB ENGINE ---
function renderMenuEditor() {
    const tableBody = document.getElementById('menuTableBody');
    if (!tableBody) return;

    if (adminState.foods.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No menu items found.</td></tr>`;
        return;
    }

    let html = '';
    
    // Filter items
    const query = adminState.menuSearchQuery.toLowerCase().trim();
    const filtered = adminState.foods.filter(f => 
        f.name.toLowerCase().includes(query) || 
        (f.description && f.description.toLowerCase().includes(query))
    );

    filtered.forEach(food => {
        const cat = adminState.categories.find(c => c.id === food.category_id);
        const catName = cat ? cat.name : 'Uncategorized';
        const imageSrc = food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60';

        html += `
            <tr>
                <td><img class="food-table-img" src="${imageSrc}" alt="${food.name}"></td>
                <td><strong style="font-weight: 600;">${food.name}</strong><div style="font-size: 0.7rem; color: var(--text-muted); max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${food.description || ''}</div></td>
                <td>${catName}</td>
                <td>₹${food.price}</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${food.special ? 'checked' : ''} onchange="toggleFoodAttribute('${food.id}', 'special', this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${food.popular ? 'checked' : ''} onchange="toggleFoodAttribute('${food.id}', 'popular', this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${food.recommended ? 'checked' : ''} onchange="toggleFoodAttribute('${food.id}', 'recommended', this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${food.available ? 'checked' : ''} onchange="toggleFoodAttribute('${food.id}', 'available', this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon info" title="Edit Item" onclick="openFoodModal('${food.id}')">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button class="btn-icon danger" title="Delete Item" onclick="deleteFoodItem('${food.id}')">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function filterMenuTable() {
    const input = document.getElementById('menuSearchInput');
    if (input) {
        adminState.menuSearchQuery = input.value;
        renderMenuEditor();
    }
}

async function toggleFoodAttribute(foodId, attribute, isChecked) {
    if (adminState.isOfflineMode) {
        const food = adminState.foods.find(f => f.id === foodId);
        if (food) {
            food[attribute] = isChecked;
            showAdminToast(`Updated ${food.name} attribute!`);
        }
        return;
    }

    if (!supabaseClient) return;

    try {
        const updateData = {};
        updateData[attribute] = isChecked;

        const { error } = await supabaseClient
            .from('foods')
            .update(updateData)
            .eq('id', foodId);

        if (error) throw error;
        showAdminToast(`Item attributes saved.`);
        refreshDashboardData();
    } catch (err) {
        console.error("Failed to toggle food attribute:", err);
    }
}

async function deleteFoodItem(foodId) {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    if (adminState.isOfflineMode) {
        adminState.foods = adminState.foods.filter(f => f.id !== foodId);
        showAdminToast("Deleted menu item.");
        renderMenuEditor();
        return;
    }

    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from('foods')
            .delete()
            .eq('id', foodId);

        if (error) throw error;
        showAdminToast("Deleted item successfully.");
        refreshDashboardData();
    } catch (err) {
        console.error("Failed to delete menu item:", err);
    }
}

// --- POPULATING DYNAMIC SELECTIONS ---
function populateCategoryDropdown() {
    const select = document.getElementById('foodCategorySelect');
    if (!select) return;

    let html = '';
    adminState.categories.forEach(cat => {
        html += `<option value="${cat.id}">${cat.name}</option>`;
    });
    select.innerHTML = html;
}

// --- FOOD ADD/EDIT MODAL LOGIC ---
function openFoodModal(foodId = null) {
    const modal = document.getElementById('foodFormModal');
    const title = document.getElementById('foodModalTitle');
    const form = document.getElementById('foodForm');
    
    if (!modal || !form) return;

    form.reset();
    populateCategoryDropdown();

    if (foodId) {
        title.innerText = "Edit Menu Item";
        const food = adminState.foods.find(f => f.id === foodId);
        if (food) {
            document.getElementById('editFoodId').value = food.id;
            document.getElementById('foodName').value = food.name;
            document.getElementById('foodDesc').value = food.description || '';
            document.getElementById('foodPrice').value = food.price;
            document.getElementById('foodCategorySelect').value = food.category_id;
            document.getElementById('foodImageUrl').value = food.image || '';
            document.getElementById('foodCheckSpecial').checked = food.special || false;
            document.getElementById('foodCheckPopular').checked = food.popular || false;
            document.getElementById('foodCheckRecommended').checked = food.recommended || false;
        }
    } else {
        title.innerText = "Add Menu Item";
        document.getElementById('editFoodId').value = '';
    }

    modal.classList.add('open');
}

function closeFoodModal() {
    const modal = document.getElementById('foodFormModal');
    if (modal) modal.classList.remove('open');
}

async function handleFoodFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('editFoodId').value;
    const name = document.getElementById('foodName').value.trim();
    const description = document.getElementById('foodDesc').value.trim();
    const price = parseFloat(document.getElementById('foodPrice').value);
    const category_id = document.getElementById('foodCategorySelect').value;
    const image = document.getElementById('foodImageUrl').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
    const special = document.getElementById('foodCheckSpecial').checked;
    const popular = document.getElementById('foodCheckPopular').checked;
    const recommended = document.getElementById('foodCheckRecommended').checked;

    const data = { name, description, price, category_id, image, special, popular, recommended, available: true };

    showAdminToast("Saving menu item...");

    if (adminState.isOfflineMode) {
        if (id) {
            const food = adminState.foods.find(f => f.id === id);
            if (food) Object.assign(food, data);
        } else {
            const newFood = { id: 'food_' + Math.random().toString(36).substr(2, 9), ...data };
            adminState.foods.push(newFood);
        }
        showAdminToast("Menu item saved!");
        closeFoodModal();
        renderMenuEditor();
        return;
    }

    if (!supabaseClient) return;

    try {
        if (id) {
            const { error } = await supabaseClient.from('foods').update(data).eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabaseClient.from('foods').insert([data]);
            if (error) throw error;
        }
        showAdminToast("Menu item saved successfully!");
        closeFoodModal();
        refreshDashboardData();
    } catch (err) {
        console.error("Failed to save menu item:", err);
        alert(`Failed to save menu item: ${err.message}`);
    }
}

// --- FEEDBACKS LIST RENDER ---
function renderFeedbacksTable() {
    const tableBody = document.getElementById('feedbackTableBody');
    if (!tableBody) return;

    if (adminState.feedbacks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No feedback reviews received yet.</td></tr>`;
        return;
    }

    let html = '';
    adminState.feedbacks.forEach(fb => {
        const orderIdSnippet = fb.order_id ? fb.order_id.substring(0, 12) : 'TJ Special Table';
        const dateStr = new Date(fb.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let stars = '';
        for(let i=1; i<=5; i++) {
            if(i <= fb.rating) stars += `<ion-icon name="star" style="color: #FF6B00; font-size: 1rem;"></ion-icon>`;
            else stars += `<ion-icon name="star-outline" style="color: #ccc; font-size: 1rem;"></ion-icon>`;
        }

        html += `
            <tr>
                <td><strong>#${orderIdSnippet}</strong></td>
                <td><div style="display: flex;">${stars}</div></td>
                <td>"${fb.review || 'No written comment'}"</td>
                <td>${dateStr}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// --- QR CODE GENERATION HELPER ENGINE ---
function initQrHelper() {
    const tableInput = document.getElementById('qrTableNum');
    const urlInput = document.getElementById('qrGeneratedUrl');

    if (!tableInput || !urlInput) return;

    const baseDomain = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    
    const updateUrl = () => {
        const num = String(tableInput.value).padStart(2, '0');
        urlInput.value = `${baseDomain}?table=${num}`;
    };

    tableInput.addEventListener('input', updateUrl);
    updateUrl();
}

function copyGeneratedQrLink() {
    const urlInput = document.getElementById('qrGeneratedUrl');
    if (urlInput) {
        urlInput.select();
        document.execCommand('copy');
        showAdminToast("QR code link copied to clipboard!");
    }
}

// --- REALTIME SUBSCRIPTIONS ENGINE ---
function setupRealtimeSubscription() {
    if (!supabaseClient) return;

    // Listen to changes in orders table
    const ordersChannel = supabaseClient
        .channel('dashboard-live-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload) => {
                console.log("Realtime order database payload event:", payload);
                if (payload.eventType === 'INSERT') {
                    // Play chime for incoming order
                    if (payload.new.status === 'received') {
                        playIncomingOrderChime();
                    }
                    showAdminToast(`New order received from ${payload.new.customer_name}!`);
                }
                refreshDashboardData();
            }
        )
        .subscribe();
}

// --- BACKUP AUTOMATED POLLER ---
let pollerIntervalId = null;
function startBackupPoller() {
    if (pollerIntervalId) clearInterval(pollerIntervalId);
    
    pollerIntervalId = setInterval(() => {
        if (adminState.isLoggedIn && !adminState.isOfflineMode) {
            refreshDashboardData();
        }
    }, adminState.settings.pollingInterval);
}

function updatePollingSettings() {
    const select = document.getElementById('settingsPollingInterval');
    if (select) {
        adminState.settings.pollingInterval = parseInt(select.value);
        startBackupPoller();
        showAdminToast("Polling settings updated.");
    }
}

// --- TAB SWITCHER ROUTER ---
function switchTab(tabId) {
    adminState.activeTab = tabId;

    // Switch active tabs menu UI
    const menuIds = ['live-orders', 'analytics', 'menu-mgmt', 'feedback', 'customers', 'reports', 'settings'];
    menuIds.forEach(id => {
        const el = document.getElementById(`menu-${id}`);
        if (el) {
            if (id === tabId) el.classList.add('active');
            else el.classList.remove('active');
        }
    });

    // Switch active tab view UI
    menuIds.forEach(id => {
        const el = document.getElementById(`tab-${id}`);
        if (el) {
            if (id === tabId) el.classList.add('active');
            else el.classList.remove('active');
        }
    });

    // Toggle header title
    const titles = {
        'live-orders': 'Live Orders',
        'analytics': 'Business Analytics',
        'menu-mgmt': 'Menu Management',
        'feedback': 'Customer Feedbacks',
        'customers': 'Customer CRM',
        'reports': 'Sales Reports',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];

    // Close side drawer on mobile
    const sidebar = document.getElementById('dashboardSidebar');
    if (sidebar) sidebar.classList.remove('open');
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.remove('open');

    // Trigger chart redraw on tab select to resolve canvas dimensioning
    if (tabId === 'analytics') {
        setTimeout(renderAnalytics, 150);
    } else if (tabId === 'customers') {
        renderCustomersTable();
    } else if (tabId === 'reports') {
        // Reset report container
        document.getElementById('reportResultContainer').style.display = 'none';
    }
}

function renderCustomersTable() {
    const tableBody = document.getElementById('customersTableBody');
    if (!tableBody) return;

    const orders = adminState.orders;
    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No customer records found.</td></tr>`;
        return;
    }

    // Group orders by phone (or customer name if phone is empty)
    const customerMap = {};
    orders.forEach(order => {
        const key = order.phone ? order.phone.trim() : `Guest_${order.customer_name.trim()}`;
        if (!customerMap[key]) {
            customerMap[key] = {
                name: order.customer_name,
                phone: order.phone || 'Walk-in / Table',
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: new Date(0)
            };
        }
        
        customerMap[key].totalOrders++;
        customerMap[key].totalSpent += parseFloat(order.total || 0);
        
        const orderDate = new Date(order.created_at);
        if (orderDate > customerMap[key].lastOrderDate) {
            customerMap[key].lastOrderDate = orderDate;
        }
    });

    const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);

    let html = '';
    customers.forEach(cust => {
        const lastOrderFormatted = cust.lastOrderDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        html += `
            <tr>
                <td><strong>${cust.name}</strong></td>
                <td>${cust.phone}</td>
                <td>${cust.totalOrders}</td>
                <td>₹${cust.totalSpent.toFixed(0)}</td>
                <td>${lastOrderFormatted}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Reports logic
adminState.activeReport = {
    title: '',
    headers: [],
    rows: []
};

// Generate reports dynamically based on category sales or dish performance
async function generateReport(type) {
    const container = document.getElementById('reportResultContainer');
    const titleEl = document.getElementById('reportTitle');
    const headEl = document.getElementById('reportTableHead');
    const bodyEl = document.getElementById('reportTableBody');

    if (!container || !titleEl || !headEl || !bodyEl) return;

    // Fetch order items if supabaseClient is connected to compute item-specific stats
    // In offline mode, use simulated aggregates
    let salesData = {};
    let itemPerformance = {};

    if (adminState.isOfflineMode) {
        // Mock data aggregation from MOCK_ORDER_ITEMS
        Object.keys(MOCK_ORDER_ITEMS).forEach(orderId => {
            const items = MOCK_ORDER_ITEMS[orderId];
            items.forEach(item => {
                // Populate salesData (category sales simulation)
                let category = 'Others';
                if (item.food_name.includes('Pizza')) category = 'Pizza';
                else if (item.food_name.includes('Burger')) category = 'Burger';
                else if (item.food_name.includes('Biryani')) category = 'Biryani';
                else if (item.food_name.includes('Mojito') || item.food_name.includes('Coke') || item.food_name.includes('Drinks')) category = 'Cold Drinks';

                salesData[category] = (salesData[category] || 0) + item.subtotal;

                // Populate dish performance
                if (!itemPerformance[item.food_name]) {
                    itemPerformance[item.food_name] = { quantity: 0, revenue: 0 };
                }
                itemPerformance[item.food_name].quantity += item.quantity;
                itemPerformance[item.food_name].revenue += item.subtotal;
            });
        });
    } else if (supabaseClient) {
        try {
            // Aggregate from orders and order items in database
            const { data: items } = await supabaseClient.from('order_items').select('*, foods(name, categories(name))');
            if (items) {
                items.forEach(item => {
                    const catName = (item.foods && item.foods.categories) ? item.foods.categories.name : 'Others';
                    const foodName = item.foods ? item.foods.name : 'Unknown Dish';
                    
                    salesData[catName] = (salesData[catName] || 0) + parseFloat(item.subtotal || 0);

                    if (!itemPerformance[foodName]) {
                        itemPerformance[foodName] = { quantity: 0, revenue: 0 };
                    }
                    itemPerformance[foodName].quantity += item.quantity;
                    itemPerformance[foodName].revenue += parseFloat(item.subtotal || 0);
                });
            }
        } catch (err) {
            console.error("Report generation DB error:", err);
        }
    }

    if (type === 'sales') {
        adminState.activeReport.title = "Sales Report - Category Wise";
        adminState.activeReport.headers = ["Food Category", "Total Sales Revenue"];
        adminState.activeReport.rows = Object.keys(salesData).map(cat => [cat, `₹${salesData[cat].toFixed(0)}`]);
    } else if (type === 'items') {
        adminState.activeReport.title = "Dish Performance - Top Selling";
        adminState.activeReport.headers = ["Dish Name", "Quantity Sold", "Total Revenue Generated"];
        adminState.activeReport.rows = Object.keys(itemPerformance)
            .map(name => [name, itemPerformance[name].quantity, `₹${itemPerformance[name].revenue.toFixed(0)}`])
            .sort((a, b) => b[1] - a[1]); // Sort by qty sold
    }

    // Render report in table
    titleEl.innerText = adminState.activeReport.title;

    let headHtml = '<tr>';
    adminState.activeReport.headers.forEach(h => {
        headHtml += `<th>${h}</th>`;
    });
    headHtml += '</tr>';
    headEl.innerHTML = headHtml;

    let bodyHtml = '';
    if (adminState.activeReport.rows.length === 0) {
        bodyHtml = `<tr><td colspan="${adminState.activeReport.headers.length}" style="text-align: center;">No data found for report period.</td></tr>`;
    } else {
        adminState.activeReport.rows.forEach(row => {
            bodyHtml += '<tr>';
            row.forEach(val => {
                bodyHtml += `<td>${val}</td>`;
            });
            bodyHtml += '</tr>';
        });
    }
    bodyEl.innerHTML = bodyHtml;

    container.style.display = 'block';
    showAdminToast("Report generated successfully!");
}

function exportReportToCSV() {
    if (!adminState.activeReport.rows || adminState.activeReport.rows.length === 0) {
        showAdminToast("No report data available to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += adminState.activeReport.headers.join(",") + "\n";
    
    // Add rows
    adminState.activeReport.rows.forEach(row => {
        const cleanedRow = row.map(val => {
            // Remove currency symbol and escape commas
            const strVal = String(val).replace('₹', '');
            return strVal.includes(',') ? `"${strVal}"` : strVal;
        });
        csvContent += cleanedRow.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = adminState.activeReport.title.toLowerCase().replace(/ /g, "_") + ".csv";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAdminToast("CSV report downloaded!");
}

function toggleSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

// --- OFFLINE SIMULATION FEED ---
// Simulates customer activities in offline mode so user can evaluate live notifications chime
let offlineSimIntervalId = null;
function startOfflineSimulation() {
    if (offlineSimIntervalId) clearInterval(offlineSimIntervalId);
    
    // Simulate a new customer table order placing every 60 seconds
    offlineSimIntervalId = setInterval(() => {
        if (!adminState.isLoggedIn || !adminState.isOfflineMode) return;

        const customerNames = ['Amit Kumar', 'Priyanka Das', 'Ramesh Mohanty', 'Subhashree Sahoo', 'Sanjay Patnaik'];
        const itemsList = [
            { food_name: 'Margherita Pizza x1, Cafe Latte x1', total: 368 },
            { food_name: 'Traffic Jam Special Chicken Biryani x2', total: 586 },
            { food_name: 'Crispy Veg Burger x1, Classic Virgin Mojito x1', total: 218 }
        ];

        const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const randomItemChoice = itemsList[Math.floor(Math.random() * itemsList.length)];
        const randomTable = String(Math.floor(Math.random() * 15) + 1).padStart(2, '0');
        const randomOrderId = 'ord_' + Math.random().toString(36).substr(2, 6);

        const simulatedOrder = {
            id: randomOrderId,
            customer_name: randomName,
            phone: '98765' + Math.floor(Math.random() * 90000 + 10000),
            table_number: randomTable,
            order_type: 'dining',
            status: 'received',
            total: randomItemChoice.total,
            special_instructions: 'Auto simulated preview order alert',
            created_at: new Date().toISOString()
        };

        // Add order items to mock cache
        MOCK_ORDER_ITEMS[randomOrderId] = randomItemChoice.food_name.split(', ').map((str, idx) => {
            const parts = str.split(' x');
            const name = parts[0];
            const qty = parseInt(parts[1]);
            const food = MOCK_FOODS.find(f => f.name === name) || { price: 100 };
            return {
                id: 'oi_sim_' + idx,
                food_name: name,
                quantity: qty,
                price: food.price,
                subtotal: food.price * qty
            };
        });

        // Insert at start
        adminState.orders.unshift(simulatedOrder);

        // Alert
        playIncomingOrderChime();
        showAdminToast(`New simulated order received from ${randomName}!`);
        
        // Render
        if (adminState.activeTab === 'live-orders') renderLiveOrdersBoard();
        if (adminState.activeTab === 'analytics') renderAnalytics();

    }, 60000);
}

// --- ADMIN TOAST SYSTEM ---
function showAdminToast(message) {
    // Generate toast overlay inside main dashboard header
    const container = document.body;
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = '#222';
    toast.style.color = '#fff';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '10000';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.borderLeft = '4px solid var(--primary)';
    toast.innerHTML = `<ion-icon name="information-circle-outline" style="color: var(--primary); font-size: 1.2rem;"></ion-icon> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// --- SOUND NOTIFICATION ALARMS SYNTHESIZERS ---
// High quality synthesized sounds using Web Audio API

// Chime for new incoming order (double pleasant ding)
function playIncomingOrderChime() {
    if (!adminState.settings.soundAlerts) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const triggerNote = (freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(time);
            osc.stop(time + dur);
        };

        // Two notes chime: C6 followed by E6
        triggerNote(1046.50, ctx.currentTime, 0.4); // C6
        triggerNote(1318.51, ctx.currentTime + 0.15, 0.6); // E6
    } catch(e) {
        console.warn("Realtime order sound chime autoplay blocked by client browser policy.");
    }
}

// Action feed feedback sound (single confirmation pip)
function playActionChime() {
    if (!adminState.settings.soundAlerts) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.08); // D6

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.warn("Action chime sound blocked.");
    }
}
