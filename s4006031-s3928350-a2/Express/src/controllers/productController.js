const db = require("../database/index.js");

const vegetables = [
  { id: 1, name: "Carrots", price: 2.99, imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "Potato", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Tomato", price: 0.99, imageUrl: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: "Onions", price: 1.49, imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5, name: "Broccoli", price: 3.49, imageUrl: "https://images.unsplash.com/photo-1606585333304-a7fa1ca4376c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "Mushroom", price: 2.79, imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 7, name: "Lettuce", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 8, name: "Capsicum", price: 2.49, imageUrl: "https://images.unsplash.com/photo-1518736114810-3f3bedfec66a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 9, name: "Pumpkin", price: 4.99, imageUrl: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 10, name: "Zucchini", price: 3.29, imageUrl: "https://plus.unsplash.com/premium_photo-1675731118529-ba445c5c8d9a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 11, name: "Celery", price: 1.79, imageUrl: "https://images.unsplash.com/photo-1708436477404-1eb3b584b2b4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

const specialDeals = [
  { product_id: 1, name: "Carrots", price: 1.49, imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 2, name: "Potato", price: 0.99, imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 3, name: "Tomato", price: 0.45, imageUrl: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 4, name: "Onions", price: 0.75, imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 5, name: "Broccoli", price: 1.75, imageUrl: "https://images.unsplash.com/photo-1606585333304-a7fa1ca4376c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 6, name: "Mushroom", price: 1.40, imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 7, name: "Lettuce", price: 0.99, imageUrl: "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 8, name: "Capsicum", price: 1.25, imageUrl: "https://images.unsplash.com/photo-1518736114810-3f3bedfec66a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 9, name: "Pumpkin", price: 2.49, imageUrl: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 10, name: "Zucchini", price: 1.64, imageUrl: "https://plus.unsplash.com/premium_photo-1675731118529-ba445c5c8d9a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { product_id: 11, name: "Celery", price: 0.89, imageUrl: "https://images.unsplash.com/photo-1708436477404-1eb3b584b2b4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];


exports.populateDatabase = async () => {
  try {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

    // Drop tables in the correct order
    await db.sequelize.getQueryInterface().dropTable('follows');
    await db.sequelize.getQueryInterface().dropTable('carts');
    await db.sequelize.getQueryInterface().dropTable('reviews');
    await db.sequelize.getQueryInterface().dropTable('products');

    await db.sequelize.sync({ force: true });

    await db.product.bulkCreate(vegetables);
    await db.specialDeal.bulkCreate(specialDeals);
    console.log("Database populated!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.setSpecialDeals = async (req, res) => {
  try {
    const { specialDeals } = req.body;
    console.log("Received special deals to set:", specialDeals);

    await db.specialDeal.destroy({ where: {} });
    console.log("Existing special deals cleared.");

    await db.specialDeal.bulkCreate(specialDeals);
    console.log("Special deals successfully stored in database:", specialDeals);

    res.json({ message: "Special deals updated!" });
  } catch (error) {
    console.error("Error setting special deals:", error);
    res.status(500).json({ error: "Failed to set special deals", details: error.message });
  }
};

exports.getSpecialDeals = async (req, res) => {
  try {
    const specialDeals = await db.specialDeal.findAll();
    res.json(specialDeals || []);
  } catch (error) {
    console.error("Error fetching special deals:", error);
    res.status(500).json({ error: "Failed to fetch special deals" });
  }
};

exports.getProductById = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await db.product.create(req.body);
  res.json(product);
};

exports.updateSpecialPrices = async (req, res) => {
  try {
    const { specialPrices } = req.body;

    // Revert previous special prices to their original prices
    await db.product.update({ 
      price: db.Sequelize.literal('CASE WHEN special_price IS NOT NULL THEN price ELSE price END'),
      special_price: null 
    }, {
      where: {
        special_price: { [db.Sequelize.Op.ne]: null }
      }
    });

    // Set new special prices
    await Promise.all(specialPrices.map(async ({ product_id, special_price }) => {
      await db.product.update({ special_price }, { where: { id: product_id } });
    }));

    res.json({ message: "Special prices updated!" });
  } catch (error) {
    console.error("Error updating special prices:", error);
    res.status(500).json({ error: "Failed to update special prices" });
  }
};

