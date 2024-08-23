import torch
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
import intel_extension_for_pytorch as ipex

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import datetime as dt
from typing import List, Union, Dict
from sqlalchemy import URL
from sqlalchemy import create_engine
import psycopg2


# App Config
app = Flask(__name__)
cors = CORS(app, origins="*")

#DB Embeddings Connection
def get_db_connection():
    conn = psycopg2.connect(
         host="localhost",
         port="5432",
         database="vector_db2",
         user="postgres",
         password="Pajam756@"
    )
    return conn

def calc_feasibility(
    buyers: int, 
    impressions: int,
    frequency: int, 
    days_campaign: int
    ) -> Dict[int, float]:
    
    """
    This function calculates the feasibility of a campaign based on the number of buyers, impressions, frequency and days of the campaign.

    Returns:
    - Reach: Total number of unique people who will be exposed during the campaign
    - Reach (%) Households: Percentage of households reached
    - Estimated Buyers: Estimated number of buyers during the campaign
    - Estimated Exposed Buyers (Monthly): Estimated number of buyers exposed to the ad monthly
    - Estimated Exposed Buyers (Quarterly): Estimated number of buyers exposed to the ad quarterly
    - Estimated Exposed Buyers (During Campaign): Estimated number of buyers exposed to the ad during the campaign
    - Penetration: Estimated penetration of the product
    - Campaign Feasibility: Whether the campaign is feasible or not
    """
    
    households = 120000000
    panel_size = 15000000
    sample_universe = 200000
    
    reach = round(impressions / frequency, 0)
    reach_households = (reach / households)
    estimated_buyers = ((buyers/6) / sample_universe) * panel_size
    estimated_exposed_buyers_monthly = estimated_buyers * reach_households
    estimated_exposed_buyers_quarterly = estimated_exposed_buyers_monthly * 3
    estimated_exposed_buyers_during_campaign = (estimated_exposed_buyers_monthly * days_campaign)/30
    penetration_monthly_pct = ((buyers/6) / sample_universe)
    
    feasible = estimated_exposed_buyers_during_campaign > 100
    
    return {
        "Reach": round(reach, 2),
        "Reach (%) Households": reach_households*100,
        "Estimated Buyers": round(estimated_buyers, 1),
        "Estimated Exposed Buyers (Monthly)": round(estimated_exposed_buyers_monthly, 1) ,
        "Estimated Exposed Buyers (Quarterly)": round(estimated_exposed_buyers_quarterly, 1),
        "Estimated Exposed Buyers (During Campaign)": round(estimated_exposed_buyers_during_campaign, 1),
        "Penetration": penetration_monthly_pct*6*100,
        "Penetration (Monthly)": penetration_monthly_pct*100,
        "Campaign Feasibility": "Feasible" if feasible else "No Feasible"
    }

dtype=torch.float32
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2').to('xpu')

def encode(text):
    if not text:
        raise ValueError("The input text is empty.")
    encoded_input = tokenizer(
        text, padding=True, truncation=True, return_tensors='pt').to('xpu')

    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)

    # Perform pooling. In this case, max pooling.
    sentence_embeddings = mean_pooling(
        model_output, encoded_input['attention_mask'])
    #sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)

    return sentence_embeddings.tolist()[0]

#Models
#model = pickle.load(open('./models/feasibilityModel.pkl', 'rb'))

@app.route('/api/users', methods=['GET'])
def users():
    return jsonify({
        "users": [
            'alice',
            'bob',
            'charlie'
        ]
    })  

@app.route('/feasibilityCalculate/', methods=['GET'])
def feasibilityCalculate():
    if request.method == 'GET':
        PARAM_CAMPAIGN_START = request.args.get('campaignStart')
        PARAM_CAMPAIGN_END = request.args.get('campaignEnd')
        CAMPAIGN_START = dt.datetime.strptime(PARAM_CAMPAIGN_START, '%Y-%m-%d')
        CAMPAIGN_END = dt.datetime.strptime(PARAM_CAMPAIGN_END, '%Y-%m-%d')
        PARAM_DAYS_CAMPAIGN = int((CAMPAIGN_END - CAMPAIGN_START).days)
        PARAM_BUYERS = int(request.args.get('buyers'))
        PARAM_IMPRESSIONS = int(request.args.get('impressions'))
        PARAM_FREQUENCY = int(request.args.get('frequency'))

        parameters = [PARAM_BUYERS, PARAM_IMPRESSIONS, PARAM_FREQUENCY, PARAM_DAYS_CAMPAIGN]
        prediction = calc_feasibility(*parameters)
    
        return jsonify(prediction)

@app.route('/EmbeddingsDB/', methods=['GET'])
def retrieveEmbeddings():
    if request.method == 'GET':
        conn = get_db_connection()
        '''
        engine = create_engine(url_object, echo=True)
        query = """
            SELECT * from receiptsales
               """
        df_query = pd.read_sql(query,con=engine)
        '''
        cur = conn.cursor()
        query = """
        SELECT 
            user_id, 
            item_description,
            item_description_raw,
            item_barcode,
            product_number_raw,
            barcode_brand, 
            capture_brand,
            retailer_banner,
            real_company,
            store_name,
            barcode_category_1,
            barcode_category_2,
            barcode_category_3
        FROM public.receiptsales
        """
        cur.execute(query)
        rows = cur.fetchall()
        column_names = [i[0] for i in cur.description]
        embeddings = [dict(zip(column_names, row)) for row in rows]
        cur.close()
        conn.close()
        return jsonify({'embeddings': embeddings})


def retrieveProductEmbeddingFirst():
    if request.method == 'GET':
        conn = get_db_connection()    
        #values = "HOT DOH"
        # Extract array of values
        # Extract the array of values from the request
        values = request.args.getlist('itemDescriptionValue[]')  # Use the correct key with brackets
        print('Received raw values:', request.args)  # Debugging output
        print('Received values (Item Description):', values)  # Debugging output
        
        
        if not values:
            return jsonify({'error': 'The input text is empty'}), 400
        
        # Convert the list of values to a comma-separated string
        values_str = ', '.join(values)
        print('Concatenated values:', values_str)  # Debugging output
        vec = encode(text=values_str)  # Ensure vec is in the correct format for your DB query
        cur = conn.cursor()
        query = f"""
            WITH first_search AS (
                SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                FROM receiptsales 
                WHERE cosine_distance(receiptsales.item_description_embedding, ARRAY{vec}::vector) < 0.22
                ORDER BY receiptsales.item_description_embedding <=> ARRAY{vec}::vector 
            ),
            second_search AS (
                SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                FROM receiptsales
                WHERE item_description_raw IN (SELECT item_description_raw FROM first_search WHERE item_description_raw IS NOT NULL AND item_description_raw != 'NULLS')
            ),
            third_search AS (
                SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                FROM receiptsales
                WHERE item_barcode IN (SELECT item_barcode FROM first_search WHERE item_barcode IS NOT NULL AND item_barcode != 'NULLS')
            ),
            fourth_search AS (
                SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                FROM receiptsales
                WHERE product_number_raw IN (SELECT product_number_raw FROM first_search WHERE product_number_raw IS NOT NULL AND product_number_raw != 'NULLS')
            )
            SELECT * FROM first_search
            UNION
            SELECT * FROM second_search
            UNION
            SELECT * FROM third_search
            UNION
            SELECT * FROM fourth_search
            """
        cur.execute(query)        
        rows = cur.fetchall()
        column_names = [i[0] for i in cur.description]
        results = [dict(zip(column_names, row)) for row in rows]
        #print(f'Query results: {results}')
        cur.close()
        conn.close()
        return jsonify({'query_product_embedded_results': results})
    
@app.route('/productQueryFinder/', methods=['GET'])
def retrieveProductEmbedding():
    if request.method == 'GET':
        conn = get_db_connection()    
        
        # Extract the array of values from the request
        
        print('Received raw values:', request.args)  # Debugging output
        if 'itemDescriptionValue[]' in request.args:
            '''
            DEBUGGING ITEM DESCRIPTIONS
            '''
            values = request.args.getlist('itemDescriptionValue[]')
            print('Received values (Item Description):', values) 
        else:
            print('itemDescriptionValue[] not found in request args')
        
        if 'itemBarcodeValue[]' in request.args:
            '''
            DEBUGGING ITEM BARCODES
            '''
            valuesBarcode = request.args.getlist('itemBarcodeValue[]')
            print('Received values (Item Barcode):', valuesBarcode) 
        else:
            print('itemBarcodeValue[] not found in request args')
 
        firstIsChecked = request.args.get('firstIsChecked')
        print('First Is Checked:', firstIsChecked)
        
        #if not values:
            #return jsonify({'error': 'The input text (Item Description) is empty'}), 400
        
        combined_results = []
        combined_results_barcodes = []# This will hold the combined results from all queries
        
        if 'itemDescriptionValue[]' in request.args and 'itemBarcodeValue[]' not in request.args:
            for value in values:
                vec = encode(text=value)
                cur = conn.cursor()
                query = f"""
                    WITH first_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales 
                        WHERE cosine_distance(receiptsales.item_description_embedding, ARRAY{vec}::vector) < 0.22
                        ORDER BY receiptsales.item_description_embedding <=> ARRAY{vec}::vector 
                    ),
                    second_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales
                        WHERE item_description_raw IN (SELECT item_description_raw FROM first_search WHERE item_description_raw IS NOT NULL AND item_description_raw != 'NULLS')
                    ),
                    third_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales
                        WHERE item_barcode IN (SELECT item_barcode FROM first_search WHERE item_barcode IS NOT NULL AND item_barcode != 'NULLS')
                    ),
                    fourth_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales
                        WHERE product_number_raw IN (SELECT product_number_raw FROM first_search WHERE product_number_raw IS NOT NULL AND product_number_raw != 'NULLS')
                    )
                    SELECT * FROM first_search
                    UNION
                    SELECT * FROM second_search
                    UNION
                    SELECT * FROM third_search
                    UNION
                    SELECT * FROM fourth_search
                    """
                cur.execute(query)        
                rows = cur.fetchall()
                column_names = [i[0] for i in cur.description]
                results = [dict(zip(column_names, row)) for row in rows]
                
                combined_results.extend(results)  # Add the results of this query to the combined results
                cur.close()
            
            conn.close()
            return jsonify({'query_product_embedded_results': combined_results})    
        
        if 'itemBarcodeValue[]' in request.args and 'itemDescriptionValue[]' not in request.args:
            item_barcodes_list = []
            for i in valuesBarcode:
                i = str(i)
                if len(i) == 12:
                    i = list(i)
                    i[0] = '%'
                    i[11] = '%'
                    i = ''.join(i)
                    item_barcodes_list.append(i)
                elif len(i) == 10: 
                    i = '%' + i + '%'
                    item_barcodes_list.append(i)
                else:
                    item_barcodes_list.append(i)
        

            cur = conn.cursor()
            query = f"""
                    WITH first_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales 
                        WHERE TRUE AND (
                               item_barcode ILIKE ANY(ARRAY{item_barcodes_list})
                            OR product_number_raw ILIKE ANY(ARRAY{item_barcodes_list})
                        )
                    ),
                    second_search AS (
                        SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                        FROM receiptsales
                        WHERE item_description_raw IN (SELECT item_description_raw FROM first_search WHERE item_description_raw IS NOT NULL AND item_description_raw != 'NULLS')
                    )

                    SELECT * FROM first_search
                    UNION
                    SELECT * FROM second_search
                    """
            cur.execute(query)        
            rows = cur.fetchall()
            column_names = [i[0] for i in cur.description]
            results = [dict(zip(column_names, row)) for row in rows]
                
            combined_results.extend(results)  # Add the results of this query to the combined results
            cur.close()
            conn.close()
            
            return jsonify({'query_product_embedded_results': combined_results})
        
        if firstIsChecked == 'false' and 'itemBarcodeValue[]' in request.args and 'itemDescriptionValue[]' in request.args:
            # OR OPERATOR
            item_barcodes_list = []
            for i in valuesBarcode:
                i = str(i)
                if len(i) == 12:
                    i = list(i)
                    i[0] = '%'
                    i[11] = '%'
                    i = ''.join(i)
                    item_barcodes_list.append(i)
                elif len(i) == 10: 
                    i = '%' + i + '%'
                    item_barcodes_list.append(i)
                else:
                    item_barcodes_list.append(i)
                    
            for value in values:
                vec = encode(text=value)
                cur = conn.cursor()
                query = f"""
                        WITH embedding_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales 
                            WHERE cosine_distance(receiptsales.item_description_embedding, ARRAY{vec}::vector) < 0.22
                            ORDER BY receiptsales.item_description_embedding <=> ARRAY{vec}::vector 
                        ),
                        barcode_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales 
                            WHERE 
                                item_barcode ILIKE ANY(ARRAY{item_barcodes_list}) 
                                OR product_number_raw ILIKE ANY(ARRAY{item_barcodes_list})
                        ),
                        combined_search AS (
                            SELECT * FROM embedding_search
                            UNION
                            SELECT * FROM barcode_search
                        ),
                        second_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE item_description_raw IN (
                                SELECT item_description_raw 
                                FROM combined_search 
                                WHERE item_description_raw IS NOT NULL AND item_description_raw != 'NULLS'
                            )
                        ),
                        third_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE item_barcode IN (
                                SELECT item_barcode 
                                FROM combined_search 
                                WHERE item_barcode IS NOT NULL AND item_barcode != 'NULLS'
                            )
                        ),
                        fourth_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE product_number_raw IN (
                                SELECT product_number_raw 
                                FROM combined_search 
                                WHERE product_number_raw IS NOT NULL AND product_number_raw != 'NULLS'
                            )
                        )
                        SELECT * FROM combined_search
                        UNION
                        SELECT * FROM second_search
                        UNION
                        SELECT * FROM third_search
                        UNION
                        SELECT * FROM fourth_search
                        """
                cur.execute(query)        
                rows = cur.fetchall()
                column_names = [i[0] for i in cur.description]
                results = [dict(zip(column_names, row)) for row in rows]
                
                combined_results.extend(results)
                cur.close()
                conn.close()
            
            return jsonify({'query_product_embedded_results': combined_results})
        
        if firstIsChecked == 'true' and 'itemBarcodeValue[]' in request.args and 'itemDescriptionValue[]' in request.args:
            # AND OPERATOR
            item_barcodes_list = []
            for i in valuesBarcode:
                i = str(i)
                if len(i) == 12:
                    i = list(i)
                    i[0] = '%'
                    i[11] = '%'
                    i = ''.join(i)
                    item_barcodes_list.append(i)
                elif len(i) == 10: 
                    i = '%' + i + '%'
                    item_barcodes_list.append(i)
                else:
                    item_barcodes_list.append(i)
                    
            for value in values:
                vec = encode(text=value)
                cur = conn.cursor()
                query = f"""
                        WITH first_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales 
                            WHERE cosine_distance(receiptsales.item_description_embedding, ARRAY{vec}::vector) < 0.22
                            ORDER BY receiptsales.item_description_embedding <=> ARRAY{vec}::vector 
                        ),
                        filtered_first_search AS (
                            SELECT fs.*
                            FROM first_search fs
                            JOIN (
                                SELECT item_barcode, product_number_raw
                                FROM receiptsales 
                                WHERE 
                                    item_barcode ILIKE ANY(ARRAY{item_barcodes_list}) 
                                    OR product_number_raw ILIKE ANY(ARRAY{item_barcodes_list})
                            ) fb
                            ON fs.item_barcode = fb.item_barcode
                            OR fs.product_number_raw = fb.product_number_raw
                        ),
                        second_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE item_description_raw IN (
                                SELECT item_description_raw 
                                FROM filtered_first_search 
                                WHERE item_description_raw IS NOT NULL AND item_description_raw != 'NULLS'
                            )
                        ),
                        third_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE item_barcode IN (
                                SELECT item_barcode 
                                FROM filtered_first_search 
                                WHERE item_barcode IS NOT NULL AND item_barcode != 'NULLS'
                            )
                        ),
                        fourth_search AS (
                            SELECT receipt_id, user_id, item_description, item_description_raw, item_barcode, product_number_raw
                            FROM receiptsales
                            WHERE product_number_raw IN (
                                SELECT product_number_raw 
                                FROM filtered_first_search 
                                WHERE product_number_raw IS NOT NULL AND product_number_raw != 'NULLS'
                            )
                        )
                        SELECT * FROM filtered_first_search
                        UNION
                        SELECT * FROM second_search
                        UNION
                        SELECT * FROM third_search
                        UNION
                        SELECT * FROM fourth_search
                    """
                cur.execute(query)        
                rows = cur.fetchall()
                column_names = [i[0] for i in cur.description]
                results = [dict(zip(column_names, row)) for row in rows]
                
                combined_results.extend(results)
                cur.close()
                conn.close()
            
            return jsonify({'query_product_embedded_results': combined_results})
        
        

@app.route('/data', methods=['GET'])
def get_data():
    data = [
        {'name': 'John Doe', 'age': 32, 'city': 'New York'},
        {'name': 'Jane Doe', 'age': 27, 'city': 'London'},
        {'name': 'Jim Smith', 'age': 45, 'city': 'Paris'},
    ]
    return jsonify({'data': data})

if __name__ =="__main__":
    app.run(debug=True, port=8080)


