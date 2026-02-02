interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export default function StatCard({ label, value, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
