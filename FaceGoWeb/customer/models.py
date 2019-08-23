from django.db import models

# Create your models here.

# 类名：Goods
# 创建时间：08-23
# 作者：黄文政
# 简要说明：商品模型字段
# 修改日期：08-23
class Goods:
    name = models.CharField(max_length=30)
    price = models.SmallIntegerField()
    stock = models.SmallIntegerField()
    info = models.CharField(max_length=50)
    picture = models.ImageField()

# 类名：PurchaseRecord
# 创建时间：08-23
# 作者：黄文政
# 简要说明：购买记录模型字段
# 修改日期：08-23
class PurchaseRecord:
    name = models.CharField(max_length=30)
    consumer = models.CharField(max_length=50)
    date = models.DateField()
    number = models.SmallIntegerField()