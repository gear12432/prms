import React, { useState } from 'react';
import { WalletTransaction } from '../../types/transaction';
import { formatCoins, formatDateTime, formatCurrency } from '../../lib/formatters';
import { 
  PlusCircle, ArrowUpRight, ArrowDownLeft, Search, Filter, Clock, X, CheckCircle2, Copy, Check 
} from 'lucide-react';

interface TransactionListProps {
  transactions: WalletTransaction[];
  currentUid: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, currentUid }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'send' | 'receive'>('all');
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [copiedTxId, setCopiedTxId] = useState(false);

  const filtered = transactions.filter((tx) => {
    const isBuy = tx.transactionType === 'buy';
    const isSender = tx.senderUid === currentUid;

    let typeMatch = true;
    if (filterType === 'buy') typeMatch = isBuy;
    if (filterType === 'send') typeMatch = !isBuy && isSender;
    if (filterType === 'receive') typeMatch = !isBuy && !isSender;

    const query = search.toLowerCase().trim();
    const searchMatch = !query || 
      tx.transactionId.toLowerCase().includes(query) ||
      (tx.senderUserId && tx.senderUserId.toLowerCase().includes(query)) ||
      (tx.recipientUserId && tx.recipientUserId.toLowerCase().includes(query)) ||
      (tx.description && tx.description.toLowerCase().includes(query));

    return typeMatch && searchMatch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left space-y-5 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#20244F]">Transaction History</h2>
        <p className="text-xs text-gray-500">Real-time ledger of all your coin purchases and transfers</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, User, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-xs font-medium rounded-xl border border-gray-200 outline-none focus:border-[#397EF5] focus:bg-white transition-all text-[#20244F]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'buy', label: 'Bought' },
            { id: 'send', label: 'Sent' },
            { id: 'receive', label: 'Received' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-[#397EF5] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <Clock className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-600">No matching transactions found</p>
          <p className="text-xs text-gray-400">Try adjusting your filter tab or search query</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto pr-1">
          {filtered.map((tx) => {
            const isBuy = tx.transactionType === 'buy';
            const isSender = tx.senderUid === currentUid;

            let icon = <PlusCircle className="w-5 h-5 text-blue-500" />;
            let bgClass = 'bg-blue-50';
            let title = 'Bought Coins';
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
              <div
                key={tx.transactionId}
                onClick={() => setSelectedTx(tx)}
                className="py-3.5 flex items-center justify-between space-x-3 hover:bg-gray-50 p-2 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl ${bgClass} flex-shrink-0`}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#20244F] truncate">{title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{formatDateTime(tx.createdAt)}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-black font-mono ${colorClass}`}>
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

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl space-y-4 animate-scale-up border border-gray-100 relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#20244F]">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h3 className="text-base font-extrabold">Transaction Details</h3>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction ID:</span>
                <button
                  onClick={() => handleCopy(selectedTx.transactionId)}
                  className="font-mono font-bold text-[#397EF5] flex items-center space-x-1 hover:underline"
                >
                  <span>{selectedTx.transactionId}</span>
                  {copiedTxId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-bold uppercase text-[#20244F]">{selectedTx.transactionType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Coin Amount:</span>
                <span className="font-bold font-mono text-[#397EF5] text-sm">
                  {formatCoins(selectedTx.coinAmount)} Coins
                </span>
              </div>

              {selectedTx.amountInINR ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid Amount (INR):</span>
                  <span className="font-bold font-mono text-gray-800">
                    {formatCurrency(selectedTx.amountInINR)}
                  </span>
                </div>
              ) : null}

              {selectedTx.senderUserId ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Sender ID:</span>
                  <span className="font-mono font-bold text-gray-800">{selectedTx.senderUserId}</span>
                </div>
              ) : null}

              {selectedTx.recipientUserId ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipient ID:</span>
                  <span className="font-mono font-bold text-gray-800">{selectedTx.recipientUserId}</span>
                </div>
              ) : null}

              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="font-medium text-gray-700">{formatDateTime(selectedTx.createdAt)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold uppercase text-emerald-600">{selectedTx.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
