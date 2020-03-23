# CrowdAlert Web

Crowdalert lets you to share events across the globe.

## API keys

Run this in the project root directory

```bash
echo "\
REACT_APP_GOOGLE_MAPS_KEY=\

REACT_APP_FACEBOOK_APP_ID=\

REACT_APP_FIREBASE_API_KEY=\

REACT_APP_FIREBASE_AUTH_DOMAIN=\

REACT_APP_FIREBASE_DATABASE_URL=\

REACT_APP_FIREBASE_PROJECT_ID=\

REACT_APP_FIREBASE_SENDER_ID=\

DJANGO_FIREBASE_FCM_SENDER_TOKEN=\

DJANGO_FIREBASE_type=\

DJANGO_FIREBASE_project_id=\

DJANGO_FIREBASE_private_key_id=\

DJANGO_FIREBASE_private_key=\

DJANGO_FIREBASE_client_email=\

DJANGO_FIREBASE_client_id=\

DJANGO_FIREBASE_auth_uri=\

DJANGO_FIREBASE_token_uri=\

DJANGO_FIREBASE_auth_provider_x509_cert_url=\

DJANGO_FIREBASE_client_x509_cert_url=\
" > .env.local
```

Update the file with your own keys

## Development Server Setup

Make sure python version 3.6.x is installed.

```bash
# Step 1: Create a virtual env
virtualenv env --python=python3.6

# Step 2: Activate the env
. env/bin/activate

# Step 3: Add the following line in requirements.txt
coverage==3.6

# Step 3.1: Install the packages
pip install -r requirements.txt

# Step 4: Export keys
source .env.local

# Step 5: Run server
python manage.py runserver

```
Note: Ignore the warning `You have 14 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions. Run 'python manage.py migrate' to apply them.` since CrowdAlert-Web does not uses Django's built-in ORM.

## Client Setup

Make sure a recent version of `npm` and `yarn` are installed.

```bash
# Step 1: Install dependencies
yarn # or prepend sudo

# Step 2: Export keys and port
source .env.local
export PORT=8000 # SSR port

# Step 3: Run server
yarn dev # For development server
yarn prod # For production server

```
Note: Make sure to double check `DOMAIN_NAME`, `DOMAIN_NAME_TO_PROXY`, `websocketURL` and `WS_NAME_TO_PROXY` in `src/client/utils/apiPaths.js` while running server locally or during deployment.

## Preview

Visit http://localhost:$PORT where PORT is what you exported during client side setup.

## Deploying
Heroku limits application purge size to 500MB for a single dyno except when you containerize your application. So, in order to avoid any overhead costs, docker is used to containerize both frontend and backend into same image only exposing frontend’s host and port to public.

```bash
# Step 1: Copy your API keys to Dockerfile

# Step 2: Build docker image with tag
docker build . -t caweb
```

See https://devcenter.heroku.com/categories/deploying-with-docker for more details.
