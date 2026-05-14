/**
 * Inventory Management JS
 */

const modal = document.querySelector('#edit-modal');
const deleteModal = document.querySelector('#delete-modal');
const modalNameInput = modal?.querySelector('#modal-name');
const modalWholesaleInput = modal?.querySelector('#modal-wholesale');
const modalRetailInput = modal?.querySelector('#modal-retail');
const modalInventoryInput = modal?.querySelector('#modal-inventory');
const modalDrugIdInput = modal?.querySelector('#modal-drug-id');

let drugIdToDelete = null;

document.addEventListener('click', (e) => {
    // Update button click
    const updateDrugBtn = e.target.closest('.update-drug');
    if (updateDrugBtn) {
        const drugId = updateDrugBtn.dataset.drugId;
        const drugName = updateDrugBtn.dataset.drugName;
        const wholesalePrice = updateDrugBtn.dataset.drugWholesale;
        const retailPrice = updateDrugBtn.dataset.drugRetail;
        const drugInventory = updateDrugBtn.dataset.drugInventory;
        openModal(drugId, drugName, wholesalePrice, retailPrice, drugInventory);
    }

    // Delete button click
    const deleteDrugBtn = e.target.closest('.delete-drug-btn');
    if (deleteDrugBtn) {
        const drugId = deleteDrugBtn.dataset.drugId;
        const drugName = deleteDrugBtn.dataset.drugName;
        openDeleteModal(drugId, drugName);
    }

    // Save button click
    const saveDrugBtn = e.target.closest('.save-drug');
    if (saveDrugBtn) {
        saveDrug();
    }

    // Confirm delete click
    const confirmDeleteBtn = e.target.closest('#confirm-delete-btn');
    if (confirmDeleteBtn) {
        executeDelete();
    }

    // Cancel/Close modal
    const cancelBtn = e.target.closest('.cancel-update') || e.target.closest('button[onclick="closeModal()"]');
    if (cancelBtn) {
        closeModal();
    }
});

// Live Search logic
const searchInput = document.getElementById('inventory-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const name = row.querySelector('.text-sm.font-bold')?.textContent.toLowerCase() || '';
            const desc = row.querySelector('.text-\[10px\].text-slate-400')?.textContent.toLowerCase() || '';
            
            if (name.includes(query) || desc.includes(query)) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    });
}

function openModal(drugId, drugName, drugWholesale, drugRetail, drugInventory) {
    if (!modal) return;
    modal.classList.replace('hidden', 'flex');

    if (modalDrugIdInput) modalDrugIdInput.value = drugId;
    if (modalNameInput) modalNameInput.value = drugName;
    if (modalWholesaleInput) modalWholesaleInput.value = drugWholesale;
    if (modalRetailInput) modalRetailInput.value = drugRetail;
    if (modalInventoryInput) modalInventoryInput.value = drugInventory;
}

function closeModal() {
    if (!modal) return;
    modal.classList.replace('flex', 'hidden');
}

function openDeleteModal(drugId, drugName) {
    if (!deleteModal) return;
    drugIdToDelete = drugId;
    const nameSpan = document.getElementById('delete-drug-name');
    if (nameSpan) nameSpan.textContent = drugName;
    deleteModal.classList.replace('hidden', 'flex');
}

function closeDeleteModal() {
    if (!deleteModal) return;
    deleteModal.classList.replace('flex', 'hidden');
    drugIdToDelete = null;
}

async function executeDelete() {
    if (!drugIdToDelete) return;

    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    try {
        const response = await fetch(`/inventory/drugs/${drugIdToDelete}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            if (typeof toast !== 'undefined') {
                toast.show(result.message || 'Drug deleted successfully', 'success');
            }
            // Direct DOM update: Remove the row from the table
            const row = document.querySelector(`button.delete-drug-btn[data-drug-id="${drugIdToDelete}"]`)?.closest('tr');
            if (row) {
                row.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-300');
                setTimeout(() => row.remove(), 300);
            }
            closeDeleteModal();
        } else {
            if (typeof toast !== 'undefined') {
                toast.show(result.message || 'Error deleting drug', 'error');
            }
            closeDeleteModal();
        }
    } catch (error) {
        console.error('Delete error:', error);
        if (typeof toast !== 'undefined') {
            toast.show('An error occurred while deleting the drug.', 'error');
        }
        closeDeleteModal();
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Yes, Delete';
    }
}

async function saveDrug() {
    const drugId = modalDrugIdInput.value;
    const data = {
        name: modalNameInput.value,
        wholesale_price: modalWholesaleInput.value,
        retail_price: modalRetailInput.value,
        inventory: modalInventoryInput.value
    };

    try {
        const response = await fetch(`/inventory/drugs/${drugId}/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: new URLSearchParams(data)
        });

        const result = await response.json();
        if (result.success) {
            if (typeof toast !== 'undefined') {
                toast.show(result.message || 'Drug updated successfully', 'success');
            }
            
            // Direct DOM update: Update the table row without reload
            const updateBtn = document.querySelector(`button.update-drug[data-drug-id="${drugId}"]`);
            const row = updateBtn?.closest('tr');
            
            if (row && result.drug) {
                // Update text displays
                row.querySelector('.text-sm.font-bold').textContent = result.drug.name;
                
                const prices = row.querySelectorAll('td.font-bold');
                // Finding correct price columns (index-based or class-based)
                // Assuming order: Cost Price, Wholesale, Retail
                // Cost price isn't updated in this modal, but let's update others
                prices.forEach(cell => {
                    if (cell.textContent.includes('¢')) {
                        const val = cell.textContent;
                        // Logic to determine which price it is based on surrounding text or order
                        // In our template: Wholesale is 4th, Retail is 5th
                    }
                });

                // More precise selection
                const cells = row.querySelectorAll('td');
                // Stock Badge (Cell 2)
                const stockCell = cells[1];
                const inventoryInt = parseInt(result.drug.inventory);
                let badgeClass = 'bg-red-50 text-red-600';
                let badgeText = 'Out of Stock';
                
                if (inventoryInt > 10) {
                    badgeClass = 'bg-green-50 text-green-600';
                    badgeText = `${inventoryInt} units`;
                } else if (inventoryInt > 0) {
                    badgeClass = 'bg-amber-50 text-amber-600';
                    badgeText = `${inventoryInt} units`;
                }
                
                stockCell.innerHTML = `<div class="flex justify-center"><span class="${badgeClass} px-3 py-1 rounded-full text-xs font-bold">${badgeText}</span></div>`;
                
                // Wholesale (Cell 4)
                cells[3].textContent = `¢${result.drug.wholesale_price}`;
                // Retail (Cell 5)
                cells[4].textContent = `¢${result.drug.retail_price}`;

                // Update data attributes on the update button for future edits
                updateBtn.dataset.drugName = result.drug.name;
                updateBtn.dataset.drugWholesale = result.drug.wholesale_price;
                updateBtn.dataset.drugRetail = result.drug.retail_price;
                updateBtn.dataset.drugInventory = result.drug.inventory;
                
                // Flash the row to indicate success
                row.classList.add('bg-blue-50');
                setTimeout(() => row.classList.remove('bg-blue-50'), 1000);
            }
            
            closeModal();
        } else {
            if (typeof toast !== 'undefined') {
                toast.show(result.message || 'Error updating drug', 'error');
            }
        }
    } catch (error) {
        console.error('Update error:', error);
        if (typeof toast !== 'undefined') {
            toast.show('An error occurred while updating the drug.', 'error');
        }
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
