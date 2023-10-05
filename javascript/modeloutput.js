const form = document.querySelector('.riskform');
const getform = document.getElementById('riskForm'); // Select the form by its ID


// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    // Create a FormData object from the form element
    const formData = new FormData(form);

    // Convert FormData to an object
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    
    // Fetch data from the Flask route
    try {
        const response = await fetch('http://localhost:5000/process_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const data = await response.json();

        // Access the JSON data and update your HTML content
        //document.getElementById('prediction').textContent = data.prediction;
        // Hide the form
        getform.style.display = 'none';
        document.getElementById('result').innerHTML = data.risk_map;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add an event listener to the form
document.querySelector('form').addEventListener('submit', handleSubmit);
