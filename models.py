from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import extract, and_, distinct
import pymysql
pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.secret_key = 'super secret key'
#配置数据库地址
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:8008208820@localhost/facego'
app.config['SQLALCHEMY_TRABACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# 模型rate
# 创建时间：2019-09-05
# 作者：黄文政
# 简要说明：存储顾客对商品的评分
class Rate(db.Model):
    __tablename__ = 'rate'  #表名rate
    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    good_id = db.Column(db.Integer)
    total = db.Column(db.Float)
    count = db.Column(db.Integer)
    rate = db.Column(db.Float)


# 模型Behaviour
# 创建时间：2019-09-03
# 作者：黄文政
# 简要说明：用以存储顾客行为
class Behaviour(db.Model):
    __tablename__ = 'behaviour'  #表名behaviour
    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    face_token = db.Column(db.String(50))
    # actions = ['browse', 'addcart', 'buy']
    action = db.Column(db.String(10))
    good_id = db.Column(db.Integer)


# 模型Staff
# 创建时间：2019-08-25
# 作者：姜子玥
# 简要说明：用以存储Staff登陆的相关信息
class Staff(db.Model):
    __tablename__ = 'staff'  #表名staff
    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    staff_name = db.Column(db.String(50))
    staff_id = db.Column(db.String(50), unique=True)
    pwd = db.Column(db.String(50))
    identity = db.Column(db.String(50))
    shop_id = db.Column(db.Integer)


# 模型Goods
# 创建时间：2019-08-26
# 作者：姜子玥
# 简要说明：用以存储商品信息
class Goods(db.Model):
    __tablename__ = 'goods'
    #字段
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    goods_name = db.Column(db.String(50), unique=True)
    goods_type = db.Column(db.String(50))
    goods_count = db.Column(db.Integer)
    goods_price = db.Column(db.Float)
    goods_imag = db.Column(db.String(50))
    goods_info = db.Column(db.Text)


# 模型shop
# 创建时间：2019-08-26
# 作者：姜子玥
# 简要说明：用以存储商店信息
class Shop(db.Model):
    #shop表
    __tablename__ = 'shop'
    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    shop_name = db.Column(db.String(50), unique=True)
    shop_address = db.Column(db.String(50))
    shop_phone = db.Column(db.String(50), unique=True)




# 模型Records
# 创建时间：2019-08-26
# 作者：姜子玥
# 简要说明：用以记录消费信息
class Records(db.Model):
    #records表
    __tablename__ = 'records'
    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    record_goods_count = db.Column(db.Integer())
    record_goods_time = db.Column(db.DateTime)
    face_token = db.Column(db.String(50))
    shop_id = db.Column(db.Integer)
    record_goods_id = db.Column(db.Integer)
    token = db.Column(db.String(50))
    rated = db.Column(db.Integer)



# 模型Cart
# 创建时间：2019-08-26
# 作者：姜子玥
# 简要说明：用以记录购物车信息
class Cart(db.Model):
    #cart表名
    __tablename__ ='cart'

    #字段
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    goods_id = db.Column(db.Integer)
    goods_count = db.Column(db.Integer)
    face_token = db.Column(db.String(50))

# 模型Orders
# 创建时间：2019-08-26
# 作者：姜子玥
# 简要说明：用以记录下单列表
class Orders(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    goods_id = db.Column(db.Integer)
    shop_id = db.Column(db.String(50))
    goods_count = db.Column(db.Integer)
    record_time = db.Column(db.DateTime)
    face_token = db.Column(db.String(50))
    token = db.Column(db.String(50))

db.create_all()

