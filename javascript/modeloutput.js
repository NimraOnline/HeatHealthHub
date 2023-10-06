const form = document.querySelector('.riskform');

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

        const htmlContent = `
        <html>
        <link href='https://fonts.googleapis.com/css?family=Jost' rel='stylesheet'>
        <head>
          <title>Popup Window</title>
        </head>
        <body>
        <center>
          <h1 style="font-family: 'Jost';">Your Risk Results</h1>
          ${data.risk_map}
        </center>
        </body>
        </html>
      `;
        const popupWindow = window.open('', '', 'width=600,height=400');
        popupWindow.document.open();
        popupWindow.document.write(htmlContent);
        popupWindow.document.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add an event listener to the form
document.querySelector('form').addEventListener('submit', handleSubmit);
