import SegmentPage from "@/components/segments/Segment";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];
export default function page() {
  return (
    <>
      <div className="container mx-auto px-4 mt-20 relative lg:left-[10%] sm:px-6 lg:px-8 md:w-[1000px] lg:w-[1200px] flex-wrap">
        <div className=" lg:min-h-[38rem]">
          <SegmentPage />
        </div>
      </div>
    </>
  );
}
