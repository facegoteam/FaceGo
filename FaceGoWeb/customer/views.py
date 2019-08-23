from django.shortcuts import render, render_to_response

# Create your views here.

# 方法名：customer
# 创建时间：08-23
# 作者：黄文政
# 简要说明：返回顾客首页
# 修改日期：08-23
def customer(request):
    return render_to_response('customer/customer.html')


# 方法名：customerGood
# 创建时间：08-23
# 作者：黄文政
# 简要说明：返回顾客查看商品页面
# 修改日期：08-23
def customerGood(request):
    print(request.session['face_token'])
    return render_to_response('customer/customer_goods.html')


# 方法名：customerRecommend
# 创建时间：08-23
# 作者：黄文政
# 简要说明：返回顾客查看推荐商品页面
# 修改日期：08-23
def customerRecommend(request):
    return render_to_response('customer/customer_recommend.html')