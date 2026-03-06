import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonProductCard = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Product Image Skeleton */}
      <div className="bg-gray-100 rounded-2xl overflow-hidden">
        <Skeleton 
          height={320} 
          baseColor="#f3f4f6" 
          highlightColor="#e5e7eb"
          borderRadius={16}
        />
      </div>

      {/* Product Name Skeleton */}
      <Skeleton 
        height={16} 
        width="75%" 
        baseColor="#f3f4f6" 
        highlightColor="#e5e7eb"
      />

      {/* Product Price Skeleton */}
      <Skeleton 
        height={14} 
        width="35%" 
        baseColor="#f3f4f6" 
        highlightColor="#e5e7eb"
      />
    </div>
  );
};

export default SkeletonProductCard;