import React from 'react';

interface ChurnRiskCardProps {
  userName: string;
  userEmail: string;
  riskScore: number;
  confidence: number;
  lastActive: string;
  subscription?: {
    plan: string;
    currentPeriodEnd: Date;
  } | null;
}

export default function ChurnRiskCard({
  userName,
  userEmail,
  riskScore,
  confidence,
  lastActive,
  subscription
}: ChurnRiskCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 0.8) return 'text-red-400 bg-red-500/20';
    if (score >= 0.6) return 'text-orange-400 bg-orange-500/20';
    if (score >= 0.4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return 'Critical';
    if (score >= 0.6) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  const riskLevel = getRiskLevel(riskScore);
  const riskColor = getRiskColor(riskScore);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white">{userName}</h4>
          <p className="text-sm text-gray-400">{userEmail}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${riskColor}`}>
          {riskLevel}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Risk Score:</span>
          <span className="text-white font-medium">{(riskScore * 100).toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Confidence:</span>
          <span className="text-white font-medium">{(confidence * 100).toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Active:</span>
          <span className="text-white font-medium">{new Date(lastActive).toLocaleDateString()}</span>
        </div>
        
        {subscription && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Plan:</span>
            <span className="text-white font-medium">{subscription.plan}</span>
          </div>
        )}
      </div>
      
      {/* Risk Score Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              riskScore >= 0.8 ? 'bg-red-500' :
              riskScore >= 0.6 ? 'bg-orange-500' :
              riskScore >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${riskScore * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
