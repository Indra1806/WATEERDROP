export default function AdminOrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-56"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
      </div>
      {/* Body */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-300 rounded w-24 mt-2"></div>
      </div>
      {/* Footer */}
      <div className="border-t border-gray-200 mt-4 pt-4 flex items-center gap-4">
        <div className="h-4 bg-gray-300 rounded w-28"></div>
        <div className="h-9 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}