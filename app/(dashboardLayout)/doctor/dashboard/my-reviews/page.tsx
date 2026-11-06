import Link from "next/link";
import { ArrowLeft, MessageSquareQuote, Star } from "lucide-react";
import { getDoctorDashboardData } from "@/services/doctor-dashboard.service";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MyReviewsPage = async () => {
  const { reviews } = await getDoctorDashboardData();

  const sortedReviews = [...reviews].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Doctor dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              My reviews
            </h1>
          </div>

          <Link
            href="/doctor/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to dashboard
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Average rating</p>
            <div className="mt-4 flex items-center gap-2">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              <span className="text-3xl font-bold text-slate-950">
                {averageRating}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Across {reviews.length} reviews</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Positive feedback</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {reviews.filter((review) => review.rating >= 4).length}
            </p>
            <p className="mt-1 text-xs text-slate-500">4.0+ star reviews</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Latest review</p>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {sortedReviews[0]?.rating.toFixed(1) ?? "0.0"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {sortedReviews[0] ? formatDate(sortedReviews[0].createdAt) : "No review yet"}
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Patient feedback</h2>
              <p className="mt-1 text-sm text-slate-500">
                Reviews and notes shared by your patients
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {reviews.length} total
            </span>
          </div>

          {sortedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <MessageSquareQuote className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No reviews yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Patient feedback will appear here once consultations are completed.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedReviews.map((review) => (
                <article key={review.id} className="px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        Patient
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">
                        {review.patient.name}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                      <Star aria-hidden="true" className="h-4 w-4 fill-current" />
                      {review.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {review.comment || "No written comment provided."}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Reviewed on {formatDate(review.createdAt)}</span>
                    <span className="font-medium text-slate-600">
                      {review.rating >= 4 ? "Positive" : review.rating >= 3 ? "Neutral" : "Needs attention"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MyReviewsPage;
