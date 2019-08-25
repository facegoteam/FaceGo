from flask import Flask, render_template, request, session
import requests
import json

app = Flask(__name__)
app.secret_key = 'super secret key'

@app.route('/')
def login():
    return render_template('login/login.html')

@app.route('/login_customer')
def login_customer():
    return render_template('login/login_customer.html')

@app.route('/login_staff')
def login_staff():
    return render_template('login/login_staff.html')

@app.route('/face_upload', methods=['GET', 'POST'])
def face_upload():
    print('face upload call')
    print(request.json)
    if request.method == 'POST':
        img = request.files.get('file_obj')
        # path = './1.jpg'
        # # django 提供的chunks方法
        # from django.core.files.uploadedfile import InMemoryUploadedFile
        # with open(path, 'wb') as f:
        #     for chunk in img.chunks():
        #         f.write(chunk)
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
            session['face_token'] = data['faces'][0]['face_token']
        print(res_str)
        return res_str
    else:
        return "无图片"

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
        return face_token
    else:
        return '无图片'

@app.route('/customer')
def customer():
    return render_template('customer/customer.html')

@app.route('/customer_goods')
def customer_goods():
    return render_template('customer/customer_goods.html')

@app.route('/customer_recommend')
def customer_recommend():
    return render_template('customer/customer_recommend.html')

@app.route('/customer_records')
def customer_records():
    return render_template('customer/customer_records.html')

@app.route('/cashier')
def cashier():
    return "cashier main page"

@app.route('/cashier_add_goods')
def cashier_add_goods():
    return render_template('cashier/cashier_add_goods.html')

@app.route('/cashier_goods_details')
def cashier_goods_details():
    return render_template('cashier/cashier_goods_details.html')

@app.route('/cashier_goods_details_add', methods=['GET', 'POST'])
def cashier_goods_add():
    form = request.form
    print(form)
    try:
        if form['add']:
            #保存商品信息修改
            return render_template('cashier/cashier_management.html', result="success")
        else:
            #提示是否保存修改
            return render_template('cashier/cashier_management.html')
    except:
        return render_template('cashier/cashier_management.html')
    finally:
        return render_template('cashier/cashier_management.html')

@app.route('/cashier_goods_details_change', methods=['GET', 'POST'])
def cashier_goods_change():
    form = request.form
    print(form)
    try:
        if form['add']:
            #保存商品信息修改
            return render_template('cashier/cashier_management.html', result="success")
        else:
            #提示是否保存修改
            return render_template('cashier/cashier_management.html')
    except:
        return render_template('cashier/cashier_management.html')
    finally:
        render_template('cashier/cashier_management.html')

@app.route('/cashier_management')
def cashier_management():
    return render_template('cashier/cashier_management.html')


if __name__ == '__main__':

    app.run()
