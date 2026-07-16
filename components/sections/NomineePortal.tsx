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
    <section id="portal" className="py-24 relative border-t border-white/10 bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-cyan-500/10 text-xs uppercase font-bold tracking-widest text-cyan-400 border border-cyan-500/30 mb-4">
            <ShieldCheck className="w-4 h-4" /> Exclusive Access
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">Nominee Portal</h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base max-w-lg mx-auto">
            Log in with your Nominee ID and PIN to view your real-time voting dashboard and M-Pesa receipts.
          </p>
        </div>

        {/* Login / Change PIN Forms */}
        {step !== "DASHBOARD" && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl max-w-md mx-auto relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />

            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm text-center font-medium">
                {error}
              </div>
            )}

            {step === "LOGIN" && (
              <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300 relative z-10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nominee ID</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      required
                      value={nomineeId}
                      onChange={(e) => setNomineeId(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
                      placeholder="Enter your ID (e.g., 42)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Access PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
                      placeholder="Enter 4-digit PIN"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wide rounded-xl py-3.5 mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {loading ? "Verifying..." : "Login to Dashboard"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === "CHANGE_PIN" && (
              <form onSubmit={handleChangePin} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300 relative z-10">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-bold text-lg font-serif">Action Required</h3>
                  <p className="text-slate-400 text-xs mt-1">For security, you must change your default PIN before accessing your dashboard.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Create New PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newPinCode}
                      onChange={(e) => setNewPinCode(e.target.value)}
                      className="w-full bg-slate-950 border border-amber-500/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                      placeholder="Enter new 4+ digit PIN"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tracking-wide rounded-xl py-3.5 mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {loading ? "Updating..." : "Save & Continue"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* The Dashboard */}
        {step === "DASHBOARD" && dashboardData && (
          <div className="bg-slate-900 border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto animate-in zoom-in-95 duration-500 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4 relative z-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">{dashboardData.name}</h3>
                <p className="text-purple-400 text-sm font-medium mt-1">{dashboardData.category}</p>
              </div>
              <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full transition-colors hover:bg-white/10">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              
              <div className="md:col-span-1 bg-slate-950 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
                <Activity className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Verified Votes</p>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                  {dashboardData.totalVotes}
                </span>
              </div>

              <div className="md:col-span-2 bg-slate-950/50 border border-white/5 rounded-2xl p-6 shadow-inner">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Recent Valid Votes
                </h4>
                
                {dashboardData.recentVotes.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6 italic">No votes recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.recentVotes.map((vote: any) => (
                      <div key={vote.id} className="flex items-center justify-between bg-slate-900 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-md">+{vote.votes}</div>
                          <span className="text-slate-300 text-sm font-medium">{vote.identifier}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(vote.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {dashboardData.recentVotes.length > 0 && (
                  <p className="text-center text-[10px] text-slate-500 mt-5 uppercase tracking-widest font-bold">Showing last 10 transactions</p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}