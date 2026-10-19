"use client";

import {
  ArrowRight,
  Building2,
  Heart,
  HeartHandshake,
  MapPin,
  Users,
} from "lucide-react";

const ngos = [
  {
    name: "Hope for Children",
    description:
      "Supporting children and families with healthcare, education, and essential resources.",
    focus: "Child Healthcare",
    location: "Dhaka, Bangladesh",
    members: "500+ Volunteers",
  },
  {
    name: "Care & Support Foundation",
    description:
      "Providing affordable healthcare and medical assistance to underserved communities.",
    focus: "Community Health",
    location: "Chattogram, Bangladesh",
    members: "300+ Volunteers",
  },
  {
    name: "Health for All",
    description:
      "Working to make essential healthcare services accessible to low-income communities.",
    focus: "Public Health",
    location: "Cumilla, Bangladesh",
    members: "250+ Volunteers",
  },
  {
    name: "Helping Hands Bangladesh",
    description:
      "Supporting vulnerable families through medical aid, food assistance, and social programs.",
    focus: "Social Welfare",
    location: "Rajshahi, Bangladesh",
    members: "400+ Volunteers",
  },
  {
    name: "Life Care Initiative",
    description:
      "Improving healthcare awareness and providing medical support in rural communities.",
    focus: "Rural Healthcare",
    location: "Rangpur, Bangladesh",
    members: "180+ Volunteers",
  },
  {
    name: "Hope & Humanity",
    description:
      "Connecting volunteers and donors with communities that need healthcare and humanitarian support.",
    focus: "Humanitarian Aid",
    location: "Sylhet, Bangladesh",
    members: "350+ Volunteers",
  },
];

const NgosPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <HeartHandshake className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-black">
            NGOs & Organizations
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Discover organizations working to improve healthcare and support
            communities in need.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Building2 className="mx-auto h-7 w-7 text-black" />
            <p className="mt-3 text-3xl font-bold text-black">120+</p>
            <p className="mt-1 text-sm text-gray-500">Organizations</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Users className="mx-auto h-7 w-7 text-black" />
            <p className="mt-3 text-3xl font-bold text-black">5K+</p>
            <p className="mt-1 text-sm text-gray-500">Volunteers</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <Heart className="mx-auto h-7 w-7 text-black" />
            <p className="mt-3 text-3xl font-bold text-black">50K+</p>
            <p className="mt-1 text-sm text-gray-500">People Supported</p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            Featured Organizations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Find an organization that matches your interests
          </p>
        </div>

        {/* NGO Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ngos.map((ngo) => (
            <div
              key={ngo.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between bg-black p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-black">
                  <HeartHandshake className="h-7 w-7" />
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  NGO
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black">{ngo.name}</h3>

                <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  {ngo.focus}
                </span>

                <p className="mt-4 min-h-18 text-sm leading-6 text-gray-500">
                  {ngo.description}
                </p>

                <div className="my-5 h-px bg-gray-100" />

                {/* Location */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-black" />
                  <span>{ngo.location}</span>
                </div>

                {/* Volunteers */}
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-black" />
                  <span>{ngo.members}</span>
                </div>

                {/* Button */}
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-black p-8 text-white shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold">Make a difference today</h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Support healthcare initiatives, volunteer your time, or connect
                with an organization working for a better community.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
              <Heart className="h-4 w-4" />
              Support an NGO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgosPage;
