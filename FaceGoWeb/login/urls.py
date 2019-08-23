from django.conf.urls import url

from . import views

urlpatterns = [
    url('login_customer/$', views.loginCustomer, name='login_customer'),
    url('login_staff/$', views.loginStaff, name='login_staff'),
    url('face_upload/$', views.faceUpload, name='upload'),
    url('face_register/$', views.faceRegister, name='register'),
    url(r'^$', views.index),
]