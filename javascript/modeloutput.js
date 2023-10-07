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
            color = 'rgba(117,207,126,1)';
        }
        if (data.prediction === 'Moderate Risk'){
            color = 'rgba(255,240,113,1)';
        }
        if (data.prediction === 'High Risk'){
            color = 'rgba(255,166,76,1)';
        }
        if (data.prediction === 'Very High Risk'){
            color = '#FF4C4C';
        }
        const htmlContent = `
        <html>
        <link href='https://fonts.googleapis.com/css?family=Jost' rel='stylesheet'>
        <head>
            <style>
                @import "https://unpkg.com/open-props" layer(design.system);
                @import "https://unpkg.com/open-props/normalize.min.css" layer(demo.support);
                
                @layer demo {
                  .rounded-border-gradient {
                    width: 550px;
                    height: 450px;
                    
                    aspect-ratio: var(--ratio-widescreen);
                    border: solid var(--size-2) transparent;
                    border-radius: var(--radius-4);
                    background: 
                      linear-gradient(white, white) padding-box, 
                      var(--gradient-1) border-box;
                    
                  }
                }
                
                @layer demo.support {
                  body {
                    display: absolute;
                    padding: var(--size-5);
                  }
                  .circle {
                    display: inline-block; /* Make it an inline element */
                    width: 20px; /* Set the width and height to create a circle */
                    height: 20px;
                    background-color: ${color}; /* Color of the circle */
                    border-radius: 50%; /* Create a circle shape */
                    margin-right: 10px; /* Add spacing to the right of the circle */
                  }
                }
            </style>
            
          <title>Popup Window</title>
        </head>
        <body>
        <center>
          <h1 style="font-family: 'Jost';">Your Risk Results</h1>
          <br>
           <p style="font-family: 'Jost';">In the event of a heatwave, you may be</p>
          <h3 style="font-family: 'Jost';">${data.prediction} <span class="circle"></span> </h3>
          <hr>
          <h3 style="font-family: 'Jost';"> Your heat-health risk for the next 3 days </h3>
          <div class="rounded-border-gradient" style="padding:5px;">
              ${data.risk_map}
          </div>
          <br>
          <p style="font-size: 10px; font-family: 'Jost';"> 
              This graph displays your risk score in relation to the highest temperature forecasted for the next three days. The horizontal axis represents vulnerability to heatwaves, ranging from low (1) to high (4). The vertical axis represents a temperature range, with the temperature in the middle being the highest forecasted temperature for the next 3 days. Different colors represent varying risk levels. You can reference the Risk Scale on the right of the graph to assess your risk and take precautions accordingly over the next three days.
          </p>
          <hr>
        ${insight}
        </center>
        
        </body>
        </html>
      `;
        const popupWindow = window.open('', '', 'width=600,height=800');
        popupWindow.document.open();
        popupWindow.document.write(htmlContent);
        popupWindow.document.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add an event listener to the form
document.querySelector('form').addEventListener('submit', handleSubmit);