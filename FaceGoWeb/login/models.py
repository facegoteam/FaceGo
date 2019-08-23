from django.db import models

# Create your models here.


class Customer(models.Model):
    customer_token = models.CharField(max_length=50)

    def __str__(self):
        return self.customer_token

