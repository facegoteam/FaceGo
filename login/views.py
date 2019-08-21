from django.shortcuts import render
from django.shortcuts import render_to_response

# Create your views here.
def index(request):
    return render_to_response('login/login.html')

def loginCustomer(request):
    return render_to_response('login/login_customer.html')

def loginCashier(request):
    return render_to_response('login/login_cashier.html')

def loginAdmin(request):
    return render_to_response('login/login_admin.html')