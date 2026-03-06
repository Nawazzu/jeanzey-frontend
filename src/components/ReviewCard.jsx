import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewCard = ({ review, index }) => {
  // Format date safely
  const formattedDate = review?.date
    ? new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Date unavailable';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-800 capitalize">
            {review.name || 'Customer'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={15}
              className={
                i < review.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
      </div>

      <p className="text-sm mt-4 text-gray-700 leading-relaxed italic">
        “{review.comment || 'No comment provided'}”
      </p>
    </motion.div>
  );
};

export default ReviewCard;
