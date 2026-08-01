import React, { useState } from "react";
import { Download, Plus, Search, Box, Edit2, Trash2, Scale } from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { formatNumber, formatMoney } from "../utils/format";


interface HistoryProps {
  onNavigate: (page: Page) => void;
}

export default function History({ onNavigate }: HistoryProps) {
  const { printJobs, filaments, deletePrintJob, settings, setEditingPrintJobId } = useAppContext();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Print History</h1>
          <p className="text-text-secondary">
            Review your past prints and calculate costs
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingPrintJobId(null);
              onNavigate("log-print");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary text-sm">Total Spent on Prints</p>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold">
                {settings.currency === "USD" ? "$" : settings.currency}
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-accent mb-2">
            {settings.currency === "USD" ? "$" : ""}
            {formatMoney(totalSpent)}
            {settings.currency !== "USD" ? ` ${settings.currency}` : ""}
          </h2>
          <p className="text-text-secondary text-sm">Lifetime total</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary text-sm">Total Weight Printed</p>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-accent mb-2">
            {settings.weightUnit === "kg"
              ? formatNumber(totalWeight / 1000)
              : formatNumber(totalWeight)}{" "}
            <span className="text-xl text-text-secondary font-normal">
              {settings.weightUnit}
            </span>
          </h2>
          <p className="text-text-secondary text-sm">~ {formatNumber(totalWeight / 1000)} spools worth</p>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Recent Logs</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-main border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-text-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border text-xs font-bold text-text-secondary uppercase tracking-wider">
                <th className="p-4 pl-6">Model Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Filament Used</th>
                <th className="p-4">Weight ({settings.weightUnit})</th>
                <th className="p-4">Cost ({settings.currency})</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
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
                      <td className="p-4 pl-6 font-medium text-text-primary">
                        {job.modelName}
                      </td>
                      <td className="p-4 text-text-secondary">{new Date(job.date).toLocaleDateString('cs-CZ')}</td>
                      <td className="p-4">
                        {filament ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full ring-1 ring-white/20 shrink-0"
                              style={{ backgroundColor: filament.colorHex }}
                            ></div>
                            <span className="text-text-primary">{filament.name}</span>
                            <span className="text-text-secondary text-sm">
                              ({filament.brand})
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-secondary text-sm italic">
                            (Deleted Filament)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-text-primary font-medium">
                        {formatNumber(settings.weightUnit === "kg" ? job.weightUsed / 1000 : job.weightUsed)}
                      </td>
                      <td className="p-4 text-text-primary font-medium">
                        {formatMoney(job.cost)}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingPrintJobId(job.id);
                              onNavigate("log-print");
                            }}
                            className="text-text-secondary hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePrintJob(job.id)}
                            className="text-text-secondary hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <span>
            Showing {filteredJobs.length} of {printJobs.length} results
          </span>
        </div>
      </div>
    </div>
  );
}
