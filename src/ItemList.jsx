// ItemList.jsx
import React from "react";

const ItemList = ({ items, onRateClick, activeRate, globalDiscount, onDiscountClick }) => {
  
  const getRateBgClass = (key) => {
    if (key.toLowerCase().includes("pure")) return "bg-blue-100";
    if (key.toLowerCase().includes("emerald")) return "bg-green-100";
    if (key.toLowerCase().includes("mapple") || key.toLowerCase().includes("café")) return "bg-yellow-100";
    return "bg-gray-100";
  };
  
  
  
  if (!items.length)
    return <p className="text-center mt-4 text-gray-500">No results.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => {
        const isActive = activeRate?.itemIndex === index;
//console.log("item",item)
        return (
          <li
            key={index}
            className={`p-3 border rounded-lg shadow-sm space-y-1 transition ${
              isActive ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
          >
            <p className="text-base font-medium text-gray-900">
              {item.Code} {item.Particulars} ({item["PKG OUTER"]}, {item.MASTER})
            </p>

            {Object.entries(item).map(([key, value], i) => {
              if (
                value === undefined ||
                value === null ||
                value === "" ||
                typeof value === "object" ||
                ["Code", "Particulars", "PKG OUTER", "MASTER", "No", "category"].includes(key)
              )
                return null;

              if (key.includes("RATE")) {
               
                {/*if (typeof value !== "number") return null;*/}
                const qty = item.quantity?.[key];
                const discount = item.discounts?.[key] ?? globalDiscount;
                const finalRate = (value * (1 - discount / 100)).toFixed(2);

                return (
                  <>
                  
                  <p
                    key={i}
                    className={`text-sm cursor-pointer p-1 rounded ${getRateBgClass(key)} ${
                      qty ? "text-green-600 font-semibold" : "text-gray-800 hover:text-blue-600"
                    }`}
                    onClick={() => onRateClick(index, key)}
                  >
                    <span>
                      <small>
                        <em>{key.replace("RATE", "").trim()}</em>:
                      </small>{" "}
                      ₹{value} -
                    </span>
                    <span
                      className="underline decoration-dotted text-yellow-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDiscountClick(index, key);
                      }}
                    >
                      {discount}%
                    </span>
                    <span>= ₹{finalRate}</span>
                    {qty ? <span>× {qty}</span> : null}
                  </p>
                  </>
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
