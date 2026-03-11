// ─── ADMIN CREDENTIALS ────────────────────────────────────────────────────────
export const ADMIN_ACCOUNTS = [
  { username: "admin", password: "maison2026", name: "Head Administrator", role: "Super Admin", avatar: "👑" },
  { username: "manager", password: "dorée123", name: "Floor Manager", role: "Manager", avatar: "🧑‍💼" },
];

// ─── MENU DATA ────────────────────────────────────────────────────────────────
export const INITIAL_MENU = {
  breakfast: [
    { id: 1, name: "Avocado Toast", desc: "Sourdough, smashed avocado, poached eggs, chilli flakes", price: 14, category: "breakfast", tag: "Popular", img: "🥑" },
    { id: 2, name: "French Benedict", desc: "English muffin, Canadian bacon, hollandaise, microgreens", price: 16, category: "breakfast", tag: "Chef's Pick", img: "🍳" },
    { id: 3, name: "Overnight Oats", desc: "Rolled oats, chia seeds, seasonal berries, honey drizzle", price: 11, category: "breakfast", tag: "Healthy", img: "🥣" },
    { id: 4, name: "Crêpe Suzette", desc: "Thin crêpes, orange butter sauce, candied zest, cream", price: 13, category: "breakfast", tag: "", img: "🥞" },
    { id: 5, name: "Full Brunch Board", desc: "Eggs, bacon, sausage, beans, grilled tomato, toast", price: 22, category: "breakfast", tag: "Sharing", img: "🍽️" },
    { id: 6, name: "Acai Bowl", desc: "Blended acai, banana, granola, coconut flakes, honey", price: 15, category: "breakfast", tag: "Vegan", img: "🍇" },
  ],
  lunch: [
    { id: 7, name: "Truffle Mushroom Pasta", desc: "Pappardelle, wild mushrooms, truffle oil, parmesan", price: 22, category: "lunch", tag: "Chef's Pick", img: "🍝" },
    { id: 8, name: "Grilled Salmon Salad", desc: "Atlantic salmon, quinoa, roasted veg, lemon vinaigrette", price: 24, category: "lunch", tag: "Healthy", img: "🐟" },
    { id: 9, name: "Wagyu Beef Burger", desc: "Wagyu patty, aged cheddar, caramelised onion, brioche bun", price: 26, category: "lunch", tag: "Popular", img: "🍔" },
    { id: 10, name: "Caprese Flatbread", desc: "Hand-stretched dough, buffalo mozzarella, heirloom tomato", price: 18, category: "lunch", tag: "Vegetarian", img: "🍕" },
    { id: 11, name: "Asian Noodle Bowl", desc: "Ramen noodles, soft-boiled egg, miso broth, nori", price: 20, category: "lunch", tag: "", img: "🍜" },
    { id: 12, name: "Caesar Wrap", desc: "Grilled chicken, romaine, parmesan, classic caesar dressing", price: 17, category: "lunch", tag: "", img: "🌯" },
  ],
  dinner: [
    { id: 13, name: "Pan-Seared Duck Breast", desc: "Cherry jus, celeriac purée, wilted greens, crispy skin", price: 38, category: "dinner", tag: "Chef's Pick", img: "🦆" },
    { id: 14, name: "Lobster Thermidor", desc: "Half lobster, brandy cream sauce, gruyère, herb crust", price: 55, category: "dinner", tag: "Premium", img: "🦞" },
    { id: 15, name: "Beef Tenderloin", desc: "200g eye fillet, truffle butter, dauphinoise, jus", price: 48, category: "dinner", tag: "Popular", img: "🥩" },
    { id: 16, name: "Roasted Rack of Lamb", desc: "French-trimmed rack, rosemary crust, ratatouille", price: 42, category: "dinner", tag: "", img: "🍖" },
    { id: 17, name: "Seafood Risotto", desc: "Arborio rice, scallops, prawns, saffron, white wine", price: 35, category: "dinner", tag: "Popular", img: "🦐" },
    { id: 18, name: "Wild Mushroom Wellington", desc: "Puff pastry, duxelles, truffle, red wine reduction", price: 32, category: "dinner", tag: "Vegetarian", img: "🥦" },
  ],
};

// ─── RESERVATION DATA ─────────────────────────────────────────────────────────
export const INITIAL_RESERVATIONS = [
  { id: 1, name: "Sophie Laurent", email: "sophie@email.com", phone: "0412 345 678", date: "2026-03-15", time: "7:00 PM", guests: 2, note: "Anniversary dinner, window seat preferred", status: "pending" },
  { id: 2, name: "Marcus Chen", email: "marcus@email.com", phone: "0423 456 789", date: "2026-03-15", time: "6:30 PM", guests: 4, note: "", status: "approved" },
  { id: 3, name: "Priya Sharma", email: "priya@email.com", phone: "0434 567 890", date: "2026-03-16", time: "8:00 PM", guests: 6, note: "Birthday celebration, allergies: nuts", status: "pending" },
  { id: 4, name: "James O'Brien", email: "james@email.com", phone: "0445 678 901", date: "2026-03-17", time: "7:30 PM", guests: 2, note: "Vegetarian menu please", status: "approved" },
];

// ─── TAG CSS CLASS HELPER ─────────────────────────────────────────────────────
export function tagClass(tag) {
  const map = {
    "Popular": "tag-popular",
    "Chef's Pick": "tag-chef",
    "Healthy": "tag-healthy",
    "Vegan": "tag-vegan",
    "Vegetarian": "tag-vegetarian",
    "Premium": "tag-premium",
    "Sharing": "tag-sharing",
  };
  return map[tag] || "";
}
