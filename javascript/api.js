

var x2js = new X2JS();

class WrongCountry extends Error {}
class ServerError extends Error {}
class UnexpectedError extends Error {}

class Meteoalert {
  constructor(country, province, language = 'en-GB') {
    this.country = country.toLowerCase();
    this.province = province;
    this.language = language;
    this.endpoint = `https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-${this.country}`;
    console.log(this.country,this.province, this.language, this.endpoint)
  }

  async getAlert() {
    console.log("hello world")
    try {
      const response = await fetch(this.endpoint, { headers: { "Content-Type": "application/json" }});
      this.checkStatusCode(response.status);
      const xmlString = await response.text();
      const feedData = x2js.xml_str2json(xmlString);
      console.log(feedData);
      const feed = feedData.feed || {};
      const entries = feed.entry || [];
      if (entries.length > 0){
        // console.log(entries[0])
        console.log(entries[0]['certainty'])
        console.log(entries[0]['severity'])
        console.log(entries[0]['urgency'])
        console.log(entries[0]['sent'])
        console.log(entries[0]['expires'])
        console.log(entries[0]['title'])

        myVariable = "on"+entries[0]['sent']+"a"+entries[0]['title']+" warning has been issued for" + country + "with an urgensy of"+entries[0]['urgency']+ "and severity of"+ entries[0]['severity']+"this alert shall expire on"+ entries[0]['expires']
        if (myVariable.includes('a')) {
          var box = document.getElementById("myBox");
          box.textContent = myVariable; // Display the variable content in the box
          box.style.display = "block"; // Show the box
        }
      }
      
    } catch (err) {
      throw new UnexpectedError(err.message);
    }
  }

  checkStatusCode(statusCode) {
    if (statusCode === 404) {
      throw new WrongCountry('Apparently unsupported country name was specified');
    } else if (statusCode >= 500) {
      throw new ServerError(`Server error - status code: ${statusCode}`);
    } else if (statusCode !== 200) {
      throw new UnexpectedError(`Server returned unexpected status code: ${statusCode}`);
    }
  }
}

// Example usage:
const meteoalert = new Meteoalert('Germany', 'Kreis Bad Kissingen');
meteoalert.getAlert()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });


// Example usage:

function apifunction() {
  console.log("Hello world")
  const meteoalert = new Meteoalert('North Macedonia', 'Eastern region');
  meteoalert.getAlert()
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}


// const button2 = document.getElementById('lebanonButton');
// const button1 = document.getElementById('syriaButton');
// // Event listeners
// button1.addEventListener('click', apifunction);
// button2.addEventListener('click', apifunction);

