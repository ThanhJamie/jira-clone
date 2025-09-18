"use client";

import { OrganizationList } from "@clerk/nextjs";

export default function Onboarding() {
  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        // Khi user chọn / tạo, Clerk sẽ setActive rồi ĐIỀU HƯỚNG tới slug
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
}
