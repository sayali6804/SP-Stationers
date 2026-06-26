import json
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

class HybridRecommender:
    def __init__(self):
        self.products = pd.read_json('data/products.json')
        self.orders = pd.read_json('data/orders.json')
        self.product_matrix = None
        self.content_similarity = None
        self.collab_similarity = None
        self._prepare_models()

    def _prepare_models(self):
        # --- Content-Based Model ---
        self.products['combined'] = self.products['category'].fillna('') + ' ' + \
                                    self.products['brand'].fillna('') + ' ' + \
                                    self.products['features'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')

        tfidf = TfidfVectorizer(stop_words='english')
        self.product_matrix = tfidf.fit_transform(self.products['combined'])
        self.content_similarity = cosine_similarity(self.product_matrix)

        # --- Collaborative Model ---
        orders = []
        for order in self.orders.to_dict(orient='records'):
            for item in order['products']:
                orders.append({
                    'user_id': order['_id']['$oid'],
                    'product_id': item['product']['$oid'],
                    'quantity': item['quantity']
                })

        order_df = pd.DataFrame(orders)
        user_product_matrix = order_df.pivot_table(index='user_id', columns='product_id', values='quantity', fill_value=0)
        self.collab_similarity = cosine_similarity(user_product_matrix.T)
        self.collab_sim_df = pd.DataFrame(self.collab_similarity, 
                                          index=user_product_matrix.columns,
                                          columns=user_product_matrix.columns)

    def get_recommendations(self, user_id=None, product_id=None, top_n=5):
        if not user_id and not product_id:
            raise ValueError("Either user_id or product_id must be provided.")
        
        scores = {}

        if product_id:
            try:
                idx = self.products[self.products['_id'].apply(lambda x: x['$oid']) == product_id].index[0]
                sim_scores = list(enumerate(self.content_similarity[idx]))
                sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
                content_based = [self.products.iloc[i]['_id']['$oid'] for i, _ in sim_scores]
            except Exception as e:
                print(f"Error in content-based recommendation: {e}")
                content_based = []
        else:
            content_based = []

        if user_id:
            user_orders = self.orders[self.orders['_id'].apply(lambda x: x['$oid']) == user_id]
            purchased_ids = []
            for order in user_orders['products']:
                for item in order:
                    purchased_ids.append(item['product']['$oid'])

            collab_scores = {}
            for pid in purchased_ids:
                if pid in self.collab_sim_df:
                    similar_items = self.collab_sim_df[pid].sort_values(ascending=False)[1:top_n+1]
                    for sim_pid, score in similar_items.items():
                        collab_scores[sim_pid] = collab_scores.get(sim_pid, 0) + score

            collab_based = sorted(collab_scores, key=collab_scores.get, reverse=True)[:top_n]
        else:
            collab_based = []

        # Merge results
        final_recommendations = list(set(content_based + collab_based))
        return final_recommendations
