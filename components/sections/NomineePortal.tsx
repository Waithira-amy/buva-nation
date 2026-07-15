"use client";
import { useState } from "react";
import { Lock, User, KeyRound, ArrowRight, ShieldCheck, Activity, LogOut } from "lucide-react";

export default function NomineePortal() {
  const [step, setStep] = useState<"LOGIN" | "CHANGE_PIN" | "DASHBOARD">("LOGIN");
  const [nomineeId, setNomineeId] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [newPinCode, setNewPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/nominee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: nomineeId, pinCode }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else if (data.requiresPinChange) {
        setStep("CHANGE_PIN");
      } else {
        setDashboardData(data.nominee);
        setStep("DASHBOARD");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/nominee/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: nomineeId, oldPin: pinCode, newPin: newPinCode }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        setDashboardData(data.nominee);
        setStep("DASHBOARD");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStep("LOGIN");
    setNomineeId("");
    setPinCode("");
    setNewPinCode("");
    setDashboardData(null);
  };

  return (
    <section id="nominee-portal" className="py-24 relative border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        
        {}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-mta-gold/10 text-xs uppercase font-bold tracking-widest text-mta-gold border border-mta-gold/20 mb-4">
            <ShieldCheck className="w-4 h-4" /> Exclusive Access
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Nominee Portal</h2>
          <p className="text-mta-cream/60 mt-3 text-sm md:text-base max-w-lg mx-auto">
            Log in with your Nominee ID and PIN to view your real-time voting dashboard.
          </p>
        </div>

        {}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl max-w-md mx-auto relative overflow-hidden">
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {step === "LOGIN" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mta-cream/70 mb-2">Nominee ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mta-cream/40" />
                  <input
                    type="number"
                    required
                    value={nomineeId}
                    onChange={(e) => setNomineeId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-mta-gold/50 transition-colors"
                    placeholder="Enter your ID (e.g., 42)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mta-cream/70 mb-2">Access PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mta-cream/40" />
                  <input
                    type="password"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-mta-gold/50 transition-colors"
                    placeholder="Enter 4-digit PIN"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-mta-gold text-mta-dark font-bold tracking-wide rounded-xl py-3.5 mt-2 hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Login to Dashboard"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === "CHANGE_PIN" && (
            <form onSubmit={handleChangePin} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-mta-red/20 text-mta-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg">Action Required</h3>
                <p className="text-mta-cream/60 text-xs mt-1">For security, you must change your default PIN before accessing your dashboard.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mta-cream/70 mb-2">Create New PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mta-cream/40" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value)}
                    className="w-full bg-black/40 border border-mta-gold/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-mta-gold transition-colors"
                    placeholder="Enter new 4+ digit PIN"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-mta-red text-white font-bold tracking-wide rounded-xl py-3.5 mt-2 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-mta-red/20"
              >
                {loading ? "Updating..." : "Save & Continue"}
              </button>
            </form>
          )}
        </div>

        {}
        {step === "DASHBOARD" && dashboardData && (
          <div className="bg-white/5 backdrop-blur-xl border border-mta-gold/20 p-6 md:p-10 rounded-3xl shadow-2xl max-w-3xl mx-auto animate-in zoom-in-95 duration-500 mt-[-20rem]">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">{dashboardData.name}</h3>
                <p className="text-mta-gold text-sm font-medium mt-1">{dashboardData.category}</p>
              </div>
              <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-mta-cream/50 hover:text-white flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-1 bg-gradient-to-br from-mta-dark to-black border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner">
                <Activity className="w-8 h-8 text-mta-red mb-3 opacity-80" />
                <p className="text-xs font-bold uppercase tracking-widest text-mta-cream/60 mb-1">Total Verified Votes</p>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-mta-cream">
                  {dashboardData.totalVotes}
                </span>
              </div>

              <div className="md:col-span-2 bg-black/30 border border-white/5 rounded-2xl p-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-white/10 pb-3">Recent Valid Votes</h4>
                
                {dashboardData.recentVotes.length === 0 ? (
                  <p className="text-mta-cream/40 text-sm text-center py-6 italic">No votes recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.recentVotes.map((vote: any) => (
                      <div key={vote.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 text-green-400 text-[10px] font-black px-2 py-1 rounded">+{vote.votes}</div>
                          <span className="text-mta-cream text-sm font-medium">{vote.identifier}</span>
                        </div>
                        <span className="text-xs text-mta-cream/40">
                          {new Date(vote.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {dashboardData.recentVotes.length > 0 && (
                  <p className="text-center text-[10px] text-mta-cream/30 mt-4 uppercase tracking-widest">Showing last 10 transactions</p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}