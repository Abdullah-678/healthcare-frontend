"use client";

import { getDoctors } from "@/services/doctor.service";
import { useQuery } from "@tanstack/react-query";

const DoctorsList = () => {
  const { data: doctorData } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black">
            Our Doctors
          </h1>

          <p className="mt-2 text-gray-600">
            Meet our experienced and professional doctors
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctorData?.data.map((doctor: any) => (
            <div
              key={doctor.id}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Black Header */}
              <div className="bg-black px-6 py-8 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white text-3xl font-bold text-black shadow-lg">
                  {doctor.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black">
                    {doctor.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-gray-500">
                    Medical Doctor
                  </p>
                </div>

                <div className="my-6 h-px bg-gray-200" />

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-gray-500">Email</span>
                    <span className="truncate text-right text-black">
                      {doctor.email || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-500">Phone</span>
                    <span className="text-black">{doctor.phone || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-500">Gender</span>
                    <span className="text-black">{doctor.gender || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-500">Status</span>

                    <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      {doctor.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
