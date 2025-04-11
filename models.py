from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re
import json
import requests


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')
    cart = db.relationship('Cart', backref='user', uselist=False, lazy=True, cascade='all, delete-orphan')

    #serialization
    def to_dict(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,
            "is_admin" : self.is_admin,
            "is_active" : self.is_active
        }
    
    #check if the password given matches the stored hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    # hash the password before saving
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

#user validations

def validate_username(username):
    if not username or len(username) < 3:
        return "Username must be atleast 3 characters long!"
    return None

def validate_email(email):
    if not email:
        return "Email is required"
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    if not re.match(email_regex, email):
        return "Invalid email format!"
    if User.query.filter_by(email=email).first():
        return "Email address already exists!"
    return None

def validate_password(password):
    if len(password) < 6:
        return "Password must be atleast 6 characters long!"

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500))

    category = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart_items = db.relationship('CartItem', backref='product', lazy=True) 
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    #product serialization
    def to_dict(self):
        return {
            "id" : self.id,
            "name" : self.name,
            "description" : self.description,
            "price" : self.price,
            "stock" : self.stock,
            "image_url" : self.image_url,
            "category": self.category,
            "is_active": self.is_active
        }

#product validation

def validate_product_name(name):
    if not name or len(name) < 2:
        return "Product name cannot be less than 2 characters!"
    return None

def validate_price(price):
    if price <= 0:
        return "Product price must be greater than 0!"
    return None

def validate_stock(stock):
    if stock < 0:
        return "Stock cannot be negative!"
    return None

def validate_image(image_url):
    if image_url and not re.match(r"^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*$", image_url):
        return "Invalid image URL format."
    return None

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    total_amount = db.Column(db.Float, nullable=False)
    shipping_address = db.Column(db.String(255), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)

    items = db.relationship('OrderItem', backref='order', lazy=True)
    

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "total_amount": self.total_amount,
            "shipping_address": self.shipping_address,
            "payment_method": self.payment_method,
            "items": [item.to_dict() for item in self.items]  
        }
    
    
    # validate the order state
    @staticmethod
    def validate_status(status):
        valid_statuses = ["Completed", "Pending", "Shipped", "Cancelled"]
        if status not in valid_statuses:
            return f"Invalid status. Valid statuses are, {', '.join(valid_statuses)}"
        return None

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)
    product_info = db.Column(db.String, nullable=True)

    #serialization
    def to_dict(self):
        return {
            "id" : self.id,
            "order_id" : self.order_id,
            "product_id" : self.product_id,
            "quantity" : self.quantity
        }
    # Set product info as JSON
    def set_product_info(self, product_data):
        self.product_info = json.dumps(product_data)
    
    # Get product info as Python dict
    def get_product_info(self):
        return json.loads(self.product_info) if self.product_info else {}
    

def validate_order_data(order_data):
    if 'user_id' not in order_data or not isinstance(order_data['user_id'], int):
        return "User ID is required and must be an integer."
    
    # Validate order status
    status_error = Order.validate_status(order_data.get('status', 'pending'))
    if status_error:
        return status_error
    if 'items' not in order_data or not isinstance(order_data['items'], list):
        return "Order items must be a list."
    
    return None

class Cart(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

class CartItem(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)


from datetime import datetime
from sqlalchemy.orm import validates
from models import db

class Payment(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    payment_method = db.Column(db.String(50))
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_id = db.Column(db.String(100), unique=True)  # Optional uniqueness

    # Relationships
    order = db.relationship('Order', backref=db.backref('payments', lazy=True))
    user = db.relationship('User', backref=db.backref('payments', lazy=True))

    # Valid choices
    VALID_STATUSES = {'Pending', 'Completed', 'Failed'}
    VALID_METHODS = {'Credit Card', 'Paypal', 'Stripe', 'Bank Transfer'}

  #validate payments
def validate_amount(self, key, value):
    if value <= 0:
        raise ValueError("Amount must be greater than 0")
    return value

   
def validate_status(self, key, value):
    if value not in self.VALID_STATUSES:
        raise ValueError(f"Invalid status '{value}'. Must be one of {self.VALID_STATUSES}")
    return value

    
def validate_method(self, key, value):
    if value and value not in self.VALID_METHODS:
        raise ValueError(f"Invalid payment method '{value}'. Must be one of {self.VALID_METHODS}")
    return value

def to_dict(self):
    return {
            'id': self.id,
            'order_id': self.order_id,
            'user_id': self.user_id,
            'amount': self.amount,
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_date': self.payment_date,
            'transaction_id': self.transaction_id
        }






#     🧑‍💼 User & Roles
# is_admin is a boolean — ✅ okay for now, but consider a role string if you want more roles in the future (e.g., staff, moderator).

# is_active, created_at, and updated_at are present — ✅

# Password hashing and checking are implemented — ✅

# Cart and Order relationships are wired — ✅

# 🛒 Cart System
# Cart and CartItem models are included and correctly related to User and Product — ✅

# Cascade delete behavior is in place — ✅

# 📦 Products
# Fields: name, description, price, stock, image_url, category, is_active, timestamps — ✅

# Relationships with OrderItem and CartItem — ✅

# Validation functions for all major product fields — ✅

# 🧾 Orders
# Order has user relation, status, total amount, shipping address, payment method — ✅

# Validation for order status and input format — ✅

# OrderItem serialization and embedded product info — ✅

# 🧪 Extras
# to_dict() methods across models — great for JSON API responses — ✅

# Input validation is modular and easy to expand — ✅