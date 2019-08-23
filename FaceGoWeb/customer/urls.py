from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^customer_good/$', views.customerGood, name='customer_good'),
    url(r'^customer_recommend/$', views.customerRecommend, name='customer_recommend'),
    url(r'^$', views.customer),
]