FROM nikolaik/python-nodejs:python3.6-nodejs10

#############################################################################
# Python: Install updates, build files, dependencies, finally cleanup

WORKDIR /django

ADD requirements.txt /django

RUN  apt-get update && \
    apt-get install -y \
        build-essential \
        make \
        gcc \
        locales \
        libgdal20 libgdal-dev && \
    python -m pip install -r /django/requirements.txt && \
    rm -r /root/.cache/pip && \
    apt-get remove -y --purge libgdal-dev make gcc build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

#############################################################################
# NodeJS: Install dependencies, copy files and build production environment

WORKDIR /app

COPY package.json /app

RUN npm install && \
    npm cache clean --force

#############################################################################

ENV REACT_APP_GOOGLE_MAPS_KEY=
ENV REACT_APP_FACEBOOK_APP_ID=
ENV REACT_APP_FIREBASE_API_KEY=
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=
ENV REACT_APP_FIREBASE_DATABASE_URL=
ENV REACT_APP_FIREBASE_PROJECT_ID=
ENV REACT_APP_FIREBASE_SENDER_ID=

ENV DJANGO_FIREBASE_FCM_SENDER_TOKEN=
ENV DJANGO_FIREBASE_type=
ENV DJANGO_FIREBASE_project_id=
ENV DJANGO_FIREBASE_private_key_id=
ENV DJANGO_FIREBASE_private_key=
ENV DJANGO_FIREBASE_client_email=
ENV DJANGO_FIREBASE_client_id=
ENV DJANGO_FIREBASE_auth_uri=
ENV DJANGO_FIREBASE_token_uri=
ENV DJANGO_FIREBASE_auth_provider_x509_cert_url=
ENV DJANGO_FIREBASE_client_x509_cert_url=

#############################################################################
# Copy files

WORKDIR /app

COPY public /app/public
COPY src /app/src
COPY *.js /app/

RUN npm run-script build

WORKDIR /django

COPY api /django/api
COPY CrowdAlert /django/CrowdAlert
COPY staticfiles /django/staticfiles
COPY manage.py /django

#############################################################################
# Set port, expose it, change working directory and execute the boot script

ENV PORT=$PORT

EXPOSE $PORT

WORKDIR /

COPY bootWrapper.sh /

CMD chmod +x bootWrapper.sh && ./bootWrapper.sh