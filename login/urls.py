from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^login_customer$', views.loginCustomer),
    url(r'^login_cashier$', views.loginCashier),
    url(r'^login_admin$', views.loginAdmin),
    url(r'^upload$', views.save),
]