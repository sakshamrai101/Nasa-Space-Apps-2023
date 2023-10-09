from importlib.metadata import requires
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import data

app = Flask(__name__)
CORS(app)

MOON_RADIUS = 1_737_400 # in meters

filtered_data = data.get_filtered_data()

@app.route('/get_data')
def get_data():
    # Convert the dataframe to a list of dictionaries
    data_list = filtered_data.to_dict(orient='records')

    # Create the output data structure
    dataset = []
    for data_point in data_list:
        lat = data_point['Lat']
        long = data_point['Long']
        depth = data_point['Depth']
        values = {col: data_point[col] for col in ['12P', '14P', '15P', '16P', '12S', '14S', '15S', '16S']}
        coords = data.convert_coords_to_3d(lat, long, depth, MOON_RADIUS)
        dataset.append({'lat': lat, 'long': long, 'depth': depth, 'coords': coords, 'values': values})
    
    # Return the data as JSON
    return jsonify(dataset)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
