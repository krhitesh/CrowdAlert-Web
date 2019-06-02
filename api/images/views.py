""" Django Views for the api app Images
"""
import subprocess
from threading import Thread
import os
from uuid import uuid4
import base64
import time
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseRedirect
from rest_framework.views import APIView
from .models import Image

STORAGE = settings.FIREBASE.storage()
DB = settings.FIREBASE.database()
db = settings.FIRESTORE

class ImagesView(APIView):
    """ Images class for API view. Allows users to get urls of an image using
    uuid & upload images to cloud storage by specifying either file object
    or base64 equivalent.
    """

    def get(self, request):
        """Allow users to get the corresponding image url for a given image 
        uuid specified as a GET parameter.

        GET request parameters:
            uuid: uuid of the image whose urls are to be fetched. [Required]
            mode: type of image, either of image or thumbnail
        
        Arguments:
            request {[type]} -- [ Contains the django request object]
        Returns:
            [HttpResponseBadRequest] -- [If  no uuid GET parameter is provided]
            [JsonResponse] -- [Containing the url & thumbnail url of image]

        """
        uuid = request.GET.get('uuid','')
        mode = request.GET.get('mode', 'image')
        if uuid == '':
            return HttpResponseBadRequest("Bad request: Specify the image uuid")

        if mode == 'image':
            url = STORAGE.child('images').child(uuid).get_url('')
        elif mode == 'thumbnail':
            url = STORAGE.child('thumbnails').child(uuid.split('.')[0]+'.svg').get_url('')
        return HttpResponseRedirect(url)

    def post(self, request):
        """ Allow users to post images i.e upload images to cloud storage.

        POST request parameters:
            [REQUIRED]
            image: containing a file object for the image to be uploaded
                or
            base64: containig the base64 equivalent of the image to be uploaded

            [OPTIONAL]
            eventId: containg the event id of the event where the image will be
                    rendered
            isTrusted: whether the image came from a trusted source or not


        Arguments:
            request {[type]} -- [ Contains the django request object]
        Returns:
            [HttpResponseBadRequest] -- [If  neither image or base64 parameter 
                                        is provided]
            [JsonResponse] -- [Containing the uuid of image]     
        """
        print("Request Recieved", time.time())
        # Generate uuid for the file. Never trust user.
        image = Image(name=str(uuid4()))
        print()
        if request.FILES.get('image', False):
            uploaded_file = request.FILES['image']
            file_system = FileSystemStorage()
            # save
            file_system.save(image.name, uploaded_file)
            image.uuid = image.name + '.' + uploaded_file.name.split('.')[-1]

        elif request.POST.get('base64', False):
            data_uri = request.POST['base64']
            # name = str(uuid4())
            # NOTE: decodestring is deprecated
            img = base64.decodestring(str.encode(data_uri.split(",")[1]))

            with open(image.name, "wb") as image_file:
                image_file.write(img)
            image.uuid = image.name + '.jpg'
        else:
            return HttpResponseBadRequest("Bad request: base64 or image field should be given")
        print("File Saved", time.time())

        image.create_thumbnail(storage=STORAGE)
        # Upload files to Cloud storage
        image.put(storage=STORAGE)
        
        # Update Event if id is given,
        if request.POST.get("eventId", False):
            event_id = request.POST.get("eventId", False)
            is_trusted = request.POST.get('isValid', '') == 'true'
            image.is_trusted = is_trusted
            image.save(event_id, db)
            # DB.child('incidents').child(event_id).child("images").push(image_data)
            print("Image Added")
        # Return file id for future reference
        print("Returning From Request", time.time())
        return JsonResponse({'name': image.uuid})
