import React, { useState, useMemo } from 'react';
import type { OOVOItem, OOVOVolumeOption } from '../types/oovo';
import { OliveOilVolumeIcons, getVolumeIconByVolume } from './OliveOilVolumeIcons';

interface OOVOTableProps {
  providers: OOVOItem[];
}

export default function OOVOTable({ providers }: OOVOTableProps) {
  const availableVolumes = [...new Set(providers.flatMap(p => p.volumeOptions.map(vo => vo.volume)))].sort((a, b) => a - b);
  
  const [filters, setFilters] = useState({
    location: '',
    excludedVolumes: new Set<number>(),
    stockStatus: '',
  });

  const [expandedProducer, setExpandedProducer] = useState<string | null>(null);

  const processedData = useMemo(() => {
    // Group providers and filter their volume options
    const groupedProviders = providers.map(provider => {
      const filteredVolumeOptions = provider.volumeOptions.filter(option => {
        const icon = getVolumeIconByVolume(option.volume);
        return !filters.excludedVolumes.has(icon.maxVolume);
      });

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

  const handleVolumeFilterChange = (volume: number) => {
    setFilters(prev => {
      const newExcludedVolumes = new Set(prev.excludedVolumes);
      if (newExcludedVolumes.has(volume)) {
        newExcludedVolumes.delete(volume);
      } else {
        newExcludedVolumes.add(volume);
      }
      return {
        ...prev,
        excludedVolumes: newExcludedVolumes
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
        <select 
          value={filters.location} 
          onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
          className="border p-2 rounded h-[42px]"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 whitespace-nowrap font-medium">Volume Range:</span>
          <div className="flex items-center gap-2">
            {OliveOilVolumeIcons.map((volumeIcon) => (
              <button
                key={volumeIcon.id}
                onClick={() => handleVolumeFilterChange(volumeIcon.maxVolume)}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[60px]
                  ${!filters.excludedVolumes.has(volumeIcon.maxVolume)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                  }
                  hover:bg-green-100
                `}
                title={`Toggle ${volumeIcon.label} volumes`}
              >
                {volumeIcon.icon}
                <span className="text-xs mt-1 font-medium">{volumeIcon.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">$/L</th>
            <th className="p-3 text-left">Shipping</th>
            <th className="p-3 text-left">Link</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((provider, index) => (
            <React.Fragment key={provider.name}>
              <tr 
                onClick={() => toggleProducerExpand(provider.name)}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  index === 0 ? 'bg-green-50 font-semibold' : ''
                } ${expandedProducer === provider.name ? 'bg-blue-50' : ''}`}
              >
                <td className="p-3">
                  {provider.name}
                  <br />
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {provider.filteredVolumeCount} Option{provider.filteredVolumeCount !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="p-3">{provider.location}</td>
                <td className="p-3">
                  {(() => {
                    const bestOption = provider.volumeOptions.reduce((best, current) => 
                      (best.price / best.volume) < (current.price / current.volume) ? best : current
                    );
                    return `$${(bestOption.price / bestOption.volume).toFixed(2)}/L`;
                  })()}
                  <br />
                  {index === 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Best
                    </span>
                  )}
                </td>
                <td className="p-3">${provider.shipping.toFixed(2)}</td>
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
                            <td className="p-2 flex items-center">
                              {getVolumeIconByVolume(option.volume).icon}
                              <span className="ml-2">{option.volume}L</span>
                            </td>
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
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
