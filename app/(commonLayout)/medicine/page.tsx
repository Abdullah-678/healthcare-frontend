"use client";

import {
  ArrowRight,
  HeartPulse,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Pill,
  ShieldCheck,
} from "lucide-react";

const medicines = [
  {
    name: "Paracetamol",
    generic: "Paracetamol 500mg",
    category: "Pain Relief",
    price: "$5.00",
    stock: "In Stock",
    description: "Used for temporary relief from pain and fever.",
  },
  {
    name: "Amoxicillin",
    generic: "Amoxicillin 500mg",
    category: "Antibiotic",
    price: "$12.00",
    stock: "In Stock",
    description: "An antibiotic used to treat certain bacterial infections.",
  },
  {
    name: "Omeprazole",
    generic: "Omeprazole 20mg",
    category: "Digestive Health",
    price: "$8.50",
    stock: "In Stock",
    description:
      "Helps reduce stomach acid and relieve acid-related conditions.",
  },
  {
    name: "Cetirizine",
    generic: "Cetirizine 10mg",
    category: "Allergy",
    price: "$6.00",
    stock: "In Stock",
    description: "Provides relief from common allergy symptoms.",
  },
  {
    name: "Ibuprofen",
    generic: "Ibuprofen 400mg",
    category: "Pain Relief",
    price: "$7.50",
    stock: "Low Stock",
    description: "Used to reduce pain, inflammation, and fever.",
  },
  {
    name: "Vitamin D3",
    generic: "Vitamin D3 1000 IU",
    category: "Vitamins",
    price: "$10.00",
    stock: "In Stock",
    description: "Supports healthy bones, muscles, and immune function.",
  },
];

const MedicinePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <Pill className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-black">
            Medicines
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Find the medicines and healthcare products you need.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-black focus-within:shadow-md">
            <Search className="mr-3 h-5 w-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {[
            "All Medicines",
            "Pain Relief",
            "Antibiotic",
            "Allergy",
            "Vitamins",
            "Digestive Health",
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

        {/* Top Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">
              Available Medicines
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Browse our available medicines
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white sm:flex">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {medicines.map((medicine) => (
            <div
              key={medicine.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white">
                  <Pill className="h-7 w-7" />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    medicine.stock === "Low Stock"
                      ? "bg-gray-200 text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {medicine.stock}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {medicine.category}
                </p>

                <h3 className="mt-2 text-xl font-bold text-black">
                  {medicine.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-500">
                  {medicine.generic}
                </p>

                <p className="mt-4 min-h-12 text-sm leading-6 text-gray-500">
                  {medicine.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>

                    <p className="mt-1 text-2xl font-bold text-black">
                      {medicine.price}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center rounded-xl border border-gray-200">
                    <button className="p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="px-2 text-sm font-semibold text-black">
                      1
                    </span>

                    <button className="p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Section */}
        <div className="mt-10 rounded-2xl bg-black p-7 text-white shadow-lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-black">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Safe and Reliable Medicines</h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Always follow your doctor's prescription and recommended dosage.
                Consult a healthcare professional before starting a new
                medicine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePage;
