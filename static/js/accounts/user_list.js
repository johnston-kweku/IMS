/**
 * Staff Status Toggle Management
 */

document.addEventListener('click', async (e) => {
    const toggleButton = e.target.closest('.toggle');
    if (toggleButton) {
        const username = toggleButton.dataset.username;
        const originalContent = toggleButton.innerHTML;
        
        try {
            // Loading state
            toggleButton.disabled = true;
            toggleButton.innerHTML = '...';

            const response = await fetch(`/accounts/${username}/active/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to update status');

            const data = await response.json();
            
            if (data.success) {
                // Update UI elements
                const statusContainer = document.querySelector(`.active-status-${username}`);
                if (statusContainer) {
                    const dot = statusContainer.querySelector('.active-dot');
                    const text = statusContainer.querySelector('.status-text');
                    
                    if (data.is_active) {
                        dot.classList.remove('bg-slate-300');
                        dot.classList.add('bg-green-500');
                        text.textContent = 'Active';
                        
                        toggleButton.classList.remove('bg-red-500');
                        toggleButton.classList.add('bg-green-500');
                    } else {
                        dot.classList.remove('bg-green-500');
                        dot.classList.add('bg-slate-300');
                        text.textContent = 'Inactive';
                        
                        toggleButton.classList.remove('bg-green-500');
                        toggleButton.classList.add('bg-red-500');
                    }
                }
                
                if (typeof toast !== 'undefined') {
                    toast.show(data.message, 'success');
                }
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Toggle error:', error);
            if (typeof toast !== 'undefined') {
                toast.show(error.message, 'error');
            }
        } finally {
            toggleButton.disabled = false;
            toggleButton.innerHTML = 'Toggle Active';
        }
    }
});

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
