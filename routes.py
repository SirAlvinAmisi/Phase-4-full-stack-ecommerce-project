
from flask import Blueprint, request, jsonify
from models import db, User, Product, Order, OrderItem, Cart, CartItem ,Payment, validate_order_data
from api_config import (
    fetch_products, fetch_product_by_id,
    fetch_product_by_category, fetch_all_categories,
    format_external_product
)
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


routes = Blueprint('routes', __name__)

@routes.route('/', methods=['GET'])
def home():
    return "Welcome to Ecommerce Database!"

@routes.route('/login', methods=['POST'])
def user_login():
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['email', 'password']):
        return jsonify({"error": "Missing email or password"}), 400
    
    # Find user
    user = User.query.filter_by(email=data['email'], is_active=True).first()
    
    # Verify user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({"error": "Account is inactive"}), 403
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username,
        "is_admin": user.is_admin
    }), 200

@routes.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['email', 'password']):
        return jsonify({"error": "Missing email or password"}), 400
    
    # Find admin user
    admin = User.query.filter_by(email=data['email'], is_admin=True).first()
    
    # Verify admin exists and password is correct
    if not admin or not admin.check_password(data['password']):  # Use the method
        return jsonify({"error": "Invalid admin credentials"}), 401
    
    # Create access token
    access_token = create_access_token(identity=admin.id)
    
    return jsonify({
        "message": "Admin login successful",
        "access_token": access_token,
        "admin_id": admin.id,
        "is_admin": True
        }),200

# Admin Product Management 
# Admin can trigger external products import.
@routes.route('/admin/products/import', methods=['POST'])
def import_external_products():
    external_products = fetch_products() 
    if isinstance(external_products, dict) and "Error" in external_products:
        return jsonify(external_products), 500

 # Import each external product
    for external_product in external_products:
        formatted_product = format_external_product(external_product)
        
# Check if the product already exists based on its ID
        existing_product = Product.query.filter_by(id=formatted_product["id"]).first()
        if not existing_product:
            product = Product(
                id=formatted_product["id"],
                name=formatted_product["name"],
                description=formatted_product["description"],
                price=formatted_product["price"],
                stock=formatted_product["stock"],
                image_url=formatted_product["image_url"],
                category=formatted_product["category"],
                is_active=True
            )
            db.session.add(product)
        else:
 # Optionally update existing products if needed (e.g., stock)
            existing_product.stock += formatted_product["stock"]
            db.session.commit()

    db.session.commit()
    return jsonify({"message": f"{len(external_products)} products imported successfully."}), 200
# Admin adds a new product
@routes.route('/admin/products', methods=['POST'])
def add_product():
    data = request.get_json()

# Validate required fields
    if not all(key in data for key in ['name', 'description', 'price', 'stock', 'image_url', 'category']):
        return jsonify({"Error": "Missing required fields"}), 400

    try:
# Create a new product from the data provided
        new_product = Product(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            stock=data['stock'],
            image_url=data['image_url'],
            category=data['category'],
            is_active=True
        )
        
        # Add the new product to the database
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

#Admin views all products
@routes.route('/admin/products', methods=['GET'])
def admin_get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])


#Admin updates an existing product
@routes.route('/admin/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json

# Update product fields
    for field in ['name', 'description', 'price', 'stock', 'image_url', 'category']:
        if field in data:
            setattr(product, field, data[field])

    db.session.commit()
    return jsonify(product.to_dict())

# Admin deletes a product
@routes.route('/admin/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

# User View Products
@routes.route('/products', methods=['GET'])
def list_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

# User views a single product by ID
@routes.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

# User views products by category
@routes.route('/products/category/<string:category>', methods=['GET'])
def get_products_by_category(category):
    products = fetch_product_by_category(category)
    return jsonify(products)

# User Cart Management 
@routes.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('user_id')
    cart = Cart.query.filter_by(user_id=user_id).first()
    if cart:
        return jsonify([item.to_dict() for item in cart.items])
    return jsonify({"message": "Cart is empty."})

# User adds a product to their cart
@routes.route('/cart', methods=['POST'])
def add_to_cart():
    user_id = request.json.get('user_id')
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)

    product = Product.query.get_or_404(product_id)
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product.id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Product added to cart."})

# User removes a product from their cart
@routes.route('/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Product removed from cart."})

# User Order Management 
@routes.route('/orders', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id')
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([order.to_dict() for order in orders])

# User creates a new order
@routes.route('/orders', methods=['POST'])
def create_order():
    order_data = request.json
    validation_error = validate_order_data(order_data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    order = Order(
        user_id=order_data['user_id'],
        status='Pending',
        total_amount=order_data['total_amount'],
        shipping_address=order_data['shipping_address'],
        payment_method=order_data['payment_method']
    )
    db.session.add(order)
    db.session.commit()

# Add order items
    for item in order_data['items']:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity']
        )
        db.session.add(order_item)

    db.session.commit()
    return jsonify(order.to_dict()), 201

# Admin updates the status of an order
@routes.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get_or_404(id)
    data = request.json

# Update order status
    if 'status' in data:
        status_error = Order.validate_status(data['status'])
        if status_error:
            return jsonify({"error": status_error}), 400
        order.status = data['status']

    db.session.commit()
    return jsonify(order.to_dict())

# Admin cancels and deletes an order
@routes.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get_or_404(id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order cancelled and deleted."})

# Admin User Management
# Admin views all users
@routes.route('/admin/users', methods=['GET'])
def admin_get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# Admin views a single user by ID
@routes.route('/admin/users/<int:id>', methods=['GET'])
def admin_get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

# Admin updates user details
@routes.route('/admin/users/<int:id>', methods=['PUT'])
def admin_update_user(id):
    user = User.query.get_or_404(id)
    data = request.json
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    if 'is_active' in data:
        user.is_active = data['is_active']

    db.session.commit()
    return jsonify(user.to_dict())

# Admin deletes a user
@routes.route('/admin/users/<int:id>', methods=['DELETE'])
def admin_delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})


# Admin views all payments
@routes.route('/admin/payments', methods=['GET'])
def admin_get_payments():
    payments = Payment.query.all()
    return jsonify([payment.to_dict() for payment in payments])
                    
@routes.route('/admin/payments/<int:id>', methods=['GET'])
def admin_get_payment(id):
    payment = Payment.query.get_or_404(id)
    return jsonify(payment.to_dict())

# Admin updates payment status
@routes.route('/admin/payments/<int:id>', methods=['PUT'])
def update_payment_status(id):
    payment = Payment.query.get_or_404(id)
    data = request.json

    if 'status' in data:
        payment.status = data['status']

    db.session.commit()
    return jsonify(payment.to_dict())
                    



