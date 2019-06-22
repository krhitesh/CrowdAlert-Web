#!/bin/bash

# turn on bash's job control
set -m

# Start the primary process and put it in the background
echo "Starting express server"
cd app && node build/bundle.js &


# Start the helper process
echo "Starting django server"
cd ../django && gunicorn -b 0.0.0.0:8000 CrowdAlert.wsgi

# now we bring the primary process back into the foreground
# and leave it there
fg %1