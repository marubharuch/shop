import React, { useState } from "react";
import VoiceSearch from "./VoiceSearch";
import ItemList from "./ItemList";
import items from "./woodem_accessories.json";

export default function App() {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchQuery, setSearchQuery] = useState("");

 
  const handleSearch = (query) => {
    setSearchQuery(query);
    const words = query.toLowerCase().split(/\s+/).filter(Boolean); // split into words
  
    const matches = items.filter((item) => {
      const searchable = `${item.Code} ${item.Particulars}`.toLowerCase();
      return words.every((word) => searchable.includes(word));
    });
  
    setFilteredItems(matches);
  };
  
  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">🎤 Voice Item Search</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Type item name or code..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <VoiceSearch onSearch={handleSearch} />
      <ItemList items={filteredItems} />
    </div>
  );
}
