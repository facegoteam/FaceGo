from django.conf.urls import url

from . import views

urlpatterns = [
    url('login_customer/$', views.loginCustomer, name='login_customer'),
    url('login_cashier/$', views.loginCashier, name='login_cashier'),
    url('login_admin/$', views.loginAdmin, name='login_admin'),
    url('face_upload/$', views.faceUpload, name='upload'),
    url(r'^$', views.index),
]