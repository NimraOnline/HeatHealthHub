from flask import Flask, jsonify, request#, render_template, 
from flask_cors import CORS
import requests
import joblib
import io
import base64
from seaborn import color_palette, heatmap
import matplotlib
from matplotlib import pyplot as plt
matplotlib.use("Agg")
import numpy as np
import sklearn

app = Flask(__name__)

# Specify the allowed origins, including your website and its subdomains
allowed_origins = [
    "https://nimraonline.github.io/HeatHealthHub/Lebanon.html",  # Replace with your website URL
    "https://nimraonline.github.io/HeatHealthHub/Syria.html",
    "https://nimraonline.github.io"
]

CORS(app, resources={r"/process_form": {"origins": allowed_origins}})

def gettemp(city):

  if city == "Damascus":
    api_url = "https://api.open-meteo.com/v1/forecast?latitude=33.5102&longitude=36.2913&daily=apparent_temperature_max&timezone=Africa%2FCairo&forecast_days=3"
  else: #Beirut
    api_url = "https://api.open-meteo.com/v1/forecast?latitude=33.8933&longitude=35.5016&daily=apparent_temperature_max&timezone=Africa%2FCairo&forecast_days=3"
  
  response = requests.get(api_url)
  forecast_data = response.json()

  max_temp = max(forecast_data['daily']['apparent_temperature_max']) #hottest temp for the next 3 days

  return max_temp


def createVisual(hottest, riskscore):
  fig, ax = plt.subplots(figsize=(5,4))
  highest = int(hottest + 5) # +5 because highest temp av = 36.5 and 36.5+5 was recorded as a heatwave in Damascus

  lowest = int(hottest - 5)


  x_labels = [1, 2, 3, 4]
  y_labels = [highest, hottest, lowest]
  risk_matrix = np.array([[(highest+lowest)/2, (((highest+lowest)/2)+((highest+hottest)/2))/2,(highest+hottest)/2, highest],[(hottest+lowest)/2, ((hottest+lowest)/2+hottest)/2, hottest, (hottest+highest)/2], [lowest, (lowest+(lowest+hottest)/2)/2,(lowest+hottest)/2, (lowest+highest)/2]])


  colorscale = {42:'#FF0000', 41:'#FF2200', 40:'#FF4400', 39: '#FF6600', 38:'#FF8800', 37: '#FF9900', 36: '#FFBB00', 35: '#FFCC00', 34: '#FFEE00', 33: '#FFFF00', 32: '#E1FF00', 31: '#C8FF00', 30: '#96FF00', 29: '#75CF7E'}

  high = '#75CF7E'
  low = '#75CF7E'
  for temp,hex in colorscale.items():
    if int(highest) > 42:
      high = colorscale[42]
    if int(lowest) > 42:
      high = colorscale[42]
    if int(highest) == temp:
      high = colorscale[temp]
    if int(lowest) == temp:
      low = colorscale[temp]

  colors = color_palette(f"blend:{low},{high}", as_cmap=True)

  heatmap(risk_matrix, cmap= colors, xticklabels=x_labels, yticklabels=y_labels, cbar=False, ax=ax)

  x_label_to_highlight = riskscore
  if riskscore == 'Low Risk':
    x_index = 0
  if riskscore == 'Moderate Risk':
    x_index = 1
  if riskscore == 'High Risk':
    x_index = 2
  if riskscore == 'Very High Risk':
    x_index = 3

  y_label_to_highlight = hottest 
  y_index = y_labels.index(y_label_to_highlight)


  plt.scatter(x_index+0.5, y_index+0.5, color='black', marker='x', s=100)

  plt.xlabel("Vulnerability Scale")
  plt.ylabel("Temperature (C)")
  plt.yticks(rotation = 0)

  #plt.title(f"Your Heat-Health Risk Chart for the Next 3 Days")

  colors = color_palette(f"blend:#75CF7E,#96FF00,#FFEE00,#FF9900,#FF0000", as_cmap=True)


  cbar = plt.colorbar(matplotlib.cm.ScalarMappable(cmap=colors), label="Risk Level", ax=ax)
  cbar.set_ticklabels(["", "", "Low", "Moderate", 'High', 'Very High'])


  buffer = io.BytesIO()
  plt.savefig(buffer, format='png', transparent=True)
  buffer.seek(0)
  image_data = base64.b64encode(buffer.read()).decode()
  buffer.close()

  return image_data

@app.route('/process_form', methods=['POST'])
def process_form():
    # Get form data from the request
    print("")
    print("")
    request_data = request.get_json()
    print(request_data)
    
    city = request_data[0]
    features = request_data[1:]

    
    temperature = gettemp(city)
    #temperature = 35

    model = joblib.load('model.pkl')
    risk = model.predict([features])

    image = createVisual(temperature, risk)


    prediction = "prediction"
    risk_map = "risk_map"

    result = {
        prediction : risk[0],
        risk_map : f'<img src="data:image/png;base64,{image}" alt="Heatmap">'
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
