

EXTERNAL_PRODUCTS_URL = "https://fakestoreapi.com/products"

import requests
from flask import jsonify



# Fetch products from external API
def fetch_products():
    try:
        response = requests.get(EXTERNAL_PRODUCTS_URL)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return {"Error": str(e)}

# Fetch a single product by id from external API
def fetch_product_by_id(product_id):
    try:
        response = requests.get(f"{EXTERNAL_PRODUCTS_URL}/{product_id}")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching product {product_id}: {str(e)}")
        return {"Error": str(e)}

# Fetch all categories from the external API
def fetch_all_categories():
    try:
        response = requests.get(f"{EXTERNAL_PRODUCTS_URL}/categories")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")
        return {"Error": str(e)}

# Fetch products by category
def fetch_product_by_category(category):
    try:
        response = requests.get(f"{EXTERNAL_PRODUCTS_URL}/category/{category}")
        response.raise_for_status()  
        return response.json()
    except Exception as e:
        print(f"Error fetching products for category {category}: {str(e)}")
        return {"Error": str(e)}

# Convert external products format to our internal format
def format_external_product(external_product):
    return {
        "id": external_product["id"],
        "name": external_product["title"],
        "description": external_product["description"],
        "price": external_product["price"],
        "stock": 100, 
        "image_url": external_product["image"],
        "category": external_product["category"]
    }