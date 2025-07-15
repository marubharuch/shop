import React from "react";

const ItemList = ({ items, onRateClick, activeRate }) => {
  if (!items.length)
    return <p className="text-center mt-4 text-gray-500">No results.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => {
        const isActive = activeRate?.itemIndex === index;

        return (
          <li
            key={index}
            className={`p-3 border rounded-lg shadow-sm space-y-1 transition 
              ${isActive ? "bg-blue-100 border-blue-400" : "bg-white"}`}
          >
            <p className="text-base font-medium text-gray-900">
              {item.Code} {item.Particulars} ({item["PKG OUTER"]}, {item.MASTER})
            </p>

            {Object.entries(item).map(([key, value], i) => {
              if (
                value === undefined ||
                value === null ||
                value === "" ||
                ["Code", "Particulars", "PKG OUTER", "MASTER", "No", "category", "quantity"].includes(key)
              )
                return null;

              if (key.includes("RATE")) {
                const qty = item.quantity?.[key];
                return (
                  <p
                    key={i}
                    className={`text-sm cursor-pointer ${
                      qty
                        ? "text-green-600 font-semibold"
                        : "text-gray-800 hover:text-blue-600"
                    }`}
                    onClick={() => onRateClick(index, key)}
                  >
                    <small>
                      <em>{key.replace("RATE", "").trim()}</em>:
                    </small>{" "}
                    ₹{value} {qty ? `× ${qty}` : ""}
                  </p>
                );
              }

              return (
                <p key={i} className="text-sm text-gray-700">
                  {value}
                </p>
              );
            })}
          </li>
        );
      })}
    </ul>
  );
};

export default ItemList;
