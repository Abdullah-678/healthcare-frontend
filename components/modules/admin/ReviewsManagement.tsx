"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareQuote, Search, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminReviews } from "@/services/review.service";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const ReviewsManagement = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });

  const filteredReviews = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return [...reviews]
      .filter(
        ({ rating }) =>
          ratingFilter === "ALL" || rating === Number(ratingFilter),
      )
      .filter((review) => {
        if (!searchTerm) return true;
        return [
          review.id,
          review.patient?.name,
          review.doctor?.name,
          review.comment,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }, [ratingFilter, reviews, search]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";
  const positiveReviews = reviews.filter(({ rating }) => rating >= 4).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <p className="text-sm text-muted-foreground">
          Review patient feedback and ratings across all doctors.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Total reviews <MessageSquareQuote className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : reviews.length}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Average rating <Star className="h-4 w-4" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : `${averageRating} / 5`}
          </p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Positive (4+ stars)</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "…" : positiveReviews}
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search reviews"
              className="pl-9"
              placeholder="Search patient, doctor, or comment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter reviews by rating"
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
          >
            <option value="ALL">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} {rating === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
        </div>

        {isError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? `Unable to load reviews: ${error.message}`
                : "Unable to load reviews."}
            </p>
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading reviews...
                    </TableCell>
                  </TableRow>
                ) : filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {reviews.length
                        ? "No reviews match your filters."
                        : "No reviews found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        {review.patient?.name ?? "Unknown patient"}
                      </TableCell>
                      <TableCell>
                        {review.doctor?.name ?? "Unknown doctor"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <Star
                            aria-hidden="true"
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                          {review.rating.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md whitespace-normal">
                        {review.comment || "No written comment."}
                      </TableCell>
                      <TableCell>{formatDate(review.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewsManagement;
