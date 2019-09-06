import datetime
import random
from functools import wraps
from flask import render_template, request, session, url_for, redirect, send_from_directory
import os
from pandas import DataFrame
import requests
import json
from models import *


'''
函数名：login
创建时间：2019-08-23
作者：黄文政
说明：登录主页
修改日期：2019-08-23
'''
@app.route('/')
def login():
    return render_template('login/login.html')


def login_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        # 从session获取用户信息，如果有，则用户已登录，否则没有登录
        face_token = session.get('face_token')
        print('修饰器函数：')
        print("session face_token:", face_token)
        staff_id = session.get('staff_id')
        print("staff_id:", staff_id)
        print("not face_token", str(not face_token))
        print("not staff_id", str(not staff_id))
        if (not face_token) and (not staff_id):
            # WITHOUT_LOGIN是一个常量
            # print(url_for('login', _external=True))
            # return func(*args, **kwargs)
            return redirect(url_for('login', _external=True))
        else:
            return func(*args, **kwargs)

    return inner


'''
函数名：login_customer
创建时间：2019-08-23
作者：黄文政
说明：顾客登录页面
修改日期：2019-08-23
'''
@app.route('/login_customer')
def login_customer():
    # 如果有'staff_id'的session，则删除
    keys = session.keys()
    for k in list(keys):
        if k == 'staff_id':
            session.pop('staff_id')
            break
    return render_template('login/login_customer.html')


'''
函数名：login_staff
创建时间：2019-08-23
作者：黄文政
说明：管理员/收银员登录页面
修改日期：2019-08-24
'''
@app.route('/login_staff')
def login_staff():
    return render_template('login/login_staff.html')


'''
函数名：face_upload
创建时间：2019-08-24
作者：黄文政
说明：处理上传的人脸，进行登录
修改日期：2019-08-27
'''
@app.route('/face_upload', methods=['GET', 'POST'])
def face_upload():
    # print('face upload call')
    # print(request.json)
    if request.method == 'POST':
        img = request.files.get('file_obj')
        path = './1.jpg'
        # img.save(path)

        url = 'https://api-cn.faceplusplus.com/facepp/v3/search'
        data = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url, data=data, files={'image_file': img})
        res_str = json.dumps(response.json())
        print('faceupload:' + res_str)
        data = response.json()
        if len(data['faces']) != 0:
            # print('confidence:' + str(data['results'][0]['confidence']))
            if data['results'][0]['confidence'] > 80:
                session['face_token'] = data['results'][0]['face_token']
                print(session['face_token'])
                # 如果有'staff_id'的session，则删除
                keys = session.keys()
                for k in list(keys):
                    if k == 'staff_id':
                        session.pop('staff_id')
                        break
        # print('search:'+res_str)
        return res_str
    else:
        return "无图片"


'''
函数名：register
创建时间：2019-08-24
作者：黄文政
说明：获得人脸，注册
修改日期：2019-08-27
'''
@app.route('/register', methods=['GET', 'POST'])
def register():
    print('faceRegister call')
    if request.method == 'POST':
        img = request.files.get('file_obj')

        url_detect = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
        data_detect = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
        }
        response = requests.post(url=url_detect, data=data_detect, files={'image_file': img})
        face_token = response.json()['faces'][0]['face_token']
        print(face_token)

        url_addface = 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface'
        data_addface = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'face_tokens': face_token,
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url_addface, data=data_addface)
        session['face_token'] = face_token
        # 如果有'staff_id'的session，则删除
        keys = session.keys()
        for k in list(keys):
            if k == 'staff_id':
                session.pop('staff_id')
                break

        return face_token
    else:
        return '无图片'


'''
函数名：customer
创建时间：2019-08-25
作者：黄文政
说明：顾客主界面
修改日期：2019-08-25
'''
@app.route('/customer')
@login_required
def customer():
    return render_template('customer/customer.html')


'''
函数名：customer_logout
创建时间：2019-08-25
作者：黄文政
说明：顾客登出
修改日期：2019-08-25
'''
@app.route('/customer_logout')
@login_required
def customer_logout():
    # 如果有'face_token'的session，则删除
    keys = session.keys()
    for k in list(keys):
        if k == 'face_token':
            session.pop('face_token')
            break
    return redirect(url_for('login'))


'''
函数名：customer_ask_for_record
创建时间：2019-08-27
作者：黄文政
说明：顾客查看消费记录
修改日期：2019-08-27
'''
@app.route('/customer_ask_for_record', methods=['POST', 'GET'])
def customer_ask_for_record():
    face_token = ""
    # 小程序
    if request.method == 'POST':
        identity = request.form['identity']
        # print(identity)
        if identity == 'web':
            face_token = session['face_token']
        elif identity == 'wx':
            face_token = request.form['face_token']
        # face_token = '29f2e2a4a2c61f8c5f2abec835b96e4b'
        # 返回图片，名称，单价，数量，购买日期

        print(face_token)
        result = []
        for each in Records.query.filter(Records.face_token == face_token).all():
            goods_id = each.record_goods_id
            good = Goods.query.filter(Goods.id == goods_id).first()
            img = good.goods_imag
            name = good.goods_name
            price = good.goods_price
            count = each.record_goods_count
            time = each.record_goods_time
            token = each.token
            rated = each.rated

            item = {}
            item['img'] = img
            item['name'] = name
            item['price'] = price
            item['count'] = count
            item['time'] = time.strftime('%Y-%m-%d %H:%M:%S')
            item['token'] = token
            item['rated'] = rated
            result.append(item)

        return json.dumps(result.reverse(), ensure_ascii=False)

    # web
    else:
        # face_token = '0ae83ffd1cabed5275dc437ab851f91d'
        face_token = session['face_token']
        result = []
        for each in Records.query.filter(Records.face_token == face_token).all():
            goods_id = each.record_goods_id
            good = Goods.query.filter(Goods.id == goods_id).first()
            img = good.goods_imag
            name = good.goods_name
            price = good.goods_price
            count = each.record_goods_count
            time = each.record_goods_time

            item = {}
            item['img'] = img
            item['name'] = name
            item['price'] = price
            item['count'] = count
            item['time'] = time.strftime('%Y-%m-%d %H:%M:%S')
            result.append(item)
        return "successCallback"+"("+json.dumps(result)+")"


'''
函数名：customer_ask_for_cart
创建时间：2019-08-29
作者：黄文政
说明：顾客查看购物车
修改日期：2019-08-29
'''
@app.route('/customer_ask_for_cart', methods=['GET', 'POST'])
def customer_ask_for_cart():
    # 返回商品商品名称、类别、价格、数量、图片
    if request.method == 'POST':
        face_token = request.form['face_token']
        result = []
        for each in Cart.query.filter(Cart.face_token == face_token).all():
            count = each.goods_count
            good_id = each.goods_id

            good = Goods.query.filter(Goods.id == good_id).first()
            name = good.goods_name
            type = good.goods_type
            price = good.goods_price
            img = good.goods_imag

            item = {'name': name, 'type': type, 'price': price, 'count': count, 'img': img}
            result.append(item)

        return json.dumps(result, ensure_ascii=False)
    else:
        return 'get is not welcomed'


'''
函数名：customer_add_cart
创建时间：2019-08-29
作者：黄文政
说明：顾客添加购物车
修改日期：2019-08-29
'''
@app.route('/customer_add_cart', methods=['GET', 'POST'])
def customer_add_cart():
    # 添加商品到购物车，返回是否添加成功
    if request.method == 'POST':
        face_token = request.form['face_token']
        name = request.form['name']
        count = int(request.form['count'])
        good = Goods.query.filter(Goods.goods_name == name).first()
        good_id = good.id

        # 更新顾客行为表
        behaviour = Behaviour.query.filter(and_(Behaviour.face_token == face_token, Behaviour.good_id == good_id)).first()
        if not behaviour:
            behaviour = Behaviour()
            behaviour.face_token = face_token
            behaviour.action = 'addcart'
            behaviour.good_id = good_id

            db.session.add(behaviour)
            db.session.commit()
        else:
            if behaviour.action == 'browse':
                behaviour.action = 'addcart'

                db.session.add(behaviour)
                db.session.commit()

        # 查重
        repeat = False
        for each in Cart.query.filter(and_(Cart.goods_id == good_id, Cart.face_token == face_token)).all():
            repeat = True

        if repeat:
            cart = Cart.query.filter(and_(Cart.goods_id == good_id, Cart.face_token == face_token)).first()
            cart.goods_count = cart.goods_count + count
            db.session.add(cart)
            db.session.commit()

        else:
            cart = Cart()
            cart.face_token = face_token
            cart.goods_count = count
            cart.goods_id = good_id

            db.session.add(cart)
            db.session.commit()

        return '购物车添加成功'
    else:
        return 'get is not welcomed'


'''
函数名：customer_change_cart
创建时间：2019-08-29
作者：黄文政
说明：顾客修改购物车
修改日期：2019-08-29
'''
@app.route('/customer_change_cart', methods=['GET', 'POST'])
def customer_change_cart():
    # 修改购物车
    if request.method == 'POST':
        face_token = request.form['face_token']
        count = int(request.form['count'])
        name = request.form['name']
        good_id = Goods.query.filter(Goods.goods_name == name).first().id
        print(good_id, face_token, count)

        # 改变数量
        if count != 0:
            cart = Cart.query.filter(and_(Cart.face_token == face_token, Cart.goods_id == good_id)).first()
            cart.goods_count = count
            db.session.add(cart)
            db.session.commit()
        # 删除
        else:
            cart = Cart.query.filter(and_(Cart.face_token == face_token, Cart.goods_id == good_id)).first()
            db.session.delete(cart)
            db.session.commit()

        return '购物车修改成功'
    else:
        return 'get is not welcomed'


'''
函数名：customer_add_order
创建时间：2019-09-01
作者：黄文政
说明：顾客添加订单
修改日期：2019-09-01
'''
@app.route('/customer_add_order', methods=['GET', 'POST'])
def customer_add_order():
    # 添加订单
    if request.method == 'POST':
        data = json.loads(request.get_data())
        print(data)
        face_token = data[0]['face_token']
        shop_name = data[0]['shop']
        time = datetime.datetime.now()
        shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

        # 生成订单号 mmddhhmmss + 两位随机号 + 一位流水号
        token = time.strftime('%m%d%H%M%S')
        token = token + str(random.randint(0, 100)).zfill(2)
        sum = 0
        for each in Records.query.filter(Records.token.contains(token)).all():
            sum = sum + 1
        token = token + str(sum)
        print(token)

        for each in data[1:]:
            good_name = each['name']
            count = int(each['count'])
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id

            # 更新顾客行为表
            behaviour = Behaviour.query.filter(
                and_(Behaviour.face_token == face_token, Behaviour.good_id == good_id)).first()
            if not behaviour:
                behaviour = Behaviour()
                behaviour.face_token = face_token
                behaviour.action = 'buy'
                behaviour.good_id = good_id

                db.session.add(behaviour)
                db.session.commit()
            else:
                if behaviour.action != 'buy':
                    behaviour.action = 'buy'

                    db.session.add(behaviour)
                    db.session.commit()

            # 从购物车中删除
            cart = Cart.query.filter(and_(Cart.goods_count == count, Cart.face_token == face_token, Cart.goods_id == good_id)).first()
            db.session.delete(cart)

            # 添加到订单中
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id
            order = Orders()
            order.goods_id = good_id
            order.shop_id = shop_id
            order.goods_count = count
            order.record_time = time
            order.face_token = face_token
            order.token = token

            print(good_id, shop_id, count, time, face_token, token)

            db.session.add(order)
            db.session.commit()

        return token
    else:
        return 'get is not welcomed'


'''
函数名：customer_add_order_from_detail
创建时间：2019-09-03
作者：黄文政
说明：顾客从商品详情直接下单
修改日期：2019-09-03
'''
@app.route('/customer_add_order_from_detail', methods=['GET', 'POST'])
def customer_add_order_from_detail():
    # 添加订单
    if request.method == 'POST':
        data = json.loads(request.get_data())
        print(data)
        face_token = data[0]['face_token']
        shop_name = data[0]['shop']
        time = datetime.datetime.now()
        shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

        # 生成订单号 mmddhhMMss + 两位随机号 + 一位流水号
        token = time.strftime('%m%d%H%M%S')
        token = token + str(random.randint(0, 100)).zfill(2)
        sum = 0
        for each in Records.query.filter(Records.token.contains(token)).all():
            sum = sum + 1
        token = token + str(sum)
        # print(token)

        for each in data[1:]:
            good_name = each['name']
            count = int(each['count'])
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id

            # 更新顾客行为表
            behaviour = Behaviour.query.filter(
                and_(Behaviour.face_token == face_token, Behaviour.good_id == good_id)).first()
            if not behaviour:
                behaviour = Behaviour()
                behaviour.face_token = face_token
                behaviour.action = 'buy'
                behaviour.good_id = good_id

                db.session.add(behaviour)
                db.session.commit()
            else:
                if behaviour.action != 'buy':
                    behaviour.action = 'buy'

                    db.session.add(behaviour)
                    db.session.commit()

            # 添加到订单中
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id
            order = Orders()
            order.goods_id = good_id
            order.shop_id = shop_id
            order.goods_count = count
            order.record_time = time
            order.face_token = face_token
            order.token = token

            print(good_id, shop_id, count, time, face_token, token)

            db.session.add(order)
            db.session.commit()

        return token
    else:
        return 'get is not welcomed'


'''
函数名：customer_ask_for_good
创建时间：2019-08-27
作者：黄文政
说明：顾客查看商品列表
修改日期：2019-08-27
'''
@app.route('/customer_ask_for_good', methods=['GET', 'POST'])
def customer_ask_for_good():
    # 返回商品名称，商品价格，商品图片url
    good_type = ""
    if request.method == 'POST':
        good_type = request.form['type']
        print(good_type)
    else:
        good_type = '食品'
    result = []
    for each in Goods.query.filter(Goods.goods_type == good_type).all():
        name = each.goods_name
        price = each.goods_price
        img = each.goods_imag

        item = {}
        item['name'] = name
        item['price'] = price
        item['img'] = img

        result.append(item)

    # print(result)
    return json.dumps(result, ensure_ascii=False)


'''
函数名：customer_search_for_good
创建时间：2019-08-30
作者：黄文政
说明：顾客搜索商品
修改日期：2019-08-30
'''
@app.route('/customer_search_for_good', methods=['GET', 'POST'])
def customer_search_for_good():
    if request.method == "POST":
        word = request.form['word']
        result = []
        for each in Goods.query.filter(Goods.goods_name.contains(word)).all():
            good_name = each.goods_name
            price = each.goods_price
            img = each.goods_imag

            item = {'name': good_name, 'price': price, 'img': img}

            result.append(item)
        return json.dumps(result, ensure_ascii=False)
    else:
        return "get is not welcomed!"


'''
函数名：customer_ask_for_type_statics
创建时间：2019-08-30
作者：黄文政
说明：顾客查看类别消费分析
修改日期：2019-08-30
'''
@app.route('/customer_ask_for_type_statics', methods=['GET', 'POST'])
def customer_ask_for_type_statics():
    if request.method == "POST":
        face_token = request.form['face_token']

        result = {'食品': 0, '饮品': 0, '日用品': 0, '书籍杂志': 0}

        for record in Records.query.filter(Records.face_token == face_token).all():
            good_id = record.record_goods_id
            count = record.record_goods_count
            good = Goods.query.filter(Goods.id == good_id).first()
            type = good.goods_type
            price = good.goods_price
            result[type] = result[type] + price * count

        data = []
        data.append({'name': '食品', 'data': result['食品']})
        data.append({'name': '日用品', 'data': result['日用品']})
        data.append({'name': '饮品', 'data': result['饮品']})
        data.append({'name': '书籍杂志', 'data': result['书籍杂志']})
        print(data)
        return json.dumps(data, ensure_ascii=False)
    else:
        return 'get is not welcomed!'


'''
函数名：customer_ask_for_month_statics
创建时间：2019-08-30
作者：黄文政
说明：顾客查看月份消费分析
修改日期：2019-08-30
'''
@app.route('/customer_ask_for_month_statics', methods=['GET', 'POST'])
def customer_ask_for_month_statics():
    if request.method == "POST":
        face_token = request.form['face_token']
        result = {}
        temp = {}
        month = int(datetime.datetime.now().strftime('%m'))
        year = int(datetime.datetime.now().strftime('%Y'))
        all_months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        result['categories'] = all_months[month-6:month]
        result['data'] = []
        for i in range(month-5, month+1):
            temp[i] = 0
            for each in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                  extract('month', Records.record_goods_time) == i)).all():
                # print(each.record_goods_time.strftime('%Y-%m-%d %H:%M:%S'))
                if face_token != each.face_token:
                    continue
                good_id = each.record_goods_id
                good_price = Goods.query.filter(Goods.id == good_id).first().goods_price
                count = each.record_goods_count
                temp[i] = temp[i] + count * good_price

            result['data'].append(temp[i])

        return json.dumps(result, ensure_ascii=False)
    else:
        return 'get is not welcomed!'



'''
函数名：customer_ask_for_shop
创建时间：2019-08-27
作者：黄文政
说明：顾客查看门店列表
修改日期：2019-08-27
'''
@app.route('/customer_ask_for_shop', methods=['GET', 'POST'])
def customer_ask_for_shop():
    # 返回名称，地址，电话
    result = []
    for each in Shop.query.all():
        name = each.shop_name
        address = each.shop_address
        phone = each.shop_phone

        result.append({'name': name, 'address': address, 'phone': phone})

    return json.dumps(result, ensure_ascii=False)


'''
函数名：customer_ask_for_goods_rate
创建时间：2019-09-05
作者：黄文政
说明：小程序顾客查看某商品评分
修改日期：2019-09-05
'''
@app.route('/customer_ask_for_goods_rate', methods=['GET', 'POST'])
def customer_ask_for_goods_rate():
    if request.method == "POST":
        good_name = request.form['name']
        good_id = Goods.query.filter(Goods.goods_name == good_name).first().id

        rate_record = Rate.query.filter(Rate.good_id == good_id).first()
        result = {}
        if not rate_record:
            result['value'] = '暂无评分'
        else:
            result['value'] = "%.1f" % rate_record.rate

        return json.dumps(result)

    else:
        return "get is not welcomed!"


'''
函数名：customer_set_goods_rate
创建时间：2019-09-05
作者：黄文政
说明：小程序顾客添加某商品评分
修改日期：2019-09-05
'''
@app.route('/customer_set_goods_rate', methods=['GET', 'POST'])
def customer_set_goods_rate():
    if request.method == "POST":
        good_name = request.form['name']
        value = request.form['value']

        good_id = Goods.query.filter(Goods.goods_name == good_name).first().id

        rate_record = Rate.query.filter(Rate.good_id == good_id).first()

        if not rate_record:
            rate = Rate()
            rate.good_id = good_id
            rate.rate = value
            rate.count = 1
            rate.total = value

            db.session.add(rate)
            db.session.commit()
        else:
            rate_record.total = rate_record.total + float(value)
            rate_record.count = rate_record.count + 1
            rate_record.rate = rate_record.total / rate_record.count

            db.session.add(rate_record)
            db.session.commit()
        return json.dumps(["评分成功"], ensure_ascii=False)
    else:
        return "get is not welcomed!"


'''
函数名：customer_ask_for_goods_info
创建时间：2019-08-27
作者：黄文政
说明：小程序顾客查看具体商品详情
修改日期：2019-08-27
'''
@app.route('/customer_ask_for_goods_info', methods=['GET', 'POST'])
def customer_ask_for_goods_info():
    if request.method == "POST":
        # 返回名称，价格，详情，库存，销量
        name = request.form['good_name']
        face_token = request.form['face_token']

        result = {}
        good = Goods.query.filter(Goods.goods_name == name).first()
        price = good.goods_price
        info = good.goods_info
        stock = good.goods_count
        img = good.goods_imag
        id = good.id

        # 更新顾客行为表
        behaviour = Behaviour.query.filter(
            and_(Behaviour.face_token == face_token, Behaviour.good_id == id)).first()
        if not behaviour:
            behaviour = Behaviour()
            behaviour.face_token = face_token
            behaviour.action = 'browse'
            behaviour.good_id = id

            db.session.add(behaviour)
            db.session.commit()


        sales = 0
        for each in Records.query.filter(Records.record_goods_id == id).all():
            sales = sales + each.record_goods_count

        result['name'] = name
        result['price'] = price
        result['info'] = info
        result['stock'] = stock
        result['img'] = img
        result['sales'] = sales
        return json.dumps(result, ensure_ascii=False)
    else:
        # 返回名称，价格，详情，库存，销量
        name = request.args.get('name')
        face_token = session['face_token']

        result = {}
        good = Goods.query.filter(Goods.goods_name == name).first()
        price = good.goods_price
        info = good.goods_info
        stock = good.goods_count
        img = good.goods_imag
        id = good.id

        # 更新顾客行为表
        behaviour = Behaviour.query.filter(
            and_(Behaviour.face_token == face_token, Behaviour.good_id == id)).first()
        if not behaviour:
            behaviour = Behaviour()
            behaviour.face_token = face_token
            behaviour.action = 'browse'
            behaviour.good_id = id

            db.session.add(behaviour)
            db.session.commit()

        sales = 0
        for each in Records.query.filter(Records.record_goods_id == id).all():
            sales = sales + each.record_goods_count

        result['name'] = name
        result['price'] = price
        result['info'] = info
        result['stock'] = stock
        result['img'] = img
        result['sales'] = sales
        return json.dumps(result, ensure_ascii=False)


'''
函数名：goods_info
创建时间：2019-08-27
作者：黄文政
说明：顾客查看商品详情
修改日期：2019-08-27
'''
@app.route('/goods_info')
def goods_info():
    return render_template('customer/goods_info.html')



'''
函数名：customer_recommend
创建时间：2019-08-25
作者：黄文政
说明：顾客商品推荐界面
修改日期：2019-08-25
'''
@app.route('/customer_recommend')
@login_required
def customer_recommend():
    return render_template('customer/customer_recommend.html')


'''
函数名：customer_ask_for_recommend
创建时间：2019-09-05
作者：黄文政
说明：web上顾客查看商品推荐
修改日期：2019-09-05
'''
@app.route('/customer_ask_for_recommend', methods=["POST", "GET"])
@login_required
def customer_ask_for_recommend():
    if request.method == 'GET':
        # 获取推荐数据，从10个中每次随机选6个作为推荐
        user_ids = []
        good_ids = []
        rate = []
        item_id = []
        for each in Behaviour.query.all():
            user_ids.append(each.face_token)
            good_ids.append(each.good_id)
            if each.action == 'buy':
                rate.append(5)
            elif each.action == 'addcart':
                rate.append(3)
            elif each.action == 'browse':
                rate.append(1)

        # 若为老顾客，使用协同过滤推荐
        if session['face_token'] in user_ids:
            behaviour_data = {'user_id': user_ids, 'goods_id': good_ids, 'rate': rate}
            behaviours = DataFrame(behaviour_data)
            behaviours.to_csv('behaviour.csv', index=None, encoding='gbk')

            from cf import run
            item_id = run(session['face_token'])
        # 若为新顾客，则推荐评分高的商品
        else:
            pass

        rand_id = random.sample(item_id, 6)

        # print(rand_id)
        result = []
        for i in rand_id:
            good = Goods.query.filter(Goods.id == i[0]).first()
            name = good.goods_name
            price = good.goods_price
            img = good.goods_imag
            result.append({'name': name, 'price': price, 'img': img})
        print(result)
        return "successCallback" + "(" + json.dumps(result) + ")"

    else:
        return "post is not welcomed!"



'''
函数名：customer_records
创建时间：2019-08-25
作者：黄文政
说明：顾客购买记录
修改日期：2019-08-27
'''
@app.route('/customer_records')
@login_required
def customer_records():
    return render_template('customer/customer_records.html')


'''
方法名称：staff_login
作者：姜子玥
创建时间：2019-08-25
说明：检测员工输入的密码与id是否符合,符合跳转到员工首页面，不符合弹出提示
修改时间：2019-8-26
'''
@app.route('/staff_login', methods=['POST'])
def staff_login():
    user_id = request.form['id']
    user_pwd = request.form['pwd']
    # print(user_id)
    # print(user_pwd)
    user = Staff.query.filter(Staff.staff_id==user_id).first()
    # print(user)
    pwd = user.pwd
    if user is None:
        print('not user')
        return 'fail'
    elif pwd != user_pwd:
        print('password error')
        return 'fail'
    else:
        print("last")
        role = user.identity
        session['staff_id'] = user.staff_id

        # 如果有'face_token'的session，则删除
        keys = session.keys()
        for k in list(keys):
            if k == 'face_token':
                session.pop('face_token')
                break
        return role


'''
函数名：staff_logout
创建时间：2019-08-27
作者：黄文政
说明：收银员或管理员退出，清除session
修改日期：2019-08-27
'''
@app.route('/staff_logout')
def staff_logout():
    # 如果有'staff_id'的session，则删除
    keys = session.keys()
    for k in list(keys):
        if k == 'staff_id':
            session.pop('staff_id')
    return redirect(url_for('login'))


'''
函数名：cashier_management
创建时间：2019-08-25
作者：黄文政
说明：收银员商品管理界面
修改日期：2019-08-25
'''
@app.route('/cashier')
@login_required
def cashier_management():
    return render_template('cashier/cashier_management.html')


'''
函数名：cashier_order
创建时间：2019-08-27
作者：黄文政
说明：收银员查看订单界面
修改日期：2019-08-27
'''
@app.route('/cashier_order')
@login_required
def cashier_order():
    return render_template('cashier/cashier_order.html')


'''
函数名：cashier_order_details
创建时间：2019-08-27
作者：黄文政
说明：收银员查看某具体订单界面
修改日期：2019-08-27
'''
@app.route('/cashier_order_details')
def cashier_order_details():
    return render_template('cashier/cashier_order_details.html')


'''
函数名：cashier_ask_for_order
创建时间：2019-08-27
作者：黄文政
说明：收银员查看订单列表
修改日期：2019-08-27
'''
@app.route('/cashier_ask_for_order', methods=["POST", "GET"])
def cashier_ask_for_order():
    if request.method == "GET":
        result = []
        tokens = []
        staff_id = session['staff_id']
        shop_id = Staff.query.filter(Staff.staff_id == staff_id).first().shop_id
        for each in Orders.query.filter(Orders.shop_id == shop_id).all():
            token = each.token
            time = each.record_time.strftime('%Y-%m-%d %H:%m:%S')
            if token in tokens:
                pass
            else:
                tokens.append(token)
                result.append({'token': token, 'time': time})
        # print(result)
        return "successCallback"+"("+json.dumps(result)+")"
    else:
        return "post is not welcomed!"


'''
函数名：cashier_ask_for_order_details
创建时间：2019-08-27
作者：黄文政
说明：收银员查看某具体订单
修改日期：2019-08-27
'''
@app.route('/cashier_ask_for_order_details', methods=["POST", "GET"])
def cashier_ask_for_order_details():
    if request.method == "GET":
        token = request.args.get('token')
        result = []
        for each in Orders.query.filter(Orders.token == token).all():
            count = each.goods_count
            good_id = each.goods_id
            good = Goods.query.filter(Goods.id == good_id).first()
            good_name = good.goods_name
            good_price = good.goods_price
            result.append({'count': count, 'good_name': good_name, 'good_price': good_price})

        return "successCallback"+"("+json.dumps(result, ensure_ascii=False)+")"
    else:
        return "post is not welcomed!"


'''
函数名：cashier_add_order
创建时间：2019-09-03
作者：黄文政
说明：收银员线下购买下单
修改日期：2019-09-03
'''
@app.route('/cashier_add_order', methods=["POST", "GET"])
def cashier_add_order():
    if request.method == "GET":
        orders = json.loads(request.args.get('data'))
        face_token = session['order_face_token']
        staff_id = session['staff_id']
        shop_id = Staff.query.filter(Staff.staff_id == staff_id).first().shop_id
        time = datetime.datetime.now()

        # 生成订单号 mmddhhMMss + 两位随机号 + 一位流水号
        token = time.strftime('%m%d%H%M%S')
        token = token + str(random.randint(0, 100)).zfill(2)
        sum = 0
        for each in Records.query.filter(Records.token.contains(token)).all():
            sum = sum + 1
        token = token + str(sum)
        # print(token)

        for each in orders:
            good_name = each['name']
            count = int(each['count'])
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id

            # 更新顾客行为表
            behaviour = Behaviour.query.filter(
                and_(Behaviour.face_token == face_token, Behaviour.good_id == good_id)).first()
            if not behaviour:
                behaviour = Behaviour()
                behaviour.face_token = face_token
                behaviour.action = 'buy'
                behaviour.good_id = good_id

                db.session.add(behaviour)
                db.session.commit()
            else:
                if behaviour.action != 'buy':
                    behaviour.action = 'buy'

                    db.session.add(behaviour)
                    db.session.commit()

            # 添加到订单中
            good_id = Goods.query.filter(Goods.goods_name == good_name).first().id
            order = Orders()
            order.goods_id = good_id
            order.shop_id = shop_id
            order.goods_count = count
            order.record_time = time
            order.face_token = face_token
            order.token = token

            print(good_id, shop_id, count, time, face_token, token)

            db.session.add(order)
            db.session.commit()



        return "successCallback"+"("+json.dumps(['ok'], ensure_ascii=False)+")"
    else:
        return "post is not welcomed!"


'''
函数名：cashier_customer_identification
创建时间：2019-08-27
作者：黄文政
说明：收银员识别用户界面
修改日期：2019-08-27
'''
@app.route('/cashier_customer_identification')
@login_required
def cashier_customer_identification():
    # 如果有'order_face_token'的session，则删除
    keys = session.keys()
    for k in list(keys):
        if k == 'order_face_token':
            session.pop('order_face_token')
            break
    return render_template('cashier/cashier_customer_identification.html')

'''
函数名：order_face_upload
创建时间：2019-09-03
作者：黄文政
说明：收银员识别用户人脸
修改日期：2019-09-03
'''
@app.route('/order_face_upload', methods=['GET', 'POST'])
def order_face_upload():
    # print('face upload call')
    # print(request.json)
    if request.method == 'POST':
        img = request.files.get('file_obj')
        path = './1.jpg'
        # img.save(path)

        url = 'https://api-cn.faceplusplus.com/facepp/v3/search'
        data = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url, data=data, files={'image_file': img})
        res_str = json.dumps(response.json())
        print('faceupload:' + res_str)
        data = response.json()
        if len(data['faces']) != 0:
            # print('confidence:' + str(data['results'][0]['confidence']))
            if data['results'][0]['confidence'] > 80:
                session['order_face_token'] = data['results'][0]['face_token']
                print(session['order_face_token'])
        # print('search:'+res_str)
        return res_str
    else:
        return "无图片"


'''
函数名：order_register
创建时间：2019-09-03
作者：黄文政
说明：下单界面，获得人脸，注册
修改日期：2019-09-03
'''
@app.route('/order_register', methods=['GET', 'POST'])
def order_register():
    print('faceRegister call')
    if request.method == 'POST':
        img = request.files.get('file_obj')

        url_detect = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
        data_detect = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
        }
        response = requests.post(url=url_detect, data=data_detect, files={'image_file': img})
        face_token = response.json()['faces'][0]['face_token']
        print(face_token)

        url_addface = 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface'
        data_addface = {
            'api_key': '7ryNXfh6Oa9uUjQnx5DxFChpua57NDCv',
            'api_secret': 'H3GsXC34XhSxf1bW1kQCedAcrgwIjVC2',
            'face_tokens': face_token,
            'outer_id': 'facegofaceset',
        }
        response = requests.post(url=url_addface, data=data_addface)
        session['order_face_token'] = face_token

        return face_token
    else:
        return '无图片'


'''
函数名：cashier_customer_order
创建时间：2019-09-03
作者：黄文政
说明：收银员识别用户界面
修改日期：2019-09-03
'''
@app.route('/cashier_customer_order')
@login_required
def cashier_customer_order():
    return render_template('cashier/cashier_customer_order.html')


'''
函数名：cashier_customer_search
创建时间：2019-09-03
作者：黄文政
说明：收银员识别用户界面，查询商品
修改日期：2019-09-03
'''
@app.route('/cashier_customer_search')
@login_required
def cashier_customer_search():
    if request.method == "GET":
        word = request.args.get('word')
        result = []
        for good in Goods.query.filter(Goods.goods_name.contains(word)).all():
            result.append(good.goods_name)

        print(result)
        return "successCallback" + "(" + json.dumps(result) + ")"
    else:
        return 'post is not welcomed!'


'''
函数名：cashier_ask_for_customer_order
创建时间：2019-09-02
作者：黄文政
说明：收银员识别用户后查看订单
修改日期：2019-09-02
'''
@app.route('/cashier_ask_for_customer_order', methods=["POST", "GET"])
@login_required
def cashier_ask_for_customer_order():
    if request.method == "GET":
        # face_token = '0ae83ffd1cabed5275dc437ab851f91d'
        face_token = session['order_face_token']
        shop_id = Staff.query.filter(Staff.staff_id == session['staff_id']).first().shop_id
        result = []
        tokens = []
        for each in Orders.query.filter(and_(Orders.face_token == face_token, Orders.shop_id == shop_id)).all():
            token = each.token
            time = each.record_time.strftime('%Y-%m-%d %H:%m:%S')
            if token in tokens:
                pass
            else:
                tokens.append(token)
                result.append({'token': token, 'time': time})
        # print(result)
        return "successCallback"+"("+json.dumps(result)+")"
    else:
        return "post is not welcomed!"


'''
函数名：cashier_ask_for_customer_recommend
创建时间：2019-09-02
作者：黄文政
说明：收银员识别用户后返回推荐
修改日期：2019-09-02
'''
@app.route('/cashier_ask_for_customer_recommend', methods=["POST", "GET"])
def cashier_ask_for_customer_recommend():
    result = []
    if request.method == "POST":
        return "successCallback" + "(" + json.dumps(['post is not welcomed']) + ")"
    else:
        # 随机推荐
        # item_id = []
        # for each in Goods.query.all():
        #     item_id.append(each.id)

        # 获取推荐数据，从10个中每次随机选6个作为推荐
        user_ids = []
        good_ids = []
        rate = []
        item_id = []
        for each in Behaviour.query.all():
            user_ids.append(each.face_token)
            good_ids.append(each.good_id)
            if each.action == 'buy':
                rate.append(5)
            elif each.action == 'addcart':
                rate.append(3)
            elif each.action == 'browse':
                rate.append(1)

        # 若为老顾客，使用协同过滤推荐
        if session['order_face_token'] in user_ids:
            behaviour_data = {'user_id': user_ids, 'goods_id': good_ids, 'rate': rate}
            behaviours = DataFrame(behaviour_data)
            behaviours.to_csv('behaviour.csv', index=None, encoding='gbk')

            from cf import run
            item_id = run(session['order_face_token'])
        # 若为新顾客，则推荐评分高的商品
        else:

            pass

        rand_id = random.sample(item_id, 6)

        print(rand_id)

        for i in rand_id:
            good = Goods.query.filter(Goods.id == i[0]).first()
            name = good.goods_name
            price = good.goods_price
            result.append({'recommend_name': name, 'recommend_price': price})

        return "successCallback" + "(" + json.dumps(result) + ")"


'''
函数名：cashier_finish_specific_order
创建时间：2019-09-02
作者：黄文政
说明：收银员完成订单
修改日期：2019-09-02
'''
@app.route('/cashier_finish_specific_order', methods=["POST", "GET"])
def cashier_finish_specific_order():
    if request.method == "GET":
        token = request.args.get('token')
        for each in Orders.query.filter(Orders.token == token).all():
            record = Records()
            record.record_goods_count = each.goods_count
            record.record_goods_time = each.record_time
            record.face_token = each.face_token
            record.shop_id = each.shop_id
            record.record_goods_id = each.goods_id
            record.token = token
            record.rated = 0

            db.session.add(record)
            db.session.delete(each)
            db.session.commit()

        return "successCallback"+"("+json.dumps(['订单完成'])+")"
    else:
        return "post is not welcomed!"


'''
函数名：staff_add_goods
创建时间：2019-08-25
作者：黄文政
说明：staff增加商品页面
修改日期：2019-08-27
'''
@app.route('/staff_add_goods')
@login_required
def staff_add_goods():
    return render_template('cashier/staff_add_goods.html')


'''
函数名：staff_goods_details
创建时间：2019-08-25
作者：黄文政
说明：staff修改商品详情页面
修改日期：2019-08-27
'''
@app.route('/staff_goods_details')
@login_required
def staff_goods_details():
    return render_template('cashier/staff_goods_details.html')


'''
函数名：staff_ask_for_goods_list
创建时间：2019-08-29
作者：黄文政
说明：staff获取具体商品列表
修改日期：2019-08-29
'''
@app.route('/staff_ask_for_goods_list', methods=['POST', 'GET'])
def staff_ask_for_goods_list():
    # name = request.form['name']
    if request.method == 'POST':
        result = []
        for good in Goods.query.all():
            name = good.goods_name
            stock = good.goods_count
            price = good.goods_price
            type = good.goods_type
            img = good.goods_imag
            info = good.goods_info
            id = good.id
            item = {}

            item['name'] = name
            item['stock'] = stock
            item['price'] = price
            item['type'] = type
            item['img'] = img
            item['info'] = info
            item['good_id'] = id

            result.append(item)

        return "successCallback"+"("+json.dumps(result)+")"
    else:
        return 'get is not welcomed!'


'''
函数名：staff_ask_for_goods_details
创建时间：2019-08-29
作者：黄文政
说明：staff获取具体商品详情
修改日期：2019-08-29
'''
@app.route('/staff_ask_for_goods_details', methods=['POST', 'GET'])
def staff_ask_for_goods_details():
    # name = request.form['name']
    name = '小说绘'
    good = Goods.query.filter(Goods.goods_name == name).first()
    stock = good.goods_count
    price = good.goods_price
    type = good.goods_type
    img = good.goods_imag
    info = good.goods_info
    id = good.id
    result = {}

    result['name'] = name
    result['stock'] = stock
    result['price'] = price
    result['type'] = type
    result['img'] = img
    result['info'] = info
    result['good_id'] = id

    return json.dumps(result, ensure_ascii=False)


'''
函数名：staff_change_goods_details
创建时间：2019-08-29
作者：黄文政
说明：staff修改商品详情
修改日期：2019-08-29
'''
@app.route('/staff_change_goods_details', methods=['POST', 'GET'])
def staff_change_goods_details():
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        stock = request.form['stock']
        type = request.form['type']
        info = request.form['info']
        id = request.form['good_id']

        good = Goods.query.filter(Goods.id == id).first()
        good.goods_name = name
        good.goods_price = float(price)
        good.goods_count = int(stock)
        good.goods_type = type
        good.goods_info = info

        db.session.add(good)
        db.session.commit()

        return '保存成功！'
    else:
        return 'get is not welcomed!'



'''
函数名：staff_add_goods_details
创建时间：2019-08-29
作者：黄文政
说明：staff新增商品
修改日期：2019-08-29
'''
@app.route('/staff_add_goods_details', methods=['POST', 'GET'])
def staff_add_goods_details():
    if request.method == 'POST':
        name = request.form['name']
        price = request.form['price']
        stock = request.form['stock']
        type = request.form['type']
        info = request.form['info']
        img_name = request.form['img_name']

        #保存图片
        img = request.files.get('file')
        path = './static/img/'
        img.save(path+img_name)

        good = Goods()
        good.goods_name = name
        good.goods_price = float(price)
        good.goods_count = int(stock)
        good.goods_type = type
        good.goods_info = info
        good.goods_imag = '/static/img/' + img_name

        db.session.add(good)
        db.session.commit()

        id = Goods.query.filter(Goods.goods_name == name).first().id
        print(id)

        return str(id)
    else:
        return 'get is not welcomed!'


'''
函数名：staff_delete_details
创建时间：2019-08-30
作者：黄文政
说明：staff删除商品
修改日期：2019-08-30
'''
@app.route('/staff_delete_details', methods=['POST', 'GET'])
def staff_delete_details():
    if request.method == 'POST':
        good_id = request.form['good_id']

        print(good_id)
        good = Goods.query.filter(Goods.id == good_id).first()

        db.session.delete(good)
        db.session.commit()

        return "删除成功"
    else:
        return 'get is not welcomed!'


'''
函数名：hot_items
创建时间：2019-08-28
作者：黄文政
说明：顾客查看热销榜
修改日期：2019-08-28
'''
@app.route('/hot_items', methods=['POST', 'GET'])
def hot_items():
    # 返回前五的名称，图片，价格
    item_dict = {}
    for each in Goods.query.all():
        item_dict[each.id] = 0
    for good_id in item_dict.keys():
        for record in Records.query.filter(Records.record_goods_id == good_id).all():
            item_dict[good_id] = item_dict[good_id] + record.record_goods_count
    rank = sorted(item_dict.items(), key=lambda d: d[1], reverse=True)
    # print(rank)
    result = []
    for i in range(0, 5):
        good_id = rank[i][0]
        count = 0
        for each in Records.query.filter(Records.record_goods_id == good_id).all():
            count = count + each.record_goods_count
        good = Goods.query.filter(Goods.id == good_id).first()
        name = good.goods_name
        img = good.goods_imag
        price = good.goods_price
        info = good.goods_info

        result.append({'name': name, 'img': img, 'price': price, 'info': info, 'count': count})

    return json.dumps(result, ensure_ascii=False)



'''
函数名：admin_goods_management
创建时间：2019-08-27
作者：黄文政
说明：管理员-商品管理界面
修改日期：2019-08-27
'''
@app.route('/admin')
@login_required
def admin_goods_management():
    return render_template('admin/admin_goods_management.html')


'''
函数名：admin_record
创建时间：2019-08-27
作者：黄文政
说明：管理员-购买记录
修改日期：2019-08-27
'''
@app.route('/admin_record')
@login_required
def admin_record():
    return render_template('admin/admin_record.html')


'''
函数名：admin_ask_for_record
创建时间：2019-09-01
作者：黄文政
说明：管理员-购买记录
修改日期：2019-09-01
'''
@app.route('/admin_ask_for_record', methods=["POST", "GET"])
def admin_ask_for_record():
    if request.method == "GET":
        year = request.args.get('year')
        month = request.args.get('month')
        shop_name = request.args.get('shop_name')

        result = []
        temp = []
        print(shop_name)

        if shop_name == "all":
            for each in Goods.query.all():
                good_name = each.goods_name
                good_price = each.goods_price
                good_id = each.id
                sum = 0
                count = 0
                for each in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                      extract('month', Records.record_goods_time) == month,
                                                      Records.record_goods_id == good_id)).all():
                    count = count + each.record_goods_count
                    sum = sum + each.record_goods_count * good_price

                temp.append({'good_name': good_name, 'count': count, 'total': sum})
        else:
            shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id
            for each in Goods.query.all():
                good_name = each.goods_name
                good_price = each.goods_price
                good_id = each.id
                sum = 0
                count = 0
                for each in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                      extract('month', Records.record_goods_time) == month,
                                                      Records.record_goods_id == good_id,
                                                      Records.shop_id == shop_id)).all():
                    count = count + each.record_goods_count
                    sum = sum + each.record_goods_count * good_price

                temp.append({'good_name': good_name, 'count': count, 'total': sum})
        result = sorted(temp, key=lambda e: e.__getitem__('total'), reverse=True)
        print(result)
        return "successCallback"+"("+json.dumps(result, ensure_ascii=False)+")"

    else:
        return "post is not welcomed!"


'''
函数名：admin_ask_for_year_sales
创建时间：2019-09-03
作者：黄文政
说明：管理员-查看指定年份各门店各月份的销售金额
修改日期：2019-09-03
'''
@app.route('/admin_ask_for_year_sales', methods=["POST", "GET"])
def admin_ask_for_year_sales():
    if request.method == "GET":
        year = request.args.get('year')
        result = {}
        shop_list = []

        for each in Shop.query.all():
            result[each.shop_name] = []
            shop_list.append(each.shop_name)

        result['全部'] = []

        # 每家店
        for shop_name in shop_list:
            shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

            # 每个月
            for month in range(1, 13):
                sum = 0
                for record in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                      extract('month', Records.record_goods_time) == month,
                                                        Records.shop_id == shop_id)).all():
                    count = record.record_goods_count
                    good_id = record.record_goods_id
                    good_price = Goods.query.filter(Goods.id == good_id).first().goods_price
                    sum = sum + count * good_price
                result[shop_name].append(sum)

        # 总金额
        # 每个月
        for month in range(1, 13):
            sum = 0
            for record in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                    extract('month', Records.record_goods_time) == month)).all():
                count = record.record_goods_count
                good_id = record.record_goods_id
                good_price = Goods.query.filter(Goods.id == good_id).first().goods_price
                sum = sum + count * good_price
            result['全部'].append(sum)

        return "successCallback"+"("+json.dumps(result, ensure_ascii=False)+")"
    else:
        return 'post is not welcomed!'


'''
函数名：admin_ask_for_type_sales
创建时间：2019-09-03
作者：黄文政
说明：管理员-查看指定年份各门店各月份的销售金额
修改日期：2019-09-03
'''
@app.route('/admin_ask_for_type_sales', methods=["POST", "GET"])
def admin_ask_for_type_sales():
    if request.method == "GET":
        year = request.args.get('year')
        month = request.args.get('month')

        type_list = ['食品', '饮品', '日用品', '书籍杂志']
        shop_list = []
        result = {}

        for each in Shop.query.all():
            shop_list.append(each.shop_name)

        # 每种类型
        for type in type_list:
            result[type] = []
            #每家店
            for shop_name in shop_list:
                shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

                sum = 0
                #每条记录
                for record in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                      extract('month', Records.record_goods_time) == month,
                                                        Records.shop_id == shop_id)).all():
                    count = record.record_goods_count
                    good_id = record.record_goods_id
                    good = Goods.query.filter(Goods.id == good_id).first()
                    good_price = good.goods_price
                    good_type = good.goods_type
                    if type == good_type:
                        sum = sum + count * good_price
                result[type].append(sum)

        # 总和
        # 每种类型
        for type in type_list:
            sum = 0
            # 每条记录
            for record in Records.query.filter(and_(extract('year', Records.record_goods_time) == year,
                                                    extract('month', Records.record_goods_time) == month)).all():
                count = record.record_goods_count
                good_id = record.record_goods_id
                good = Goods.query.filter(Goods.id == good_id).first()
                good_price = good.goods_price
                good_type = good.goods_type
                if type == good_type:
                    sum = sum + count * good_price
                    # print(type, count, good_id, good_price)
            result[type].append(sum)

        return "successCallback"+"("+json.dumps(result, ensure_ascii=False)+")"
    else:
        return 'post is not welcomed!'



'''
函数名：admin_shop_management
创建时间：2019-08-27
作者：黄文政
说明：管理员-门店管理
修改日期：2019-08-27
'''
@app.route('/admin_shop_management')
@login_required
def admin_shop_management():
    return render_template('admin/admin_shop_management.html')


'''
函数名：admin_staff_management
创建时间：2019-08-27
作者：黄文政
说明：管理员-收银员管理
修改日期：2019-08-27
'''
@app.route('/admin_staff_management')
@login_required
def admin_staff_management():
    return render_template('admin/admin_staff_management.html')


'''
函数名：admin_ask_for_staff
创建时间：2019-08-30
作者：黄文政
说明：管理员-查看所有员工
修改日期：2019-08-30
'''
@app.route('/admin_ask_for_staff', methods=['POST', 'GET'])
def admin_ask_for_staff():
    # print(request.method)
    if request.method == 'GET':
        result = []
        for each in Staff.query.all():
            staff_id = each.staff_id
            pwd = each.pwd
            shop_id = each.shop_id
            staff_name = each.staff_name
            identity = each.identity
            # print(type(shop_id))
            shop_name = ""
            if shop_id != 0:
                shop = Shop.query.filter(Shop.id == shop_id).first()
                shop_name = shop.shop_name
            else:
                shop_name = "全部"
            item = {'staff_id': staff_id, 'pwd': pwd, 'staff_name': staff_name, 'shop_name': shop_name, 'identity': identity}
            result.append(item)
        return "successCallback"+"("+json.dumps(result, ensure_ascii=False)+")"
    else:
        return 'post is not welcomed!'


'''
函数名：admin_add_staff
创建时间：2019-08-30
作者：黄文政
说明：管理员-增加收银员
修改日期：2019-08-30
'''
@app.route('/admin_add_staff', methods=['POST', 'GET'])
def admin_add_staff():
    # print(request.method)
    if request.method == 'GET':
        staff_name = request.args.get('staff_name')
        identity = request.args.get('identity')
        shop_name = request.args.get('shop_name')
        staff_id = request.args.get('staff_id')
        pwd = request.args.get('pwd')

        for each in Staff.query.filter(Staff.staff_id == staff_id).all():
            return "staff_id重复，添加失败"

        shop_id = 0
        if shop_name != "全部":
            shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

        staff = Staff()
        staff.staff_id = staff_id
        staff.identity = identity
        staff.shop_id = shop_id
        staff.pwd = pwd
        staff.staff_name = staff_name

        db.session.add(staff)
        db.session.commit()

        return "successCallback"+"("+json.dumps(["添加成功"])+")"
    else:
        return 'post is not welcomed!'


'''
函数名：admin_change_staff
创建时间：2019-08-30
作者：黄文政
说明：管理员-修改收银员
修改日期：2019-08-30
'''
@app.route('/admin_change_staff', methods=['POST', 'GET'])
def admin_change_staff():
    # print(request.method)
    if request.method == 'GET':
        staff_name = request.args.get('staff_name')
        shop_name = request.args.get('shop_name')
        staff_id = request.args.get('staff_id')
        identity = request.args.get('identity')
        pwd = request.args.get('pwd')
        print(staff_name, shop_name, staff_id, identity, pwd)

        shop_id = 0
        if shop_name != "全部":
            shop_id = Shop.query.filter(Shop.shop_name == shop_name).first().id

        print(staff_id)
        staff = Staff.query.filter(Staff.staff_id == staff_id).first()
        staff.staff_name = staff_name
        staff.shop_id = shop_id
        staff.pwd = pwd
        staff.identity = identity

        db.session.add(staff)
        db.session.commit()

        return "successCallback"+"("+json.dumps(["修改成功"])+")"
    else:
        return 'post is not welcomed!'


'''
函数名：admin_delete_staff
创建时间：2019-08-30
作者：黄文政
说明：管理员-删除收银员
修改日期：2019-08-30
'''
@app.route('/admin_delete_staff', methods=['POST', 'GET'])
def admin_delete_staff():
    # print(request.method)
    if request.method == 'GET':
        staff_id = request.args.get('staff_id')
        # print(staff_id)

        staff = Staff.query.filter(Staff.staff_id == staff_id).first()

        db.session.delete(staff)
        db.session.commit()

        return "successCallback"+"("+json.dumps(["删除成功"])+")"
    else:
        return 'get is not welcomed!'


'''
函数名：admin_ask_for_shop
创建时间：2019-08-30
作者：黄文政
说明：管理员查看门店列表
修改日期：2019-08-30
'''
@app.route('/admin_ask_for_shop', methods=['GET', 'POST'])
def admin_ask_for_shop():
    # 返回名称，地址，电话
    result = []
    for each in Shop.query.all():
        name = each.shop_name
        id = each.id
        address = each.shop_address
        phone = each.shop_phone

        result.append({'name': name, 'shop_id': id, 'address': address, 'phone': phone})

    return "successCallback"+"("+json.dumps(result)+")"


'''
函数名：admin_change_shop
创建时间：2019-09-01
作者：黄文政
说明：管理员修改门店列表
修改日期：2019-09-01
'''
@app.route('/admin_change_shop', methods=['GET', 'POST'])
def admin_change_shop():
    if request.method == "GET":
        shop_id = request.args.get('shop_id')
        name = request.args.get('name')
        address = request.args.get('address')
        phone = request.args.get('phone')

        shop = Shop.query.filter(Shop.id == shop_id).first()
        shop.shop_name = name
        shop.shop_address = address
        shop.shop_phone = phone

        db.session.add(shop)
        db.session.commit()

        return "successCallback"+"("+json.dumps(["修改成功"])+")"
    else:
        return "post is not welcomed!"


'''
函数名：admin_add_shop
创建时间：2019-09-01
作者：黄文政
说明：管理员新增门店列表
修改日期：2019-09-01
'''
@app.route('/admin_add_shop', methods=['GET', 'POST'])
def admin_add_shop():
    # 返回shop_id
    if request.method == "GET":
        name = request.args.get('name')
        address = request.args.get('address')
        phone = request.args.get('phone')

        shop = Shop()
        shop.shop_name = name
        shop.shop_address = address
        shop.shop_phone = phone

        db.session.add(shop)
        db.session.commit()

        shop_id = Shop.query.filter(Shop.shop_name == name).first().id

        result = {'shop_id': shop_id}

        return "successCallback"+"("+json.dumps(result)+")"
    else:
        return "post is not welcomed!"


'''
函数名：admin_delete_shop
创建时间：2019-09-01
作者：黄文政
说明：管理员删除门店列表
修改日期：2019-09-01
'''
@app.route('/admin_delete_shop', methods=['GET', 'POST'])
def admin_delete_shop():
    if request.method == "GET":
        shop_id = request.args.get('shop_id')
        # print(shop_id)
        shop = Shop.query.filter(Shop.id == shop_id).first()

        db.session.delete(shop)
        db.session.commit()

        return "successCallback" + "(" + json.dumps(["删除成功"]) + ")"
    else:
        return "post is not welcomed!"


'''
函数名：consumption_statics
创建时间：2019-08-27
作者：黄文政
说明：管理员-消费分析
修改日期：2019-08-27
'''
@app.route('/consumption_statics')
@login_required
def consumption_statics():
    return render_template('admin/consumption_statics.html')


'''
函数名：shop_details
创建时间：2019-08-27
作者：黄文政
说明：管理员-查看某具体商店详情
修改日期：2019-08-27
'''
@app.route('/shop_details')
@login_required
def shop_details():
    return render_template('admin/shop_details.html')



@app.route('/test')
def test():

    # good_id_list = []
    # good_name_list = []
    # good_type_list = []
    #
    # for each in Goods.query.all():
    #     good_id_list.append(each.id)
    #     good_name_list.append(each.goods_name)
    #     good_type_list.append(each.goods_type)
    #
    #
    # good_data = {'goods_id':good_id_list, 'goods_name': good_name_list, 'goods_type': good_type_list}
    # good_df = DataFrame(good_data)
    # good_df.to_csv("good_dataframe.csv", index=None, encoding="gbk")

    # 获取推荐数据
    # from pandas import DataFrame
    # user_ids = []
    # good_ids = []
    # rate = []
    # for each in Behaviour.query.all():
    #     user_ids.append(each.face_token)
    #     good_ids.append(each.good_id)
    #     if each.action == 'buy':
    #         rate.append(5)
    #     elif each.action == 'addcart':
    #         rate.append(3)
    #     elif each.action == 'browse':
    #         rate.append(1)
    #
    # behaviour_data = {'user_id': user_ids, 'goods_id': good_ids, 'rate': rate}
    # behaviours = DataFrame(behaviour_data)
    # behaviours.to_csv('behaviour.csv', index=None, encoding='gbk')
    #
    # from cf import run
    # goods = run('0ae83ffd1cabed5275dc437ab851f91d')

    # records转购买行为
    # for each in Records.query.all():
    #     face_token = each.face_token
    #     good_id = each.record_goods_id
    #
    #     exist = False
    #     for behaviour in Behaviour.query.all():
    #         if face_token == behaviour.face_token and good_id == behaviour.good_id:
    #             exist = True
    #             break
    #
    #     if not exist:
    #         behaviour = Behaviour()
    #         behaviour.face_token = face_token
    #         behaviour.action = 'buy'
    #         behaviour.good_id = good_id
    #
    #         db.session.add(behaviour)
    #         db.session.commit()

    for each in Records.query.all():
        each.rated = 0
        db.session.add(each)
        db.session.commit()


    return 'ok'

if __name__ == '__main__':
    app.run()
