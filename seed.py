from api_config import fetch_products, format_external_product
from models import db, Product

def seed_products():
    print("Starting product seeding process...")
    products_data = fetch_products()

    # Check if an error occurred while fetching products
    if isinstance(products_data, dict) and "Error" in products_data:
        print(f"Error fetching products: {products_data['Error']}")
        return

    print(f"Retrieved {len(products_data)} products from external API")

    # Loop through the products data and format each product
    added_count = 0
    for external_product in products_data:
        product_data = format_external_product(external_product)

        # Check if the product already exists in the database to avoid duplicates
        existing_product = Product.query.filter_by(id=product_data["id"]).first()
        if not existing_product:
            product = Product(
                id=product_data["id"],
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock=product_data["stock"],
                image_url=product_data["image_url"],
                category=product_data["category"]
            )
            db.session.add(product)
            added_count += 1

    # Commit the changes to the database
    try:
        db.session.commit()
        print(f"Products seeded successfully! Added {added_count} new products.")
    except Exception as e:
        db.session.rollback()
        print(f"Error committing to database: {str(e)}")

# This is the entry point for direct execution
if __name__ == "__main__":
    print("Seed script starting...")

    # Import app inside the main block to avoid circular imports
    from app import app

    # Create an application context before working with the database
    with app.app_context():
        seed_products()  

    print("Seed script completed.")
