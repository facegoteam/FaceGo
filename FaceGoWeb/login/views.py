import json

from django.shortcuts import render
from django.shortcuts import render_to_response, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import urllib.request
import urllib.error
import time
import requests

# Create your views here.


def index(request):
    return render_to_response('login/login.html')


def loginCustomer(request):
    return render_to_response('login/login_customer.html')


def loginCashier(request):
    return render_to_response('login/login_cashier.html')


def loginAdmin(request):
    return render_to_response('login/login_admin.html')


@csrf_exempt
def faceUpload(request):
    print('face upload call')
    if request.method == 'POST':
        img = request.FILES.get('file_obj')
        path = './1.jpg'
        # django 提供的chunks方法
        from django.core.files.uploadedfile import InMemoryUploadedFile
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
        return HttpResponse(res_str)
    else:
        return HttpResponse('无图片')
