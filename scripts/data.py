import pandas as pd
import numpy as np
import math

def get_filtered_data():
    # Paths
    arrivals_data_path = '../data/nakamura_2005_dm_arrivals.csv'
    locations_data_path = '../data/nakamura_2005_dm_locations.csv'

    # Read data
    arrivals_data = pd.read_csv(arrivals_data_path)
    locations_data = pd.read_csv(locations_data_path)

    # Merge data
    arrivals_data = arrivals_data.apply(pd.to_numeric, errors='coerce')
    merged_data = pd.merge(arrivals_data, locations_data, on='A', how='outer')

    return merged_data

def convert_coords_to_3d(lat, long, depth, radius):
    # Convert latitude and longitude from degrees to radians
    lat_rad = math.radians(lat)
    long_rad = math.radians(long)

    # Adjust the radius based on the depth value
    adjusted_radius = radius - depth

    # Convert spherical to Cartesian coordinates
    x = adjusted_radius * math.cos(lat_rad) * math.cos(long_rad)
    y = adjusted_radius * math.cos(lat_rad) * math.sin(long_rad)
    z = adjusted_radius * math.sin(lat_rad)

    return x, y, z

