"use client";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  FlaskConical,
  HeartPulse,
  Search,
  Stethoscope,
} from "lucide-react";

const diagnostics = [
  {
    name: "Complete Blood Count",
    shortName: "CBC",
    description: "Measures red blood cells, white blood cells, and platelets.",
    category: "Blood Test",
    price: "$25",
    icon: <FlaskConical className="h-6 w-6" />,
  },
  {
    name: "Blood Glucose Test",
    shortName: "Glucose",
    description: "Checks the amount of glucose present in your blood.",
    category: "Blood Test",
    price: "$15",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    name: "Lipid Profile",
    shortName: "Lipid",
    description: "Measures cholesterol and triglyceride levels in your blood.",
    category: "Blood Test",
    price: "$30",
    icon: <HeartPulse className="h-6 w-6" />,
  },
  {
    name: "Thyroid Function Test",
    shortName: "TFT",
    description: "Evaluates thyroid hormone levels and thyroid function.",
    category: "Hormone Test",
    price: "$35",
    icon: <Stethoscope className="h-6 w-6" />,
  },
  {
    name: "Urine Routine Test",
    shortName: "Urine R/E",
    description: "Analyzes urine to identify possible health conditions.",
    category: "Urine Test",
    price: "$12",
    icon: <FlaskConical className="h-6 w-6" />,
  },
  {
    name: "Liver Function Test",
    shortName: "LFT",
    description: "Checks enzymes and proteins related to liver health.",
    category: "Blood Test",
    price: "$40",
    icon: <HeartPulse className="h-6 w-6" />,
  },
];

const DiagnosticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <FlaskConical className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-black">
            Diagnostics
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Find and book diagnostic tests for your health and wellness.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-10 max-w-2xl">
          <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-black focus-within:shadow-md">
            <Search className="mr-3 h-5 w-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search diagnostic tests..."
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {[
            "All Tests",
            "Blood Test",
            "Urine Test",
            "Hormone Test",
            "Imaging",
          ].map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                index === 0
                  ? "bg-black text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Available Tests</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a diagnostic test that you need
            </p>
          </div>

          <span className="hidden rounded-full bg-black px-4 py-2 text-sm font-medium text-white sm:block">
            {diagnostics.length} Tests
          </span>
        </div>

        {/* Diagnostic Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diagnostics.map((test) => (
            <div
              key={test.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              {/* Card Top */}
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                  {test.icon}
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Available
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {test.category}
                </p>

                <h3 className="text-xl font-bold text-black">{test.name}</h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
                  {test.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Test price</p>
                    <p className="mt-1 text-2xl font-bold text-black">
                      {test.price}
                    </p>
                  </div>

                  <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
                    Book
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Information */}
        <div className="mt-10 rounded-2xl bg-black p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Need a diagnostic test?</h2>

              <p className="mt-2 text-sm text-gray-400">
                Schedule your test and get reliable results from our diagnostic
                services.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
              <CalendarDays className="h-4 w-4" />
              Schedule Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;
