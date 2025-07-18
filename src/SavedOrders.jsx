import React from "react";

export default function SavedOrders({ orders, handleEdit, handleDelete }) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Saved Orders</h2>
      {Object.entries(orders)
        .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
        .map(([key, order]) => (
          <div
            key={key}
            className="border p-2 rounded mb-2 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{key}</div>
              <div className="text-sm text-gray-600">{order.mobile}</div>
              <div className="text-xs">{Object.keys(order.items).length} items</div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(key)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(key)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
