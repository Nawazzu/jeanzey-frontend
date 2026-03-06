import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonOrderCard = () => {
  return (
    <div className="border border-gray-200 p-6 rounded-lg space-y-4">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <Skeleton 
          height={20} 
          width={120}
          baseColor="#f3f4f6" 
          highlightColor="#e5e7eb"
        />
        <Skeleton 
          height={24} 
          width={80}
          borderRadius={12}
          baseColor="#f3f4f6" 
          highlightColor="#e5e7eb"
        />
      </div>

      {/* Order Items */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton 
              height={80} 
              width={80}
              borderRadius={8}
              baseColor="#f3f4f6" 
              highlightColor="#e5e7eb"
            />
            <div className="flex-1 space-y-2">
              <Skeleton 
                height={16} 
                width="60%"
                baseColor="#f3f4f6" 
                highlightColor="#e5e7eb"
              />
              <Skeleton 
                height={14} 
                width="40%"
                baseColor="#f3f4f6" 
                highlightColor="#e5e7eb"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <Skeleton 
        height={14} 
        width="50%"
        baseColor="#f3f4f6" 
        highlightColor="#e5e7eb"
      />
    </div>
  );
};

export default SkeletonOrderCard;