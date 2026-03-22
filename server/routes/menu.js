const express  = require("express");
const MenuItem = require("../models/MenuItem");
const { protect } = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");

const router = express.Router();

// Public — get all menu items grouped by category
router.get("/", async (req, res, next) => {
  try {
    const items = await MenuItem.find({ available: true }).sort("category name");
    const grouped = { breakfast: [], lunch: [], dinner: [] };
    items.forEach(item => grouped[item.category]?.push(item));
    res.json({ success: true, menu: grouped });
  } catch (err) { next(err); }
});

// Admin — create item with optional image upload OR image URL
router.post("/", protect, upload.single("image"), async (req, res, next) => {
  try {
    const { name, desc, price, category, tag, img, imageUrl } = req.body;
    const item = await MenuItem.create({
      name, desc, price: Number(price), category, tag, img,
      imageUrl: req.file?.path || imageUrl || "",
      imageId:  req.file?.filename || "",
    });
    res.status(201).json({ success: true, item });
  } catch (err) { next(err); }
});

// Admin — update item with optional image upload OR image URL
router.put("/:id", protect, upload.single("image"), async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // If new file uploaded, delete old from Cloudinary
    if (req.file && item.imageId) await cloudinary.uploader.destroy(item.imageId);

    const updates = { ...req.body, price: Number(req.body.price) };

    if (req.file) {
      // File upload takes priority
      updates.imageUrl = req.file.path;
      updates.imageId  = req.file.filename;
    } else if (req.body.imageUrl !== undefined) {
      // URL provided
      updates.imageUrl = req.body.imageUrl;
    }

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    );
    res.json({ success: true, item: updated });
  } catch (err) { next(err); }
});

// Admin — delete item
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (item.imageId) await cloudinary.uploader.destroy(item.imageId);
    await item.deleteOne();
    res.json({ success: true, message: "Item deleted" });
  } catch (err) { next(err); }
});

// Admin — seed menu (run once)
router.post("/seed", protect, async (req, res, next) => {
  try {
    const count = await MenuItem.countDocuments();
    if (count > 0) return res.json({ success: false, message: "Menu already seeded" });
    const items = [
      { name:"Avocado Toast",           desc:"Sourdough, smashed avocado, poached eggs, chilli flakes",   price:14, category:"breakfast", tag:"Popular",    img:"🥑" },
      { name:"French Benedict",         desc:"English muffin, Canadian bacon, hollandaise, microgreens",  price:16, category:"breakfast", tag:"Chef's Pick", img:"🍳" },
      { name:"Overnight Oats",          desc:"Rolled oats, chia seeds, seasonal berries, honey drizzle",  price:11, category:"breakfast", tag:"Healthy",    img:"🥣" },
      { name:"Crêpe Suzette",           desc:"Thin crêpes, orange butter sauce, candied zest, cream",     price:13, category:"breakfast", tag:"",           img:"🥞" },
      { name:"Full Brunch Board",       desc:"Eggs, bacon, sausage, beans, grilled tomato, toast",        price:22, category:"breakfast", tag:"Sharing",    img:"🍽️" },
      { name:"Acai Bowl",               desc:"Blended acai, banana, granola, coconut flakes, honey",      price:15, category:"breakfast", tag:"Vegan",      img:"🍇" },
      { name:"Truffle Mushroom Pasta",  desc:"Pappardelle, wild mushrooms, truffle oil, parmesan",        price:22, category:"lunch",     tag:"Chef's Pick", img:"🍝" },
      { name:"Grilled Salmon Salad",    desc:"Atlantic salmon, quinoa, roasted veg, lemon vinaigrette",   price:24, category:"lunch",     tag:"Healthy",    img:"🐟" },
      { name:"Wagyu Beef Burger",       desc:"Wagyu patty, aged cheddar, caramelised onion, brioche bun", price:26, category:"lunch",     tag:"Popular",    img:"🍔" },
      { name:"Caprese Flatbread",       desc:"Hand-stretched dough, buffalo mozzarella, heirloom tomato", price:18, category:"lunch",     tag:"Vegetarian", img:"🍕" },
      { name:"Asian Noodle Bowl",       desc:"Ramen noodles, soft-boiled egg, miso broth, nori",          price:20, category:"lunch",     tag:"",           img:"🍜" },
      { name:"Caesar Wrap",             desc:"Grilled chicken, romaine, parmesan, caesar dressing",       price:17, category:"lunch",     tag:"",           img:"🌯" },
      { name:"Pan-Seared Duck Breast",  desc:"Cherry jus, celeriac purée, wilted greens, crispy skin",   price:38, category:"dinner",    tag:"Chef's Pick", img:"🦆" },
      { name:"Lobster Thermidor",       desc:"Half lobster, brandy cream sauce, gruyère, herb crust",    price:55, category:"dinner",    tag:"Premium",    img:"🦞" },
      { name:"Beef Tenderloin",         desc:"200g eye fillet, truffle butter, dauphinoise, jus",         price:48, category:"dinner",    tag:"Popular",    img:"🥩" },
      { name:"Roasted Rack of Lamb",    desc:"French-trimmed rack, rosemary crust, ratatouille",          price:42, category:"dinner",    tag:"",           img:"🍖" },
      { name:"Seafood Risotto",         desc:"Arborio rice, scallops, prawns, saffron, white wine",       price:35, category:"dinner",    tag:"Popular",    img:"🦐" },
      { name:"Wild Mushroom Wellington",desc:"Puff pastry, duxelles, truffle, red wine reduction",        price:32, category:"dinner",    tag:"Vegetarian", img:"🥦" },
    ];
    await MenuItem.insertMany(items);
    res.json({ success: true, message: `${items.length} items seeded ✓` });
  } catch (err) { next(err); }
});

module.exports = router;