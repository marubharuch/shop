import React from "react";

export default function CartView({ items, onClose, isDesktop }) {
  const cartItems = items.filter(
    (item) =>
      item.quantity &&
      Object.values(item.quantity).some((qty) => parseFloat(qty) > 0)
  );

  // Column panel for desktop, overlay for mobile
  const containerClass = isDesktop
    ? "bg-white h-full overflow-y-auto rounded-lg border shadow-sm p-4"
    : "fixed inset-0 bg-white z-50 overflow-y-auto";

  return (
    <div className={containerClass}>
      {/* Sticky Header */}
      <div
        className={`sticky top-0 bg-white z-10 border-b p-3 flex items-center justify-between`}
      >
        <h2 className="text-lg font-bold">🛒 Your Cart</h2>
        {onClose && !isDesktop && (
          <button
            onClick={onClose}
            className="text-red-500 font-semibold hover:underline"
          >
            Close
          </button>
        )}
      </div>
      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-gray-400 py-12 text-center">Cart is empty!</div>
        ) : (
          cartItems.map((item, i) => (
            <div key={i} className="border rounded p-2 shadow-sm">
              <div className="font-medium mb-1">
                {item.Code} - {item.Particulars}
              </div>
              {Object.entries(item.quantity || {}).map(([key, qty]) => {
                if (parseFloat(qty) > 0) {
                  const rate = item[key];
                  const discount = item.discounts?.[key] ?? 0;
                  const finalRate = rate * (1 - discount / 100);
                  return (
                    <p key={key} className="text-sm text-gray-700">
                      {key.replace("RATE", "")}: {qty} × ₹
                      {finalRate.toFixed(2)} = ₹
                      {(qty * finalRate).toFixed(2)}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
