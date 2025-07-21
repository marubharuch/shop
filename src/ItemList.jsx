import React from "react";

const ItemList = ({ items, onRateClick, activeRate, globalDiscount, onDiscountClick }) => {
  const rateColors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100"];

  const getRateBgClass = (rateIndex) =>
    rateColors[rateIndex % rateColors.length];

  if (!items.length)
    return <p className="text-center mt-4 text-gray-500">No results.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, idx) => {
        const isActive = activeRate?.itemIndex === idx;
        return (
          <li
            key={idx}
            className={`p-3 border rounded-lg shadow-sm space-y-1 transition ${isActive ? "bg-blue-100 border-blue-400" : "bg-white"
              }`}
          >
            <p className="text-base font-medium text-gray-900">
              {item.Code} {item.Particulars} ({item["PKG OUTER"]}, {item.MASTER})
            </p>

            {Object.entries(item).map(([key, value], i) => {
              if (
                value == null ||
                typeof value === "object" ||
                ["Code", "Particulars", "PKG OUTER", "MASTER", "No", "category"].includes(key)
              ) return null;

              if (key.includes("RATE")) {
                const qty = item.quantity?.[key];
                const discount = item.discounts?.[key] ?? globalDiscount;
                const finalRate = (value * (1 - discount / 100)).toFixed(2);

                const rateIndex = Object.keys(item)
                  .filter(k => k.includes("RATE"))
                  .indexOf(key);

                return (
                  <p
                    key={i}
                    className={`text-sm cursor-pointer p-1 rounded ${getRateBgClass(rateIndex)} ${qty ? "text-green-600 font-semibold" : "text-gray-800 hover:text-blue-600"
                      }`}
                    onClick={() => onRateClick(idx, key)}
                  >
                    <span>
                      <small><em>{key.replace("RATE", "").trim()}</em>:</small>{" "}
                      ₹{value} -
                    </span>
                    <span
                      className="underline decoration-dotted text-yellow-700 cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        onDiscountClick(idx, key);
                      }}
                    >
                      {discount}%
                    </span>
                    <span>= ₹{finalRate}</span>
                    {qty ? <span>× {qty}</span> : null}
                  </p>
                );
              }

              return <p key={i} className="text-sm text-gray-700">{value}</p>;
            })}
          </li>
        );
      })}
    </ul>
  );
};

export default ItemList;
