import React, { useState } from "react";
import VoiceSearch from "./VoiceSearch";
import ItemList from "./ItemList";
import accessories from "./woodem_accessories.json";
import plates from "./plat4x.json";

export default function App() {
  const allItems = [
    ...accessories.map((item) => ({
      ...item,
      category: "accessory",
    })),
    ...plates.map((item) => ({
      ...item,
      category: "plate",
    })),
  ];

  const [filteredItems, setFilteredItems] = useState(allItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [activeRate, setActiveRate] = useState(null); // { itemIndex, key }
  const [enteredValue, setEnteredValue] = useState("");

  const [showCart, setShowCart] = useState(false);

  const handleSearch = (query, category = categoryFilter) => {
    setSearchQuery(query);
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);

    const matches = allItems.filter((item) => {
      const searchable = `${item.Code} ${item.Particulars}`.toLowerCase();
      const categoryMatch = category === "all" || item.category === category;
      const keywordMatch = words.every((word) => searchable.includes(word));
      return categoryMatch && keywordMatch;
    });

    setFilteredItems(matches);
  };

  const handleInputChange = (e) => handleSearch(e.target.value);
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    handleSearch(searchQuery, selectedCategory);
  };

  const handleRateClick = (itemIndex, key) => {
    setActiveRate({ itemIndex, key });
    setEnteredValue("");
  };

  const handleNumPad = (val) => {
    if (val === "C") {
      setEnteredValue("");
    } else {
      setEnteredValue((prev) => prev + val);
    }
  };

  const confirmRate = () => {
    const newItems = [...filteredItems];
    const item = newItems[activeRate.itemIndex];
    if (!item.quantity) item.quantity = {};
    item.quantity[activeRate.key] = enteredValue;

    setFilteredItems(newItems);
    setActiveRate(null);
  };

  const cartItems = filteredItems.filter(
    (item) => item.quantity && Object.values(item.quantity).some((q) => Number(q) > 0)
  );

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <h1 className="text-xl font-bold mb-4 text-center">🎤 Voice Item Search</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowCart(false)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          🏠 Home
        </button>
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🛒 Cart ({cartItems.length})
        </button>
      </div>

      {!showCart && (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Type item name or code..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="all">All Categories</option>
            <option value="accessory">Accessory</option>
            <option value="plate">Plate</option>
          </select>

          <VoiceSearch onSearch={(q) => handleSearch(q)} />
          <ItemList
            items={filteredItems}
            onRateClick={handleRateClick}
            activeRate={activeRate}
          />
        </>
      )}

      {showCart && (
        <div>
          <h2 className="text-xl font-semibold mb-2">🛒 Cart</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="border rounded p-3 mb-2 bg-white shadow-sm">
              <div className="font-medium">{item.Code} - {item.Particulars}</div>
              {Object.entries(item.quantity || {}).map(([key, qty]) => (
                <div key={key} className="text-sm text-green-700">
                  {key}: {qty} pcs × ₹{item[key]} = ₹{(qty * parseFloat(item[key])).toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Numpad Popup */}
      {activeRate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 space-y-4">
            <div className="text-center text-3xl font-semibold border p-3 rounded">
              Qty: {enteredValue || "0"}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "C"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleNumPad(val)}
                  className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-xl font-medium"
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={confirmRate}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
