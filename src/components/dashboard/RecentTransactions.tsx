import React from 'react';
import { WalletTransaction } from '../../types/transaction';
import { formatCoins, formatDateTime } from '../../lib/formatters';
import { ArrowUpRight, ArrowDownLeft, PlusCircle, ArrowRight, Clock } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: WalletTransaction[];
  currentUid: string;
  onViewAll: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentUid,
  onViewAll
}) => {
  const recentList = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#20244F] uppercase tracking-wider">Recent Activity</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#397EF5] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <Clock className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-xs font-bold text-gray-500">No transactions yet</p>
          <p className="text-[11px] text-gray-400">Buy or transfer coins to see activity here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentList.map((tx) => {
            const isBuy = tx.transactionType === 'buy';
            const isSender = tx.senderUid === currentUid;

            let icon = <PlusCircle className="w-5 h-5 text-blue-500" />;
            let bgClass = 'bg-blue-50';
            let title = 'Purchased Coins';
            let subtitle = tx.paymentMethod || 'Online Payment';
            let sign = '+';
            let colorClass = 'text-emerald-600';

            if (isBuy) {
              title = 'Bought Coins';
            } else if (isSender) {
              icon = <ArrowUpRight className="w-5 h-5 text-red-500" />;
              bgClass = 'bg-red-50';
              title = `Sent to ${tx.recipientUserId || 'User'}`;
              subtitle = tx.description || 'Coin transfer';
              sign = '-';
              colorClass = 'text-red-600';
            } else {
              icon = <ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
              bgClass = 'bg-emerald-50';
              title = `Received from ${tx.senderUserId || 'User'}`;
              subtitle = tx.description || 'Received coins';
              sign = '+';
              colorClass = 'text-emerald-600';
            }

            return (
              <div key={tx.transactionId} className="py-3 flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl ${bgClass} flex-shrink-0`}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#20244F] truncate">{title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{formatDateTime(tx.createdAt)}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-extrabold font-mono ${colorClass}`}>
                    {sign}{formatCoins(tx.coinAmount)}
                  </span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
