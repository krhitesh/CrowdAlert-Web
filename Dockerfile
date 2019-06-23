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
    python -m pip install numpy cython --no-binary numpy,cython && \
    python -m pip install \
        "rasterio>=1.0a12" fiona shapely \
        --pre --no-binary rasterio,fiona,shapely && \
    python -m pip install -r /django/requirements.txt && \
    python -m pip uninstall -y cython && \
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

ENV REACT_APP_GOOGLE_MAPS_KEY="AIzaSyCBm-Sx5cvVw5gZAGBgHuHG6uT6YVW-QYI"
ENV REACT_APP_FACEBOOK_APP_ID="426850264414449"
ENV REACT_APP_FIREBASE_API_KEY="AIzaSyDDlyBDh1sArWq4VgfrjsfVqWc37k-QlwE"
ENV REACT_APP_FIREBASE_AUTH_DOMAIN="crowdalert-4fa46.firebaseapp.com"
ENV REACT_APP_FIREBASE_DATABASE_URL="https://crowdalert-4fa46.firebaseio.com"
ENV REACT_APP_FIREBASE_PROJECT_ID="crowdalert-4fa46"
ENV REACT_APP_FIREBASE_SENDER_ID="200720994045"

ENV DJANGO_FIREBASE_FCM_SENDER_TOKEN="AAAALrvnTv0:APA91bEOslaKtHU6C9ZWJUPuQM7fe52TKBz1R5M7eesDFU7ddourUh3sZZS7NWtqqzZOPRJEa_vt7dHyBN2BXx1riieFFT49YBanY35gcu7Penol8GRta3k-YcKlw1yd6FhARVys2dVU"
ENV DJANGO_FIREBASE_type="service_account"
ENV DJANGO_FIREBASE_project_id="crowdalert-4fa46"
ENV DJANGO_FIREBASE_private_key_id="abaf61a5f42b5d68c6454f4e979e434750f693fb"
ENV DJANGO_FIREBASE_private_key="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQskLCbjvO4jqN\nJZIvOEc48ByToEmHmXSFCR7nC59DDGAzOd7aAM+kS1dKWASckcXqBB0hHOh0b9kB\nMKxr08T2OB+lJfLU2eha8kpqbDoaWMjIbg+0q024LnIm3YnJyofBTRzjl/JPqrlK\n/NR+5KuTtpexv9/mArX2SadU0oReJ3RqitBa2QlID7ciDQJwYt2EfSSpheWAuSEU\nZdMnCa+krmCMV9KFY81vGM6dWZDItdd6JM8zGNZIrQEOirxId79DLqe50gA5bpze\n1ZE+0P/9gm4L0RPRjaO1l2M5Nl8TEyci9rC2z36tzVN3ly1VYzgTn5KeCh+qiUjz\nY7lR0eF3AgMBAAECggEADXnElOX+RPC1wkJvAF3N6EQYbTk+z9WfT+p/CcZ/0Rc8\neFjZ49SygdsQaJiU6V38ICS878II9hsaiy1UyYAB9mpYrCFCIcefh6TMAGhO6vg8\nzsnNRaa0iMQulmcId5YYmYyMdbfHddrxAcZVJfI29n1JWGEFwZ6cArFuV4x5jmkb\nY5GHcnXnygbdzrphybEdZ2RwEw6lsIt2iWQMStuTGMA0SiCVr/cmaHqJTHYN7z/C\nvuOy3XFHFuBKIOboXma4z2IZsHUg72GMDmX5XLaV3bZxovzV/wvgj5JxT+I/tLB6\nHwhDEXC78McNY9msCNhQ0XmCyD51TV3Qk1p2Jg0zBQKBgQDHknHjYUQ9/eZPr/cW\nzkgmEvlmj74V/zszB1iWMsxE/H4FdRVsRd39G0RgCjLrBYig1RtERGVrTxd559Wn\nn+CQe+GEaXZky27v6/+GIzP7O4G5omIAEDawqmdM+EIHuYNkX7IEjokOXhK/O1aQ\nDZIIjMhLt217HKR/myUKaPTOQwKBgQC5m8P9euCNzcs069FSXq9RL4twx1pZfaBy\nGBmlRUeW+izUtkrGW9dV6TZxAfMwCUbBzkUMorxfE93WdSkVhsJ1jZy+NR+XTEGX\nhJZXf9wTp/bKn6WFIetG3oSrjsGmL0EVWTLtI8ZJUyXB+nuiGnDgmTgc57E8JOe0\nOCLFHjNevQKBgCslrTvEtrVUZGvMFna2yIB6z7Lt1uH4mXrx1qQ6fVFY6YISizwq\natEjCQhejB2lx6FGEawTwX2OzvuLNPUVqr5yGhK/nloyZVy3wDnm+IETn3tb8SYk\nWz6cyNKqRdRXtmGIEvvLOTSDADiaAqAIXw88KL29/YyFZ8cy6rIyeOLzAoGAXrqJ\nBM253aWymIfihU+d2qmRWTXlftcHFDQIorkBGKUGTGndL++fr1EfX/3GyDVzz2Yf\nB5vm1/+jsNiK51mn1ac44DrsrKNWtqYMtQuknsOSyUdBivkMw1a+D3EElHR5mxOz\nUiR4BuRQ2PemMc2c3oRUhywY4MFVID2mQURwo2ECgYAL1st8IZoo2m7g4WWJX2FW\nkQFFLH8J3+WhiY3nDz8m/kDqSmxu5khcmu//VcMxiIyBCo+sxGQcq+/kK/N7GZbM\njcvQHsMT322+OFVYofL/F7NSceoQiVcUI7IEnX0gvU8sxNvqxSVpJ/e23hnZxS4m\nBu6WFrKCR2tm/9XVZDsiWA==\n-----END PRIVATE KEY-----\n"
ENV DJANGO_FIREBASE_client_email="firebase-adminsdk-4vsm3@crowdalert-4fa46.iam.gserviceaccount.com"
ENV DJANGO_FIREBASE_client_id="104632926806840519831"
ENV DJANGO_FIREBASE_auth_uri="https://accounts.google.com/o/oauth2/auth"
ENV DJANGO_FIREBASE_token_uri="https://accounts.google.com/o/oauth2/token"
ENV DJANGO_FIREBASE_auth_provider_x509_cert_url="https://www.googleapis.com/oauth2/v1/certs"
ENV DJANGO_FIREBASE_client_x509_cert_url="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4vsm3%40crowdalert-4fa46.iam.gserviceaccount.com"

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