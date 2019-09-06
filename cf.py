import math
import pandas as pd
import time
import os

class UserCf:
    def __init__(self):
        self.file_path = 'behaviour.csv'
        self._init_frame()

    def _init_frame(self):
        self.frame = pd.read_csv(self.file_path)

    @staticmethod
    def _cosine_sim(target_goods, goods):
        '''
        simple method for calculate cosine distance.
        e.g: x = [1 0 1 1 0], y = [0 1 1 0 1]
             cosine = (x1*y1+x2*y2+...) / [sqrt(x1^2+x2^2+...)+sqrt(y1^2+y2^2+...)]
             that means union_len(goods1, goods2) / sqrt(len(goods1)*len(goods2))
        '''
        union_len = len(set(target_goods) & set(goods))
        if union_len == 0: return 0.0
        product = len(target_goods) * len(goods)
        cosine = union_len / math.sqrt(product)
        return cosine

    def _get_top_n_users(self, target_user_id, top_n):
        '''
        calculate similarity between all users and return Top N similar users.
        '''
        target_goods = self.frame[self.frame['user_id'] == target_user_id]['goods_id']
        other_users_id = [i for i in set(self.frame['user_id']) if i != target_user_id]
        other_goods = [self.frame[self.frame['user_id'] == i]['goods_id'] for i in other_users_id]

        sim_list = [self._cosine_sim(target_goods, movies) for movies in other_goods]
        sim_list = sorted(zip(other_users_id, sim_list), key=lambda x: x[1], reverse=True)
        return sim_list[:top_n]

    def _get_candidates_items(self, target_user_id):
        """
        Find all goods in source data and target_user did not meet before.
        """
        target_user_goods = set(self.frame[self.frame['user_id'] == target_user_id]['goods_id'])
        other_user_goods = set(self.frame[self.frame['user_id'] != target_user_id]['goods_id'])
        candidates_goods = list(target_user_goods ^ other_user_goods)
        return candidates_goods

    def _get_top_n_items(self, top_n_users, candidates_goods, top_n):
        """
        calculate interest of candidates movies and return top n movies.
        e.g. interest = sum(sim * normalize_rating)
        """
        top_n_user_data = [self.frame[self.frame['user_id'] == k] for k, _ in top_n_users]
        interest_list = []
        for good_id in candidates_goods:
            tmp = []
            for user_data in top_n_user_data:
                if good_id in user_data['goods_id'].values:
                    tmp.append(user_data[user_data['goods_id'] == good_id]['rate'].values[0]/5)
                else:
                    tmp.append(0)
            interest = sum([top_n_users[i][1] * tmp[i] for i in range(len(top_n_users))])
            interest_list.append((good_id, interest))
        interest_list = sorted(interest_list, key=lambda x: x[1], reverse=True)
        return interest_list[:top_n]

    def calculate(self, target_user_id=1, top_n=20):
        """
        user-cf for goods recommendation.
        """
        # most similar top n users
        top_n_users = self._get_top_n_users(target_user_id, top_n)
        # candidates goods for recommendation
        candidates_goods = self._get_candidates_items(target_user_id)
        # most interest top n goods
        top_n_goods = self._get_top_n_items(top_n_users, candidates_goods, top_n)
        return top_n_goods
		
		
		
def run(userID):
    assert os.path.exists('behaviour.csv'), \
        'File not exists in path, run preprocess.py before this.'
    print('Start..')
    start = time.time()
    goods = UserCf().calculate(userID)
    for good in goods:
        print(good)
    print('Cost time: %f' % (time.time() - start))
    print(type(goods))
    return goods
	

if __name__ == '__main__':
    run(1)

