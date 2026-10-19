"use client";

import {
  Activity,
  Check,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const healthPlans = [
  {
    name: "Basic Care",
    description: "Essential healthcare support for your everyday needs.",
    price: "$19",
    period: "/month",
    icon: <Activity className="h-6 w-6" />,
    features: [
      "Basic health monitoring",
      "Monthly health checkup",
      "Access to general physicians",
      "Health progress tracking",
    ],
  },
  {
    name: "Healthy Life",
    description: "A complete plan for regular health management.",
    price: "$39",
    period: "/month",
    popular: true,
    icon: <HeartPulse className="h-6 w-6" />,
    features: [
      "Everything in Basic Care",
      "Monthly doctor consultation",
      "Diagnostic test discounts",
      "Personalized health tracking",
      "Priority appointment booking",
    ],
  },
  {
    name: "Premium Care",
    description: "Advanced healthcare support with personalized care.",
    price: "$69",
    period: "/month",
    icon: <ShieldCheck className="h-6 w-6" />,
    features: [
      "Everything in Healthy Life",
      "Unlimited doctor consultations",
      "Advanced diagnostic support",
      "Personalized health plan",
      "24/7 healthcare assistance",
      "Priority specialist consultation",
    ],
  },
];

const HealthPlansPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <Stethoscope className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-black">
            Health Plans
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Choose a healthcare plan that fits your needs and helps you stay
            healthy.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {healthPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular
                  ? "border-black ring-2 ring-black"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className="p-7 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                  {plan.icon}
                </div>

                <h2 className="mt-6 text-2xl font-bold text-black">
                  {plan.name}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="border-y border-gray-100 px-7 py-6">
                <div className="flex items-end">
                  <span className="text-4xl font-bold text-black">
                    {plan.price}
                  </span>

                  <span className="mb-1 ml-1 text-sm text-gray-500">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-1 flex-col px-7 py-6">
                <p className="mb-4 text-sm font-semibold text-black">
                  What's included
                </p>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                        <Check className="h-3 w-3" />
                      </div>

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  className={`mt-8 w-full rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-black bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 rounded-2xl bg-black p-8 text-white shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold">
                Take control of your health
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Get personalized healthcare support, track your progress, and
                stay connected with your doctors.
              </p>
            </div>

            <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
              Explore Healthcare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPlansPage;
