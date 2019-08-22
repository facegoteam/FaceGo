from django.shortcuts import render
from django.shortcuts import render_to_response, HttpResponse
from django.views.decorators.csrf import csrf_exempt

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
def save(request):
    if request.method == 'POST':
        img = request.FILES.get('file_obj')
        path = './1.jpg'
        # 读取文件形式
        # with open(path, 'wb') as f:
        #     for i in img:
        #         f.write(i)
        # django 提供的chunks方法
        from django.core.files.uploadedfile import InMemoryUploadedFile
        with open(path, 'wb') as f:
            for chunk in img.chunks():
                f.write(chunk)
        return HttpResponse('ok')

    else:
        return HttpResponse('无图片')