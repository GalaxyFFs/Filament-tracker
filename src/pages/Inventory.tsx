import React, { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface InventoryProps {
  onNavigate: (page: Page) => void;
}

export default function Inventory({ onNavigate }: InventoryProps) {
  const { filaments, deleteFilament, settings } = useAppContext();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "Used">("Active");

  const displayFilaments = filaments.filter((f) => {
    if (activeTab === "Active") return f.weightRemaining > 0;
    return f.weightRemaining === 0;
  });

  const filteredFilaments = displayFilaments.filter((f) => {
    const matchesFilter = filter === "All" || f.material === filter;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.brand.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const materials = [
    "All",
    ...Array.from(new Set(displayFilaments.map((f) => f.material))),
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Inventory</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage your filament collection</p>
        </div>
        <button
          onClick={() => onNavigate("add-filament")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Filament
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-border">
        {(["Active", "Used"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilter("All");
            }}
            className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab
              ? "border-accent text-accent"
              : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
          >
            {tab} Filaments
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab
                ? "bg-accent/10 text-accent"
                : "bg-bg-card-hover text-gray-500"
                }`}
            >
              {
                filaments.filter((f) =>
                  tab === "Active"
                    ? f.weightRemaining > 0
                    : f.weightRemaining === 0,
                ).length
              }
            </span>
          </button>
        ))}
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search filaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-main border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-gray-200"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-400 mr-2">FILTER:</span>
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => setFilter(mat)}
                className={`px-3 py-1.5 rounded-md font-medium ${filter === mat ? "bg-accent text-white" : "bg-transparent border border-border text-gray-300 hover:bg-bg-main"}`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6 w-16">Color</th>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Material</th>
                <th className="p-4">Weight (g)</th>
                <th className="p-4">Empty Spool (g)</th>
                <th className="p-4">Price</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFilaments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No filaments found.
                  </td>
                </tr>
              ) : (
                filteredFilaments.map((filament) => (
                  <tr
                    key={filament.id}
                    className="hover:bg-bg-card-hover transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: filament.colorHex }}
                      ></div>
                    </td>
                    <td className="p-4 font-medium text-gray-200 flex items-center gap-2">
                      {filament.name}
                      {filament.weightRemaining / filament.weightTotal < 0.15 && (
                        <span className="text-amber-500 text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">{filament.brand}</td>
                    <td className="p-4">
                      <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded">
                        {filament.material}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          filament.weightRemaining / filament.weightTotal < 0.15
                            ? "text-amber-500 font-medium"
                            : "text-gray-200 font-medium"
                        }
                      >
                        {filament.weightRemaining}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {" "}
                        / {filament.weightTotal}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400">
                        {filament.emptySpoolWeight}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {settings.currency === "USD" ? "$" : ""}
                      {filament.price.toFixed(2)}
                      {settings.currency !== "USD" ? ` ${settings.currency}` : ""}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => deleteFilament(filament.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredFilaments.length} of {displayFilaments.length} {activeTab.toLowerCase()} filaments
          </span>
        </div>
      </div>
    </div>
  );
}
