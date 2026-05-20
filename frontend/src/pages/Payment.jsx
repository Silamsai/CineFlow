import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Smartphone, Building2, Wallet, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay using UPI ID or QR code', fields: ['upiId'] },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay', fields: ['cardNumber', 'expiry', 'cvv', 'name'] },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks supported', fields: ['bank'] },
  { id: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Paytm, PhonePe, Amazon Pay', fields: ['wallet'] },
];

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Bank of Baroda'];
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'];

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [fields, setFields] = useState({ upiId: '', cardNumber: '', expiry: '', cvv: '', name: '', bank: BANKS[0], wallet: WALLETS[0] });

  const bookingData = JSON.parse(sessionStorage.getItem('cineflow_booking') || 'null');
  if (!bookingData?.show) {
    navigate('/movies');
    return null;
  }
  const { movie, show, selectedSeats = [], total = 0 } = bookingData;
  const convenience = Math.round(total * 0.02);
  const grandTotal = total + convenience;

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate payment

    // Generate booking reference
    const ref = `CF${Date.now().toString().slice(-8).toUpperCase()}`;
    const booking = {
      ref,
      movie,
      show,
      selectedSeats,
      total: grandTotal,
      user: { name: `${user?.firstName} ${user?.lastName}`, email: user?.email },
      paymentMethod: method,
      bookedAt: new Date().toISOString(),
    };

    // Store in localStorage (user's bookings)
    const existing = JSON.parse(localStorage.getItem(`cineflow_bookings_${user?.id}`) || '[]');
    existing.unshift(booking);
    localStorage.setItem(`cineflow_bookings_${user?.id}`, JSON.stringify(existing));
    sessionStorage.setItem('cineflow_confirmation', JSON.stringify(booking));
    sessionStorage.removeItem('cineflow_booking');

    navigate(`/booking-confirmation/${ref}`);
  };

  const field = (key, label, placeholder, type = 'text', maxLen) => (
    <div>
      <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={fields[key]} maxLength={maxLen}
        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))} required
        className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
    </div>
  );

  return (
    <main className="min-h-screen bg-cinema-black pt-14 pb-10">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-cinema-off-white">Complete Payment</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment form */}
          <div className="lg:col-span-2">
            {/* Method selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${method === m.id ? 'border-cinema-red bg-cinema-red/10' : 'border-cinema-border bg-cinema-dark hover:border-cinema-red/40'}`}>
                  <m.icon className={`w-5 h-5 mb-1.5 ${method === m.id ? 'text-cinema-red' : 'text-cinema-muted'}`} />
                  <p className={`text-xs font-bold ${method === m.id ? 'text-cinema-off-white' : 'text-cinema-muted'}`}>{m.label}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment}>
              <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-5 space-y-4 mb-4">
                {method === 'upi' && field('upiId', 'UPI ID', 'yourname@upi')}
                {method === 'card' && <>
                  {field('cardNumber', 'Card Number', '1234 5678 9012 3456', 'text', 19)}
                  <div className="grid grid-cols-2 gap-4">
                    {field('expiry', 'Expiry', 'MM/YY', 'text', 5)}
                    {field('cvv', 'CVV', '•••', 'password', 3)}
                  </div>
                  {field('name', 'Name on Card', 'John Doe')}
                </>}
                {method === 'netbanking' && (
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Select Bank</label>
                    <select value={fields.bank} onChange={e => setFields(f => ({ ...f, bank: e.target.value }))}
                      className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red">
                      {BANKS.map(b => <option key={b} value={b}>{b} Bank</option>)}
                    </select>
                  </div>
                )}
                {method === 'wallet' && (
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Select Wallet</label>
                    <div className="grid grid-cols-2 gap-2">
                      {WALLETS.map(w => (
                        <button key={w} type="button" onClick={() => setFields(f => ({ ...f, wallet: w }))}
                          className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${fields.wallet === w ? 'border-cinema-red bg-cinema-red/10 text-cinema-off-white' : 'border-cinema-border text-cinema-muted hover:border-cinema-red/40'}`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={processing}
                className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-3 text-base">
                {processing ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing Payment...</>
                ) : (
                  <><CheckCircle className="w-5 h-5" /> Pay ₹{grandTotal.toLocaleString('en-IN')}</>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-5 sticky top-20">
              <h3 className="font-display text-lg font-bold text-cinema-off-white mb-4">Order Summary</h3>
              <div className="flex gap-3 mb-4 pb-4 border-b border-cinema-border">
                <img src={movie.posterUrl} alt={movie.title} className="w-14 h-20 object-cover rounded-lg"
                  onError={e => { e.target.src = `https://placehold.co/56x80/1a1a1a/E50914?text=${movie.title[0]}`; }} />
                <div>
                  <p className="text-cinema-off-white font-bold text-sm">{movie.title}</p>
                  <p className="text-cinema-muted text-xs mt-1">{show.theaterName}</p>
                  <p className="text-cinema-muted text-xs">{show.showTime} • {show.format}</p>
                  <p className="text-cinema-red text-xs font-semibold mt-1">{selectedSeats.join(', ')}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-cinema-muted">
                  <span>{selectedSeats.length} ticket{selectedSeats.length > 1 ? 's' : ''}</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-cinema-muted">
                  <span>Convenience fee (2%)</span>
                  <span>₹{convenience.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-cinema-off-white font-bold text-base border-t border-cinema-border pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-cinema-red">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="mt-4 bg-cinema-red/10 border border-cinema-red/30 rounded-xl p-3 text-xs text-cinema-muted">
                🔒 Secure payment. Tickets emailed to <span className="text-cinema-off-white">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
