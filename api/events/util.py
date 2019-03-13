from pygeohash import encode 
from pygeohash import decode


"""
Returns length of geohash required for a given radius
"""
def getPrecisionForRadius(radius):
    if radius < 0.6:
        return 10
    elif radius < 3.71:
        return 9
    elif radius < 19:
        return 8
    elif radius < 118:
        return 7
    elif radius < 610:
        return 6
    elif radius < 3803:
        return 5
    elif radius < 19545:
        return 4
    elif radius < 123264:
        return 3
    elif radius < 625441:
        return 2
    elif radius < 5003530:
        return 1
    else:
        # Pick all incidents
        return 0


"""
Returns a 12 digit GeoHash
"""
def toGeoHash(latitude, longitude):
    return encode(latitude, longitude)


"""
Returns a tuple of LatLng
"""
def fromGeoHash(geohash):
    latLng = decode(geohash)
    return (float(latLng[0]), float(latLng[1]))
