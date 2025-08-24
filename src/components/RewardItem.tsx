import PointsTag from "@/components/PointsTag";
import { IReward } from "@/types";
import { RewardDetailsDrawer } from "@/components/RewardDetailsDrawer";
import LockedInProgressButton from "./LockedInProgressButton";
import RedeemButton from "./RedeemButton";

const RewardItem = (props: {
  reward: IReward;
  setIsRewardDetailsDrawerOpen: (isOpen: boolean) => void;
}) => {
  const { reward, setIsRewardDetailsDrawerOpen } = props;
  return (
    <div
      className="cursor-pointer w-96 h-96 md:w-[500px] md:h-[500px] bg-zinc-800 hover:bg-zinc-700 p-4 flex-col justify-between rounded-lg flex items-center transition-all duration-300"
      key={reward.id}
      onClick={() => {
        setIsRewardDetailsDrawerOpen(true);
      }}
    >
      <p className="font-bold text-center text-lg">{reward.name}</p>
      <img
        className={`p-1 rounded-lg w-fit h-fit ${
          reward.isLocked ? "opacity-50" : "opacity-100"
        }`}
        src={reward.image}
        alt={""}
      ></img>
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row justify-between">
          <PointsTag
            label="Remaining: "
            className="bg-red-500"
            price={reward.price}
          ></PointsTag>
          <PointsTag
            label="Required: "
            className="bg-green-500"
            price={reward.price}
          ></PointsTag>
        </div>
        {reward.isLocked ? <LockedInProgressButton /> : <RedeemButton />}
      </div>
    </div>
  );
};

export default RewardItem;
