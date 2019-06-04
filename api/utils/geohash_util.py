import math
import re
import numbers

"""
Default geohash length
"""
g_GEOHASH_PRECISION = 10

"""
Characters used in location geohashes
"""
g_BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz"

"""
The meridional circumference of the earth in meters
"""
g_EARTH_MERI_CIRCUMFERENCE = 40007860

"""
Length of a degree latitude at the equator
"""
g_METERS_PER_DEGREE_LATITUDE = 110574

"""
Number of bits per geohash character
"""
g_BITS_PER_CHAR = 5

"""
Maximum length of a geohash in bits
"""
g_MAXIMUM_BITS_PRECISION = 22 * g_BITS_PER_CHAR

"""
Equatorial radius of the earth in meters
"""
g_EARTH_EQ_RADIUS = 6378137.0

"""
The following value assumes a polar radius of g_EARTH_POL_RADIUS = 6356752.3
The formulate to calculate g_E2 is g_E2 == (g_EARTH_EQ_RADIUS^2-g_EARTH_POL_RADIUS^2)/(g_EARTH_EQ_RADIUS^2)
The exact value is used here to avoid rounding errors.
"""
g_E2 = 0.00669447819799

"""
Cutoff for rounding errors on double calculations
"""
g_EPSILON = 1 ** -12


def log2(x):
    return math.log2(x)


def validate_key(key):
    """
    Validates the inputted key and throws an error if it is invalid.
    :param key: {string} The key to be verified.
    """
    error = None
    if not isinstance(key, str):
        error = "key must be a string"
    elif len(key) == 0:
        error = "key cannot be empty"
    elif 1 + g_GEOHASH_PRECISION + len(key) > 755:
        # Firebase can only stored child paths up to 768 characters
        # The child path for this key is at the least: "i/<geohash>key"
        error = "key is too long to be stored in Firebase"
    elif re.match(r'[\[\].#$\/\u0000-\u001F\u007F]', key):
        # Firebase does not allow node keys to contain the following characters
        error = "key cannot contain any of the following characters: . # $ ] [ /"

    if error is not None:
        raise Exception("Invalid location '" + str(key) + "' : " + error)


def validate_location(location):
    """
    Validates the inputted location and throws an error if it is invalid.
    :param location: dictionary of latitude and longitude
    :return: None
    """
    error = None
    try:
        latitude = location[0]
        longitude = location[1]
        if (not isinstance(latitude, float)) or math.isnan(latitude):
            error = "latitude must be a number"
        elif latitude < -90 or latitude > 90:
            error = "latitude must be within the range [-90, 90]"
        elif (not isinstance(longitude, float)) or math.isnan(longitude):
            error = "longitude must be a number"
        elif longitude < -180 or longitude > 180:
            error = "longitude must be within the range [-180, 180]"

    except KeyError:
        error = "Expected a dictionary with latitude and longitude"

    if error is not None:
        raise Exception("Invalid location '" + str(location) + "' : " + error)


def validate_geohash(geohash):
    """
    Validates the inputted geohash and throws an error if it is invalid.
    :param geohash: The geohash to be validated.
    :return:
    """
    error = None
    if not isinstance(geohash, str):
        error = "geohash must be a string"
    elif len(geohash) == 0:
        error = "geohash cannot be an empty string"
    else:
        for char in geohash:
            if g_BASE32.find(char) == -1:
                error = "geohash cannot contain '" + char + "'"

    if error is not None:
        raise Exception("Invalid geohash '" + str(geohash) + "' : " + error )


def validate_criteria(new_query_criteria, require_center_and_radius):
    """
    Validates the inputted query criteria and throws an error if it is invalid.
    :param {dict} new_query_criteria: The criteria which specifies the query's center and/or radius.
    :param {Bool} require_center_and_radius:
    :return:
    """
    if not isinstance(new_query_criteria, dict):
        raise Exception("query criterion must be a dictionary")
    elif new_query_criteria.get("center", False) or new_query_criteria.get("radius", False):
        raise Exception("radius and/or center must be specified")
    elif require_center_and_radius and (new_query_criteria.get("center", False) or new_query_criteria.get("radius", False)):
        raise Exception("query criteria for a new query must contain both a center and a radius")

    # Throw error if there are extraneous keys
    for key in new_query_criteria.keys():
        if key != "center" or key != "radius":
            raise Exception("Unexpected attribute '" + key + "'' found in query criteria")

    if new_query_criteria['center'] is not None:
        validate_location(new_query_criteria['center'])

    if new_query_criteria['radius'] is not None:
        if not isinstance(new_query_criteria['radius'], numbers.Number) and math.isnan(new_query_criteria['radius']):
            raise Exception("radius must be a number")
        elif new_query_criteria['radius'] < 0:
            raise Exception("radius must be >= 0")


def encode(location, precision=g_GEOHASH_PRECISION):
    """
    Encode a position given in float arguments latitude, longitude to
    a geohash which will have the character count precision.
    :param location: The [latitude, longitude] pair to encode into a geohash.
    :param precision: The length of the geohash to create. If no precision is specified, the global default is used.
    :return: The geohash of the inputted location.
    """
    latitude = location[0]
    longitude = location[1]
    lat_interval, lon_interval = (-90.0, 90.0), (-180.0, 180.0)
    geohash = []
    bits = [16, 8, 4, 2, 1]
    bit = 0
    ch = 0
    even = True
    while len(geohash) < precision:
        if even:
            mid = (lon_interval[0] + lon_interval[1]) / 2
            if longitude > mid:
                ch |= bits[bit]
                lon_interval = (mid, lon_interval[1])
            else:
                lon_interval = (lon_interval[0], mid)
        else:
            mid = (lat_interval[0] + lat_interval[1]) / 2
            if latitude > mid:
                ch |= bits[bit]
                lat_interval = (mid, lat_interval[1])
            else:
                lat_interval = (lat_interval[0], mid)
        even = not even
        if bit < 4:
            bit += 1
        else:
            geohash += g_BASE32[ch]
            bit = 0
            ch = 0
    return ''.join(geohash)


def meters_to_longitude_degrees(distance, latitude):
    """
    Calculates the number of degrees a given distance is at a given latitude.
    :param distance: The distance to convert.
    :param latitude: The latitude at which to calculate.
    :return: The number of degrees the distance corresponds to.
    """
    radians = math.radians(latitude)
    num = math.cos(radians) * g_EARTH_EQ_RADIUS * math.pi / 180.0
    denom = 1 / math.sqrt(1 - g_E2 * math.sin(radians) * math.sin(radians))
    delta_deg = num * denom
    if delta_deg < g_EPSILON:
        return 360 if distance > 0 else 0
    else:
        return min(360, distance / delta_deg)


def longitude_bits_for_resolution(resolution, latitude):
    """
    Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a given latitude.
    :param resolution: The desired resolution.
    :param latitude: The latitude used in the conversion.
    :return: The bits necessary to reach a given resolution, in meters.
    """
    degs = meters_to_longitude_degrees(resolution, latitude)
    # print(degs)
    return max(1.0, math.log2(360.0 / degs)) if math.fabs(degs) > 0.000001 else 1


def latitude_bits_for_resolution(resolution):
    """
    Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
    :param resolution: The bits necessary to reach a given resolution, in meters.
    :return:
    """
    return min(math.log(g_EARTH_MERI_CIRCUMFERENCE / 2 / resolution), g_MAXIMUM_BITS_PRECISION)


def wrap_longitude(longitude):
    """
    Wraps the longitude to [-180,180].
    :param longitude: longitude The longitude to wrap.
    :return: longitude The resulting longitude.
    """
    if 180 >= longitude >= -180:
        return longitude

    adjusted = longitude + 180
    if adjusted > 0:
        return (adjusted % 360) - 180
    else:
        return 180 - (-adjusted % 360)


def bounding_box_bits(coordinate, size):
    """
    Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a given size at the given coordinate.
    :param coordinate: coordinate The coordinate as a [latitude, longitude] pair.
    :param size: The size of the bounding box.
    :return: The number of bits necessary for the geohash.
    """
    lat_delta_degress = size / g_METERS_PER_DEGREE_LATITUDE
    latitude_north = min(90.0, coordinate[0] + lat_delta_degress)
    latitude_south = max(-90.0, coordinate[0] - lat_delta_degress)
    bits_lat = math.floor(latitude_bits_for_resolution(size)) * 2
    bits_long_north = math.floor(longitude_bits_for_resolution(size, latitude_north)) * 2 - 1
    bits_long_south = math.floor(longitude_bits_for_resolution(size, latitude_south)) * 2 - 1
    return min(bits_lat, bits_long_north, bits_long_south, g_MAXIMUM_BITS_PRECISION)


def bounding_box_coordinates(center, radius):
    """
    Calculates eight points on the bounding box and the center of a given circle. At least one
    geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
    to be prefixes of any geohash that lies within the circle.
    :param center: The center given as [latitude, longitude].
    :param radius: The radius of the circle.
    :return: The eight bounding box points.
    """
    lat_degrees = radius / g_METERS_PER_DEGREE_LATITUDE
    latitude_north = min(90.0, center[0] + lat_degrees)
    latitude_south = max(-90.0, center[0] - lat_degrees)
    long_degs_north = meters_to_longitude_degrees(radius, latitude_north)
    long_degs_south = meters_to_longitude_degrees(radius, latitude_south)
    long_degs = max(long_degs_north, long_degs_south)
    return [
        [center[0], center[1]],
        [center[0], wrap_longitude(center[1] - long_degs)],
        [center[0], wrap_longitude(center[1] + long_degs)],
        [latitude_north, center[1]],
        [latitude_north, wrap_longitude(center[1] - long_degs)],
        [latitude_north, wrap_longitude(center[1] + long_degs)],
        [latitude_south, center[1]],
        [latitude_south, wrap_longitude(center[1] - long_degs)],
        [latitude_south, wrap_longitude(center[1] + long_degs)]
    ]


def geohash_query(geohash, bits):
    """
    Calculates the bounding box query for a geohash with x bits precision.
    :param geohash: The geohash whose bounding box query to generate.
    :param bits: The number of bits of precision.
    :return: A [start, end] pair of geohashes.
    """
    validate_geohash(geohash)
    precision = math.ceil(bits/g_BITS_PER_CHAR)
    if len(geohash) < precision:
        print("geohash.length < precision: " + len(geohash) + " < " + precision + " bits= " + bits + " g_BITS_PER_CHAR= "
              + g_BITS_PER_CHAR)
        return [geohash, geohash + "~"]

    geohash = geohash[0:precision]
    base = geohash[0: len(geohash) - 1]
    last_value = g_BASE32.index(geohash[-1])
    significant_bits = bits - (len(base) * g_BITS_PER_CHAR)
    unused_bits = g_BITS_PER_CHAR - significant_bits

    start_value = (last_value >> unused_bits) << unused_bits
    end_value = start_value + (1 << unused_bits)
    if end_value >= len(g_BASE32):
        print("endValue > 31: endValue=" + str(end_value) + " < " + str(precision) + " bits=" + str(bits) + " g_BITS_PER_CHAR="
              + str(g_BITS_PER_CHAR))
        return [base + g_BASE32[start_value], base + "~"]
    else:
        return [base + g_BASE32[start_value], base + g_BASE32[end_value]]


def geohash_queries(center, radius):
    """
    Calculates a set of queries to fully contain a given circle. A query is a [start, end] pair
    where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
    :param center: The center given as [latitude, longitude] pair.
    :param radius: The radius of the circle.
    :return:  An array of geohashes containing a [start, end] pair.
    """
    validate_location(center)
    query_bits = max(1, bounding_box_bits(center, radius))
    # print("query bits =", query_bits)
    geohash_precision = math.ceil(query_bits / g_BITS_PER_CHAR)
    coordinates = bounding_box_coordinates(center, radius)
    queries = map(lambda coordinate: geohash_query(encode(coordinate, geohash_precision), query_bits), coordinates)
    # print("queries=", queries)

    filtered_queries = []
    for idx, query in enumerate(queries):
        if not any(idx > other_idx and query[0] == other[0] and query[1] == other[1] for (other_idx, other) in enumerate(queries)):
            filtered_queries.append(query)

    print("filtered queries=", filtered_queries)
    return filtered_queries




