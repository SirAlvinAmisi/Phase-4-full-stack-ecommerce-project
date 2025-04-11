from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db
from routes import routes
from seed import seed_products 
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'QpB8XrjvYjUHoM5v8nlf2fRMFvYgYxG5VtzqYqTAVv0' 
jwt =JWTManager(app)
# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Create tables on first run
with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(routes)

# Create custom CLI command to seed the database
@app.cli.command('seed')
def seed():
    """Seed the database with products from the external API."""
    from app import app  # Import here to avoid circular imports
    with app.app_context():
        seed_products()  # Call the seeder function
    print("Database seeded successfully!")

if __name__ == '__main__':
    app.run(debug=True)
