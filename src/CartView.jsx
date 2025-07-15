// CartView.jsx
import React from "react";

export default function CartView({ items = [], onBack }) {
  const totalAmount = items.reduce((total, item) => {
    if (!item.quantity) return total;

    return total + Object.entries(item.quantity).reduce((sum, [key, qty]) => {
      const price = parseFloat(item[key] || 0);
      const quantity = parseInt(qty || 0);
      return sum + price * quantity;
    }, 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🛒 Your Cart</h2>
        <button
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          onClick={onBack}
        >
          ⬅ Back
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">No items selected.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded p-3 shadow-sm bg-white"
            >
              <div className="font-semibold">{item.Particulars}</div>
              <div className="text-sm text-gray-500 mb-2">Code: {item.Code}</div>

              {Object.entries(item.quantity || {}).map(([key, qty]) => (
                <div key={key} className="flex justify-between text-sm text-green-700">
                  <span>{key}:</span>
                  <span>
                    {qty} pcs × ₹{item[key]} = ₹{(parseFloat(item[key]) * qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Total */}
          <div className="text-right text-lg font-semibold border-t pt-2">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
