// Function to make an AJAX request to the server
function fetchData() {
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // You can include any data to send to the server here
        // body: JSON.stringify({ someData: 'example' }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the data received from the server
        const riskHeatmap = data.risk_heatmap;
        const otherData = data.other_data;

        // Update the page with the received data
        document.getElementById('result').innerHTML = riskHeatmap;
        // You can also update other parts of your page with otherData

        console.log('Other Data:', otherData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Call the fetchData function when the page loads
window.onload = fetchData;

