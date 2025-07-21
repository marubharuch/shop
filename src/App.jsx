// App.jsx
import React, { useState, useEffect } from "react";
import localforage from "localforage";
import VoiceSearch from "./VoiceSearch";
import ItemList from "./ItemList";
import CartView from "./CartView";
import { ShoppingCart, RotateCcw } from "lucide-react";

export default function App() {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [activeRate, setActiveRate] = useState(null);
  const [enteredValue, setEnteredValue] = useState("");
  const [activeDiscount, setActiveDiscount] = useState(null);
  const [discountValue, setDiscountValue] = useState("");
  const [showCart, setShowCart] = useState(false);

  window.setShowCart = setShowCart;

  // Load data & persisted item states
  useEffect(() => {
    const loadData = async () => {
      const stored = await localforage.getItem("cached_items");
      const lastHash = await localforage.getItem("data_hash");
      const savedStates = (await localforage.getItem("item_states")) || [];

      try {
        const [accRes, plateRes] = await Promise.all([
          fetch(import.meta.env.BASE_URL + "woodem_accessories.json"),
          fetch(import.meta.env.BASE_URL + "plat4x.json"),
        ]);
        const accessories = await accRes.json();
        const plates = await plateRes.json();
        const all = [
          ...accessories.map((item) => ({ ...item, category: "accessory" })),
          ...plates.map((item) => ({ ...item, category: "plate" })),
        ];
        const newHash = JSON.stringify(all).length;

        if (!stored || newHash !== lastHash) {
          await localforage.setItem("cached_items", all);
          await localforage.setItem("data_hash", newHash);
        }

        setAllItems(all);
        setFilteredItems(applyExistingData(all, savedStates));
      } catch (err) {
        console.error("Fetch JSON failed", err);
        if (stored) {
          setAllItems(stored);
          setFilteredItems(applyExistingData(stored, savedStates));
        }
      }
    };

    loadData();
  }, []);

  // Persist quantities/discounts on change
  useEffect(() => {
    const saveState = async () => {
      const simple = filteredItems.map((item) => ({
        Code: item.Code,
        quantity: item.quantity || {},
        discounts: item.discounts || {},
      }));
      await localforage.setItem("item_states", simple);
    };
    saveState();
  }, [filteredItems]);

  const applyExistingData = (items, savedStates = []) =>
    items.map((item) => {
      const existing = savedStates.find((i) => i.Code === item.Code);
      return {
        ...item,
        quantity: existing?.quantity || {},
        discounts: existing?.discounts || {},
      };
    });

  const handleSearch = (q, category = categoryFilter) => {
    setSearchQuery(q);
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = allItems
      .filter((item) => {
        const searchable = `${item.Code} ${item.Particulars}`.toLowerCase();
        const catOk = category === "all" || item.category === category;
        return catOk && words.every((w) => searchable.includes(w));
      })
      .map((item) => {
        const existing = filteredItems.find((i) => i.Code === item.Code);
        return {
          ...item,
          quantity: existing?.quantity || {},
          discounts: existing?.discounts || {},
        };
      });
    setFilteredItems(matches);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setFilteredItems(applyExistingData(allItems));
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategoryFilter(cat);
    handleSearch(searchQuery, cat);
  };

  const handleRateClick = (itemIndex, key) => {
    setActiveRate({ itemIndex, key });
    setEnteredValue("");
  };

  const handleDiscountClick = (itemIndex, key) => {
    setActiveDiscount({ itemIndex, key });
    setDiscountValue("");
  };

  const handleNumPad = (val, type = "qty") => {
    if (val === "C") {
      type === "qty" ? setEnteredValue("") : setDiscountValue("");
    } else {
      type === "qty"
        ? setEnteredValue((prev) => prev + val)
        : setDiscountValue((prev) => prev + val);
    }
  };

  const confirmRate = () => {
    const arr = [...filteredItems];
    const it = arr[activeRate.itemIndex];
    it.quantity = it.quantity || {};
    it.quantity[activeRate.key] = enteredValue;
    setFilteredItems(arr);
    setActiveRate(null);
  };

  const confirmDiscount = () => {
    const arr = [...filteredItems];
    const it = arr[activeDiscount.itemIndex];
    it.discounts = it.discounts || {};
    it.discounts[activeDiscount.key] = Number(discountValue);
    setFilteredItems(arr);
    setActiveDiscount(null);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto relative pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white pb-2">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setShowCart(true)}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 md:hidden"
          >
            <ShoppingCart size={24} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type item name or code..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:flex md:gap-4">
        <div className="md:w-3/5 w-full">
          <ItemList
            items={filteredItems}
            onRateClick={handleRateClick}
            activeRate={activeRate}
            globalDiscount={globalDiscount}
            onDiscountClick={handleDiscountClick}
          />
        </div>
        <div className="md:w-2/5 hidden md:block">
          <CartView items={filteredItems} onClose={() => {}} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t px-2 py-2 z-50">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="%"
            className="w-[80px] p-2 border border-gray-300 rounded"
            value={globalDiscount}
            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
          />
          <select
            className="flex-1 p-2 border border-gray-300 rounded"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            <option value="accessory">Accessory</option>
            <option value="plate">Plate</option>
          </select>
          <div className="shrink-0">
            <VoiceSearch onSearch={(q) => handleSearch(q)} />
          </div>
        </div>
      </div>

      {/* Cart Modal for Mobile */}
      {showCart && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
            <CartView items={filteredItems} onClose={() => setShowCart(false)} />
          </div>
        </div>
      )}

      {/* Qty Modal */}
      {activeRate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 space-y-4">
            <div className="text-center text-3xl font-semibold border p-3 rounded">
              Qty: {enteredValue || "0"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1","2","3","4","5","6","7","8","9","0",".","C"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleNumPad(val, "qty")}
                  className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-xl font-medium"
                >
                  {val}
                </button>
              ))}
            </div>
            <button
              onClick={confirmRate}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {activeDiscount !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
          <div className="bg-yellow-100 rounded-lg shadow-lg w-full max-w-sm p-4 space-y-4">
            <div className="text-center text-2xl font-semibold border p-3 rounded">
              Discount: {discountValue || "0"}%
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1","2","3","4","5","6","7","8","9","0",".","C"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleNumPad(val, "discount")}
                  className="p-4 bg-yellow-200 rounded hover:bg-yellow-300 text-xl font-medium"
                >
                  {val}
                </button>
              ))}
            </div>
            <button
              onClick={confirmDiscount}
              className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
