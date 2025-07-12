import React from "react";

const ItemList = ({ items }) => {
  if (!items.length) return <p className="text-center mt-4 text-gray-500">No results.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="p-3 border rounded-lg shadow-sm bg-white">
          <p className="font-semibold">{item.Particulars}</p>
          <p className="text-sm text-gray-600">Code: {item.Code}</p>
          <p className="text-sm">White: ₹{item.WhiteRate}</p>
          <p className="text-sm">Chrome/Black: ₹{item.ChromeBlackRate}</p>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;