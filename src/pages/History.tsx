import React, { useState } from "react";
import { Download, Plus, Search, Box, Edit2, Trash2 } from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface HistoryProps {
  onNavigate: (page: Page) => void;
}

export default function History({ onNavigate }: HistoryProps) {
  const { printJobs, filaments, deletePrintJob, settings } = useAppContext();
  const [search, setSearch] = useState("");

  const filteredJobs = [...printJobs]
    .filter((job) =>
      job.modelName.toLowerCase().includes(search.toLowerCase()),
    )
    .reverse();

  const totalSpent = printJobs.reduce((sum, job) => sum + job.cost, 0);
  const totalWeight = printJobs.reduce((sum, job) => sum + job.weightUsed, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Print History</h1>
          <p className="text-gray-400">
            Review your past prints and calculate costs
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg text-sm font-medium hover:bg-bg-card-hover transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => onNavigate("log-print")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Total Spent on Prints</p>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold">$</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-accent mb-2">
            {settings.currency === "USD" ? "$" : ""}
            {totalSpent.toFixed(2)}
            {settings.currency !== "USD" ? ` ${settings.currency}` : ""}
          </h2>
          <p className="text-gray-500 text-sm">Lifetime total</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Total Weight Printed</p>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-accent mb-2">
            {settings.weightUnit === "kg"
              ? (totalWeight / 1000).toFixed(2)
              : totalWeight}{" "}
            <span className="text-xl text-gray-500 font-normal">
              {settings.weightUnit}
            </span>
          </h2>
          <p className="text-gray-500 text-sm">~ {(totalWeight / 1000).toFixed(1)} spools worth</p>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Logs</h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-main border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-gray-200"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Model Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Filament Used</th>
              <th className="p-4">Weight</th>
              <th className="p-4">Cost</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No print jobs found.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const filament = filaments.find((f) => f.id === job.filamentId);
                return (
                  <tr
                    key={job.id}
                    className="hover:bg-bg-card-hover transition-colors group"
                  >
                    <td className="p-4 pl-6 font-medium text-gray-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-bg-main flex items-center justify-center border border-border">
                        <Box className="w-4 h-4 text-gray-400" />
                      </div>
                      {job.modelName}
                    </td>
                    <td className="p-4 text-gray-400">{job.date}</td>
                    <td className="p-4">
                      {filament && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: filament.colorHex }}
                          ></div>
                          <span className="text-gray-200">{filament.name}</span>
                          <span className="text-gray-500 text-sm">
                            ({filament.brand})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-200 font-medium">
                      {job.weightUsed}g
                    </td>
                    <td className="p-4 text-gray-200 font-medium">
                      {settings.currency === "USD" ? "$" : ""}
                      {job.cost.toFixed(2)}
                      {settings.currency !== "USD"
                        ? ` ${settings.currency}`
                        : ""}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => deletePrintJob(job.id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredJobs.length} of {printJobs.length} results
          </span>
        </div>
      </div>
    </div>
  );
}
