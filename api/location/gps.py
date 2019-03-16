""" Module used to calculate distance between two GPS coordinates
"""

import math

def deg_to_rad(deg):
    """ Converts degree to radian

    Arguments:
        deg {[float]} -- [value of degree]

    Returns:
        [float] -- [the radian value of degree]
    """

    return deg*math.pi/180

def distance(lat1, long1, lat2, long2):
    """ Calculates the distance between two GPS co-ordinates

    Arguments:
        lat1 {float} -- [Latitude of the first coordinate]
        long1 {float} -- [Longitude of the first coordinate]
        lat2 {float} -- [Latitude of the second coordinate]
        long2 {float} -- [Longitude of the second coordinate]

    Returns:
        {float} -- [Distance in KM between the two coordinates]
    """

    radius = 6371

    deg_lat = deg_to_rad(lat2 - lat1)
    deg_lng = deg_to_rad(long2 - long1)

    lat1 = deg_to_rad(lat1)
    lat2 = deg_to_rad(lat2)

    angle = (math.sin(deg_lat/2) * math.sin(deg_lat/2)
             + math.sin(deg_lng/2) * math.sin(deg_lng/2) * math.cos(lat1) * math.cos(lat2))

    return radius * 2 * math.atan2(math.sqrt(angle), math.sqrt(1-angle))
