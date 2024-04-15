"use client"
import SegmentPage from "@/components/segments/Segment";

const breadcrumbItems = [{ title: "User", link: "/dashboard/segments" }];
export default function page() {
  return (
    <div>
      <SegmentPage/>
    </div>
  );
}
