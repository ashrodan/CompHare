import { useState } from 'react';

interface VolumeOption {
  volume: string;
  price: string;
}

interface OliveOilFormProps {
  initialData?: {
    name: string;
    location: string;
    shipping: number;
    stockStatus: string;
    link: string;
    description: string;
    volumeOptions: { volume: number; price: number }[];
  };
  providerId?: string;
  mode: 'create' | 'edit';
}

export default function OliveOilForm({ initialData, providerId, mode }: OliveOilFormProps) {
  const [volumeOptions, setVolumeOptions] = useState<VolumeOption[]>(
    initialData?.volumeOptions.map(o => ({ volume: o.volume.toString(), price: o.price.toString() })) ||
    [{ volume: '', price: '' }]
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addVolumeOption = () => {
    setVolumeOptions([...volumeOptions, { volume: '', price: '' }]);
  };

  const removeVolumeOption = (index: number) => {
    setVolumeOptions(volumeOptions.filter((_, i) => i !== index));
  };

  const updateVolumeOption = (index: number, field: 'volume' | 'price', value: string) => {
    const updated = [...volumeOptions];
    updated[index][field] = value;
    setVolumeOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      shipping: formData.get('shipping'),
      stockStatus: formData.get('stockStatus'),
      link: formData.get('link'),
      description: formData.get('description'),
      volumeOptions: volumeOptions
        .filter(o => o.volume && o.price)
        .map(o => ({
          volume: parseFloat(o.volume),
          price: parseFloat(o.price)
        }))
    };

    try {
      const url = mode === 'create' ? '/api/admin/olive-oil' : `/api/admin/olive-oil/${providerId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.location.href = '/admin/olive-oil';
      } else {
        const err = await response.json();
        setError(err.error || 'Failed to save provider');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {/* Provider Information */}
      <div className="bg-neutral-dark border border-primary/20 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Provider Information</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-neutral-light mb-2 text-sm font-medium">
            Provider Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., Cobram Estate Extra Virgin Olive Oil"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="location" className="block text-neutral-light mb-2 text-sm font-medium">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              defaultValue={initialData?.location}
              className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Victoria"
            />
          </div>

          <div>
            <label htmlFor="shipping" className="block text-neutral-light mb-2 text-sm font-medium">
              Shipping Cost ($) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="shipping"
              name="shipping"
              required
              step="0.01"
              defaultValue={initialData?.shipping}
              className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., 9.95"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="stockStatus" className="block text-neutral-light mb-2 text-sm font-medium">
            Stock Status
          </label>
          <select
            id="stockStatus"
            name="stockStatus"
            defaultValue={initialData?.stockStatus || 'In Stock'}
            className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="link" className="block text-neutral-light mb-2 text-sm font-medium">
            Product Link (URL)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={initialData?.link}
            className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-neutral-light mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialData?.description}
            className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Brief description of the producer..."
          />
        </div>
      </div>

      {/* Volume Options */}
      <div className="bg-neutral-dark border border-primary/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Volume Options</h2>
          <button
            type="button"
            onClick={addVolumeOption}
            className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            + Add Option
          </button>
        </div>

        <div className="space-y-3">
          {volumeOptions.map((option, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  value={option.volume}
                  onChange={(e) => updateVolumeOption(index, 'volume', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Volume (L)"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  value={option.price}
                  onChange={(e) => updateVolumeOption(index, 'price', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-darker border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Price ($)"
                  required
                />
              </div>
              {volumeOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVolumeOption(index)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-accent text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Provider' : 'Update Provider'}
        </button>
        <a
          href="/admin/olive-oil"
          className="bg-neutral-dark hover:bg-neutral-darker text-white font-bold py-3 px-8 rounded-lg transition-all border border-primary/20"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
