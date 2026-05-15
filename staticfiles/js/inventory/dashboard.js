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
        maintainAspectRatio: false,
        plugins: {
            'legend': { position: 'top' }
        }
    }
})


const salesTrendCtx = document.getElementById('salesTrendChart').getContext('2d');

new Chart(salesTrendCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Sales',
                data: chartData.map(item => item.sales_count),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#6366f1',
                fill: true,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});