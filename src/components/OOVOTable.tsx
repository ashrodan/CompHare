import React, { useState, useMemo } from 'react';
import type { OOVOItem, OOVOVolumeOption } from '../types/oovo';

interface OOVOTableProps {
  providers: OOVOItem[];
}

export default function OOVOTable({ providers }: OOVOTableProps) {
  const availableVolumes = [...new Set(providers.flatMap(p => p.volumeOptions.map(vo => vo.volume)))].sort((a, b) => a - b);
  
  const [filters, setFilters] = useState({
    location: '',
    volumeMin: availableVolumes[0],
    volumeMax: availableVolumes[availableVolumes.length - 1],
    stockStatus: '',
  });

  const [expandedProducer, setExpandedProducer] = useState<string | null>(null);

  const processedData = useMemo(() => {
    // Group providers and filter their volume options
    const groupedProviders = providers.map(provider => {
      const filteredVolumeOptions = provider.volumeOptions.filter(option => 
        option.volume >= filters.volumeMin && 
        option.volume <= filters.volumeMax
      );

      // Check if the provider meets other filter criteria
      const meetsLocationFilter = !filters.location || provider.location === filters.location;
      const meetsStockFilter = !filters.stockStatus || provider.stockStatus === filters.stockStatus;

      return {
        ...provider,
        volumeOptions: filteredVolumeOptions,
        filteredVolumeCount: filteredVolumeOptions.length,
        isVisible: meetsLocationFilter && meetsStockFilter && filteredVolumeOptions.length > 0
      };
    }).filter(provider => provider.isVisible);

    // Sort providers by their most economical volume option
    return groupedProviders.sort((a, b) => {
      const aEconomicalOption = a.volumeOptions.reduce((best, current) => 
        (best.price / best.volume) < (current.price / current.volume) ? best : current
      );
      const bEconomicalOption = b.volumeOptions.reduce((best, current) => 
        (best.price / best.volume) < (current.price / current.volume) ? best : current
      );

      return (aEconomicalOption.price / aEconomicalOption.volume) - 
             (bEconomicalOption.price / bEconomicalOption.volume);
    });
  }, [providers, filters]);

  const locations = [...new Set(providers.map(p => p.location))];
  const stockStatuses = [...new Set(providers.map(p => p.stockStatus))];

  const toggleProducerExpand = (producerName: string) => {
    setExpandedProducer(expandedProducer === producerName ? null : producerName);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <select 
          value={filters.location} 
          onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select 
          value={filters.stockStatus} 
          onChange={(e) => setFilters(prev => ({...prev, stockStatus: e.target.value}))}
          className="border p-2 rounded"
        >
          <option value="">All Stock Statuses</option>
          {stockStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <label>Volume Range:</label>
          <select
            value={filters.volumeMin}
            onChange={(e) => setFilters(prev => ({
              ...prev, 
              volumeMin: Number(e.target.value),
              volumeMax: Math.max(Number(e.target.value), prev.volumeMax)
            }))}
            className="border p-2 rounded"
          >
            {availableVolumes.map(volume => (
              <option key={volume} value={volume}>{volume}L Min</option>
            ))}
          </select>
          <select
            value={filters.volumeMax}
            onChange={(e) => setFilters(prev => ({
              ...prev, 
              volumeMax: Number(e.target.value),
              volumeMin: Math.min(Number(e.target.value), prev.volumeMin)
            }))}
            className="border p-2 rounded"
          >
            {availableVolumes.map(volume => (
              <option key={volume} value={volume}>{volume}L Max</option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Best $/L</th>
            <th className="p-3 text-left">Shipping</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Options</th>
            <th className="p-3 text-left">Link</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((provider, index) => (
            <>
              <tr 
                key={provider.name} 
                onClick={() => toggleProducerExpand(provider.name)}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  index === 0 ? 'bg-green-50 font-semibold' : ''
                } ${expandedProducer === provider.name ? 'bg-blue-50' : ''}`}
              >
                <td className="p-3">{provider.name}</td>
                <td className="p-3">{provider.location}</td>
                <td className="p-3">
                  {(() => {
                    const bestOption = provider.volumeOptions.reduce((best, current) => 
                      (best.price / best.volume) < (current.price / current.volume) ? best : current
                    );
                    return `$${(bestOption.price / bestOption.volume).toFixed(2)}/L`;
                  })()}
                  {index === 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Most Economical
                    </span>
                  )}
                </td>
                <td className="p-3">${provider.shipping.toFixed(2)}</td>
                <td className="p-3">{provider.stockStatus}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {provider.filteredVolumeCount} Option{provider.filteredVolumeCount !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="p-3">
                  <a 
                    href={provider.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Website
                  </a>
                </td>
              </tr>
              {expandedProducer === provider.name && (
                <tr>
                  <td colSpan={7} className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Volume</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">$/L</th>
                          <th className="p-2 text-left">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {provider.volumeOptions.map((option, optionIndex) => (
                          <tr 
                            key={optionIndex} 
                            className="border-b bg-gray-50 hover:bg-gray-100"
                          >
                            <td className="p-2">{option.volume}L</td>
                            <td className="p-2">${option.price.toFixed(2)}</td>
                            <td className="p-2">${(option.price / option.volume).toFixed(2)}/L</td>
                            <td className="p-2">${(option.price + provider.shipping).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
