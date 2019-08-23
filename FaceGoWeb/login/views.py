import json
from . import models
from django.shortcuts import render
from django.shortcuts import render_to_response, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import urllib.request
import urllib.error
import time
import requests

# Create your views here.


def index(request):
    return render(request, 'login/login.html')


def loginCustomer(request):
    return render_to_response('login/login_customer.html')


def loginStaff(request):
    return render_to_response('login/login_staff.html')


@csrf_exempt
def faceUpload(request):
    # print('face upload call')
    if request.method == 'POST':
        img = request.FILES.get('file_obj')
        # path = './1.jpg'
        # # django 提供的chunks方法
        # from django.core.files.uploadedfile import InMemoryUploadedFile
        # with open(path, 'wb') as f:
        #     for chunk in img.chunks():
        #         f.write(chunk)
        url = 'https://api-cn.faceplusplus.com/facepp/v3/search'
        data = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url, data=data, files={'image_file': img})
        res_str = json.dumps(response.json())
        print(res_str)
        data = response.json()
        if len(data['faces']) != 0:
            request.session['face_token'] = data['faces'][0]['face_token']
        return HttpResponse(res_str)
    else:
        return HttpResponse('无图片')

def faceRegister(request):
    print('faceRegister call')
    if request.method == 'POST':
        img = request.FILES.get('file_obj')

        url_detect = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
        data_detect = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
        }
        response = requests.post(url=url_detect, data=data_detect, files={'image_file': img})
        face_token = response.json()['faces'][0]['face_token']
        print(face_token)

        url_addface = 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface'
        data_addface = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'face_tokens': face_token,
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url_addface, data=data_addface)

        customer = models.Customer(customer_token=face_token)
        customer.save()
        print(customer.id)
        print(customer.customer_token)

        print(request.session['face_token'])
        request.session['face_token'] = face_token

        return render(request, 'customer/customer.html', {'face_token': face_token})






