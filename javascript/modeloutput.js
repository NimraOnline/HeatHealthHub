const form = document.querySelector('.riskform');

// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const formDataList = [];
    const medicalriskfactors = [];
    formData.forEach((value, key) => {
        if (key === 'city') {
            formDataList.push(value);
        }
        else if (key === 'age' || key === 'gender') {
            if (key === 'gender') {
                formDataList.push(value === 'female' ? 0 : 1);
            } else { //age
                formDataList.push(parseInt(value));
            }
        } else {
            formDataList.push(value === 'no' ? 0 : 1);
            if (value === 'yes'){
                medicalriskfactors.push(key);
            }
        }
    });
    let insight;
    if (medicalriskfactors.length > 0){
        insight = `<p style="font-family: 'Jost';"> 💡 Visit the <a href="https://nimraonline.github.io/HeatHealthHub/Knowledgehub.html" target="_blank">Knowledge Hub</a> for more information on ${medicalriskfactors} and heatwaves, including preventative actions. </p>`;
    }
    else{
        insight = "";
    }
    // Fetch data from the Flask route
    try {
        const response = await fetch('http://localhost:5000/process_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataList),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const data = await response.json();
        var color;
        if (data.prediction === 'Low Risk'){
            color = '#75CF7E';
        }
        if (data.prediction === 'Moderate Risk'){
            color = '#FFF071';
        }
        if (data.prediction === 'High Risk'){
            color = '#FFA64C';
        }
        if (data.prediction === 'Very High Risk'){
            color = '#FF4C4C';
        }
        const htmlContent = `
        <html>
        <link href='https://fonts.googleapis.com/css?family=Jost' rel='stylesheet'>
        <head>
          <title>Popup Window</title>
        </head>
        <body style="background-color: ${color};">
        <center>
          <h1 style="font-family: 'Jost';">Your Risk Results</h1>
          ${data.risk_map}
          <br>
          <br>
          <p style="font-family: 'Jost';">In the event of a heatwave, you may be</p>
          <h3 style="font-family: 'Jost';">${data.prediction}</h3>
          ${insight}
          <br>
          
        </center>
        </body>
        </html>
      `;
        const popupWindow = window.open('', '', 'width=600,height=500');
        popupWindow.document.open();
        popupWindow.document.write(htmlContent);
        popupWindow.document.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add an event listener to the form
document.querySelector('form').addEventListener('submit', handleSubmit);
