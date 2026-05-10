const labels = chartData.map(item => item.month);
const revenue = chartData.map(item => item.revenue);
const profit = chartData.map(item => item.profit);


const revenueCtx = document.getElementById('revenueChart').getContext('2d');

new Chart(revenueCtx, {
    type: 'bar',
    data : {
        labels: labels,
        datasets: [
            {
                label: 'Revenue',
                data: revenue,
                backgroundColor: '#6366f1',
                borderRadius: 8
            },
            {
                label: 'Profit',
                data: profit,
                backgroundColor: '#8b5cf6',
                borderRadius: 8
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            'legend': { position: 'top' }
        }
    }
})