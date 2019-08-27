from functools import wraps
from flask import render_template, request, session, url_for, redirect
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
        if (not face_token) and (not staff_id):
            # WITHOUT_LOGIN是一个常量
            # print(url_for('login', _external=True))
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
    for k in keys:
        if k == 'face_token':
            session.pop('face_token')
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
        # # django 提供的chunks方法
        # # from django.core.files.uploadedfile import InMemoryUploadedFile
        # with open(path, 'wb') as f:
        #     f.write(img)

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
                for k in keys:
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
        for k in keys:
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


@app.route('/customer_logout')
@login_required
def customer_logout():
    session.pop('face_token')
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
    if request.method == 'POST':
        identity = request.form['identity']
        # print(identity)
        if identity == 'web':
            face_token = session['face_token']
        elif identity == 'wx':
            face_token = request.form['face_token']
        # face_token = '29f2e2a4a2c61f8c5f2abec835b96e4b'
        # 返回图片，名称，单价，数量，购买日期
    else:
        face_token = '0ae83ffd1cabed5275dc437ab851f91d'
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

        item = {}
        item['img'] = img
        item['name'] = name
        item['price'] = price
        item['count'] = count
        item['time'] = time.strftime('%Y-%m-%d %H:%M:%S')
        result.append(item)

    return json.dumps(result, ensure_ascii=False)



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
        good_type = '酒水饮乳'
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
函数名：customer_records
创建时间：2019-08-25
作者：黄文政
说明：顾客商品推荐界面
修改日期：2019-08-27
'''
@app.route('/customer_records')
@login_required
def customer_records():
    return render_template('customer/customer_records.html')


'''
方法名称：login_staff_test
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
        for k in keys:
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
@login_required
def cashier_order_details():
    return render_template('cashier/cashier_order_details.html')


'''
函数名：cashier_customer_identification
创建时间：2019-08-27
作者：黄文政
说明：收银员查看某具体订单界面
修改日期：2019-08-27
'''
@app.route('/cashier_customer_identification')
@login_required
def cashier_customer_identification():
    return render_template('cashier/cashier_customer_identification.html')


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


# '''
# 函数名：cashier_goods_add
# 创建时间：2019-08-25
# 作者：黄文政
# 说明：收银员增加商品页面
# 修改日期：2019-08-25
# '''
# @app.route('/cashier_goods_details_add', methods=['GET', 'POST'])
# @login_required
# def cashier_goods_add():
#     form = request.form
#     print(form)
#     try:
#         if form['add']:
#             #保存商品信息修改
#             return render_template('cashier/cashier_management.html', result="success")
#         else:
#             #提示是否保存修改
#             return render_template('cashier/cashier_management.html')
#     except:
#         return render_template('cashier/cashier_management.html')
#     finally:
#         return render_template('cashier/cashier_management.html')



'''
函数名：admin_goods_manage
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
函数名：admin_shop_management
创建时间：2019-08-27
作者：黄文政
说明：管理员-门店管理a
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
函数名：consumption_statics
创建时间：2019-08-27
作者：黄文政
说明：管理员-收银员管理
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



@app.route('/test/<test_id>')
def test(test_id):
    print(test_id)
    print(type(test_id))
    return test_id

if __name__ == '__main__':
    app.run()
