#!/bin/bash

# turn on bash's job control
set -m

# Start the primary process and put it in the background
echo "Starting express server"
cd app && node build/bundle.js &


# Start the helper process
echo "Starting asgi server"
cd ../django && daphne -b 0.0.0.0 -p 8000 CrowdAlert.asgi:application

# now we bring the primary process back into the foreground
# and leave it there
fg %1