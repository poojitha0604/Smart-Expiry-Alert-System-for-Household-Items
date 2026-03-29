let allItems = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        document.getElementById('user-greeting').textContent = `Hello, ${data.user.name}`;
        
        // Load items initially
        await fetchItems();
    } catch (err) {
        console.error('Not authenticated');
        window.location.href = '/login';
    }
});

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const payload = {
        item_name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        purchase_date: document.getElementById('purchase-date').value || null,
        expiry_date: document.getElementById('expiry-date').value,
        notes: document.getElementById('item-notes').value
    };

    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('add-item-form').reset();
            await fetchItems();
        } else {
            alert('Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item', error);
    }
}

async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        if (response.ok) {
            const data = await response.json();
            allItems = data.items;
            renderItems();
        }
    } catch (error) {
        console.error('Error fetching items', error);
    }
}

async function deleteItem(id) {
    if(!confirm("Are you sure you want to delete this item?")) return;
    try {
        const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await fetchItems();
        }
    } catch (error) {
        console.error('Error deleting', error);
    }
}

function renderItems() {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';
    
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const filterCat = document.getElementById('filter-category').value;

    let itemsForDisplay = allItems.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchQuery);
        const matchesCategory = filterCat === 'All' || item.category === filterCat;
        return matchesSearch && matchesCategory;
    });

    let total = itemsForDisplay.length;
    let soon = 0;
    let expired = 0;

    itemsForDisplay.forEach(item => {
        // Calculate days left
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let statusClass = 'status-green';
        let bgClass = 'bg-green';
        let text = `Expires in ${daysLeft} days`;

        if (daysLeft <= 0) {
            statusClass = 'status-red';
            bgClass = 'bg-red';
            text = `Expired ${Math.abs(daysLeft)} days ago`;
            expired++;
        } else if (daysLeft <= 7) {
            statusClass = 'status-yellow';
            bgClass = 'bg-yellow';
            text = `Expiring soon (${daysLeft} days)`;
            soon++;
        }

        const card = document.createElement('div');
        card.className = `item-card ${statusClass}`;
        
        card.innerHTML = `
            <div class="item-header">
                <h3 class="item-name">${item.item_name}</h3>
                <span class="item-category">${item.category}</span>
            </div>
            <p class="item-meta">Expiry: ${new Date(item.expiry_date).toLocaleDateString()}</p>
            <p class="item-meta">${item.notes || ''}</p>
            <div class="days-left ${bgClass}">${text}</div>
            <div class="item-actions">
                <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Update stats
    document.getElementById('total-items').textContent = total;
    document.getElementById('expiring-soon').textContent = soon;
    document.getElementById('expired-items').textContent = expired;
}
