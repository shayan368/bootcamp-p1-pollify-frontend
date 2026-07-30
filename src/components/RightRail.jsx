import ProfileCard from "./ProfileCard";
import PollTypeStats from "./PollTypeStats";

export default function RightRail() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 flex-col gap-4 overflow-y-auto py-6 lg:flex">
      <ProfileCard />
      <PollTypeStats />
    </aside>
  );
}
