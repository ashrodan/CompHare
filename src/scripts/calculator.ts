import type { Providers } from '../types/gas';
import { calculateCost, SEASONS } from '../utils/calculations';

declare global {
  interface Window {
    providers: Providers;
  }
}

const form = document.getElementById('calculator-form') as HTMLFormElement;
if (form) {
  form.addEventListener('submit', function(e: SubmitEvent) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const usage = parseFloat(formData.get('usage') as string);
    const season = formData.get('season') as string;
    
    const resultsDiv = document.getElementById('results');
    const resultsGrid = document.getElementById('results-grid');
    
    if (!resultsDiv || !resultsGrid) {
      console.error('Required elements not found');
      return;
    }
    
    // Clear previous results
    resultsGrid.innerHTML = '';
    
    // Calculate costs for each provider
    const costs = Object.entries(window.providers).map(([provider, rates]) => {
      const rateSet = season === SEASONS.SUMMER ? rates.summer : rates.nonSummer;
      const cost = calculateCost(usage, rateSet.steps, rateSet.dailyCharge);
      return { provider, cost, season: rateSet.season };
    });
    
    // Sort by cost
    costs.sort((a, b) => a.cost - b.cost);
    
    // Display results
    costs.forEach((result, index) => {
      const isLowest = index === 0;
      const card = document.createElement('div');
      card.className = `p-6 rounded-lg ${isLowest ? 'bg-green-50 border-2 border-green-500 shadow-lg' : 'bg-white border border-gray-200'} transition-all duration-200 hover:shadow-md`;
      card.innerHTML = `
        <div class="space-y-3">
          <h3 class="text-xl font-semibold ${isLowest ? 'text-green-700' : 'text-gray-700'}">${result.provider}</h3>
          <p class="text-sm text-gray-600">${result.season}</p>
          <p class="text-3xl font-bold ${isLowest ? 'text-green-700' : 'text-gray-700'}">
            $${result.cost.toFixed(2)}<span class="text-base font-normal">/day</span>
          </p>
          ${isLowest ? '<span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Best Rate!</span>' : ''}
        </div>
      `;
      resultsGrid.appendChild(card);
    });
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  });
}
