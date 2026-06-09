import type { Player } from '@/types/player/Player';
import currency from 'currency.js';

export interface ChipsCalculationResult {
  totalChips: number;
  initialValue: number;
}

export const useChipsCalculation = () => {
  const calculatePlayerChips = (player: Player, exchangeRate: number): ChipsCalculationResult => {
    let totalCash = currency(0);
    
    // Sum all buy-ins and subtract cash-outs
    player.exchanges?.forEach(payment => {
      if (payment.direction === 'buyIn') {
        totalCash = totalCash.add(payment.cashAmount || '0');
      } else {
        totalCash = totalCash.subtract(payment.cashAmount || '0');
      }
    });
    
    // Calculate chips by multiplying by exchange rate
    const chipsValue = Math.round(totalCash.multiply(exchangeRate).value);

    return {
      totalChips: chipsValue,
      initialValue: chipsValue,
    };
  };

  const calculateTotalChips = (players: Player[], exchangeRate: number): number => {
    return players.reduce((sum, player) =>
      sum + calculatePlayerChips(player, exchangeRate).totalChips, 0);
  };

  return {
    calculatePlayerChips,
    calculateTotalChips,
  };
};
