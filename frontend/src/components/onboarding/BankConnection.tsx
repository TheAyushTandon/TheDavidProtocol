'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Phone, ArrowRight, Loader2 } from 'lucide-react';

interface BankConnectionProps {
  userId: number;
  onSuccess: () => void;
}

const BankConnection: React.FC<BankConnectionProps> = ({ userId, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bank/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to connect');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Connect Your Bank Data</h2>
        <p className="text-slate-400">
          Enter the registered phone number to fetch your financial transactions for analysis.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>
            <p className="text-xs text-slate-500">
              Note: Use one of the registered test numbers provided by the admin.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !phoneNumber}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Secure Access</span>
          </div>
          <p className="text-xs text-slate-500">
            We only read transaction history to calculate your score.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Real-time Analysis</span>
          </div>
          <p className="text-xs text-slate-500">
            Get your resilience score within seconds of connecting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankConnection;
