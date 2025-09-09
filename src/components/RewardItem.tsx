import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardApi } from "@/lib/api/rewardApi";
import { useSelectedRewardStore } from "@/store/useSelectedRewardStore";
import { useDrawerStore } from "@/store/useDrawerStore";
import { DrawerType } from "@/types";
import type { Reward } from "@/generated/prisma";
import { Star, Trash2, Edit, Crown, Sparkles, TrendingUp } from "lucide-react";
import { IconButton } from "./IconButton";
import { ProgressButton } from "./ProgressButton";
import RedeemButton from "./RedeemButton";
import { RewardProgressBar } from "./RewardProgressBar";
import { useTotalPoints } from "@/hooks/useTotalPoints";
import { motion } from "framer-motion";

interface RewardItemProps {
  reward: Reward;
}

export const RewardItem = ({ reward }: RewardItemProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient();
  const { setSelectedRewardId } = useSelectedRewardStore();
  const { openDrawer } = useDrawerStore();
  const { totalPoints, isLoading: isLoadingPoints } = useTotalPoints();

  // Redeem reward mutation
  const { mutate: redeemReward, isPending: isRedeeming } = useMutation({
    mutationFn: (id: string) => rewardApi.redeem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reward"] });
    },
  });

  // Delete reward mutation
  const { mutate: deleteReward } = useMutation({
    mutationFn: (id: string) => rewardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reward"] });
    },
  });

  const handleRedeem = (e: React.MouseEvent) => { 
    debugger;
    e.stopPropagation();
    redeemReward(reward.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteReward(reward.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setSelectedRewardId(reward.id);
    // openDrawer(DrawerType.REWARD_DETAILS);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === reward.imageCollection.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? reward.imageCollection.length - 1 : prev - 1
    );
  };

  const isAffordable = totalPoints >= reward.cost;
  const progressPercentage = Math.min((totalPoints / reward.cost) * 100, 100);

  return (
    <motion.div
      className={`group relative rounded-2xl border transition-all duration-700 overflow-hidden ${
        reward.isRedeemed
          ? "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border-zinc-600/30 opacity-70"
          : isAffordable
          ? "bg-gradient-to-br from-emerald-900/20 via-zinc-800 to-emerald-900/20 border-emerald-500/40 hover:border-emerald-400/60 hover:shadow-emerald-500/25 hover:shadow-2xl"
          : progressPercentage >= 80
          ? "bg-gradient-to-br from-blue-900/20 via-zinc-800 to-blue-900/20 border-blue-500/40 hover:border-blue-400/60 hover:shadow-blue-500/25 hover:shadow-2xl"
          : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 hover:border-zinc-600/70 hover:shadow-zinc-500/10 hover:shadow-lg"
      }`}
      onClick={() => {
        setSelectedRewardId(reward.id);
        // openDrawer(DrawerType.REWARD_DETAILS);
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Epic Background Effects */}
      {isAffordable && !reward.isRedeemed && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-emerald-400/10"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {progressPercentage >= 80 && !reward.isRedeemed && !isAffordable && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-blue-400/10"
            animate={{
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {/* Floating Sparkles for High-Value Rewards */}
      {isAffordable && !reward.isRedeemed && (
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="text-emerald-400" size={20} />
        </motion.div>
      )}
      {/* Header Section */}
      <div className="relative p-4 pb-2">
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isAffordable && !reward.isRedeemed && (
            <motion.div
              className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/40 rounded-full backdrop-blur-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <Crown size={12} />
                READY!
              </span>
            </motion.div>
          )}
          {!isAffordable && progressPercentage >= 80 && !reward.isRedeemed && (
            <motion.div
              className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/40 rounded-full backdrop-blur-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                <TrendingUp size={12} />
                CLOSE!
              </span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
          <IconButton
            icon={<Edit size={14} />}
            onClick={handleEdit}
          />
          <IconButton
            icon={<Trash2 size={14} />}
            onClick={handleDelete}
          />
        </div>

        {/* Image Carousel */}
        {reward.imageCollection.length > 0 && (
          <div className="relative mb-4 -mx-4 -mt-4">
            <img
              src={reward.imageCollection[currentImageIndex]}
              alt={reward.name}
              className="w-full h-64 object-cover"
            />
            
            {/* Image Navigation */}
            {reward.imageCollection.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute z-30 left-3 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-all duration-200"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute z-30 right-3 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-all duration-200"
                >
                  →
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {reward.imageCollection.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      animate={{
                        scale: index === currentImageIndex ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className={`text-xl font-bold ${
            reward.isRedeemed ? "line-through text-zinc-400" : "text-white"
          }`}>
            {reward.name}
          </h3>
          
          <p className={`text-sm leading-relaxed ${
            reward.isRedeemed ? "text-zinc-500" : "text-zinc-300"
          }`}>
            {reward.description}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-4 pb-2">
        {!isLoadingPoints && (
          <RewardProgressBar
            currentPoints={totalPoints}
            requiredPoints={reward.cost}
            rewardName={reward.name}
            isRedeemed={reward.isRedeemed}
          />
        )}
      </div>

      {/* Footer Section */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-between">
          {/* Points Display */}
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" size={18} />
            <span className="text-yellow-400 font-bold text-lg">
              {reward.cost}
            </span>
            <span className="text-zinc-400 text-sm">points</span>
          </div>

          {/* Action Button */}
          <div className="flex-1 max-w-[200px]  absolute  right-4 ml-4 w-full">
            {!reward.isRedeemed ? (
              isAffordable ? (
                <RedeemButton
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  isLoading={isRedeeming}
                />
              ) : (
                <ProgressButton
                  currentPoints={totalPoints}
                  requiredPoints={reward.cost}
                  disabled={true}
                />
              )
            ) : (
              <ProgressButton
                currentPoints={totalPoints}
                requiredPoints={reward.cost}
                isRedeemed={true}
                disabled={true}
              />
            )}
          </div>
        </div>

        {/* Redeemed Date */}
        {reward.redeemedAt && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-zinc-500">
              Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};