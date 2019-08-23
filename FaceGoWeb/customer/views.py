from django.shortcuts import render, render_to_response

# Create your views here.

def customer(request):
    return render_to_response('customer/customer.html')

def customerGood(request):
    print(request.session['face_token'])
    return render_to_response('customer/customer_goods.html')

def customerRecommend(request):
    return render_to_response('customer/customer_recommend.html')