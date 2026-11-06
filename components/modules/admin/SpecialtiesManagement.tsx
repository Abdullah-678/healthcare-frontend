"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  createSpecialty,
  deleteSpecialty,
  getSpecialties,
  updateSpecialty,
  type ISpecialty,
} from "@/services/specialty.service";

const SpecialtiesManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [editingSpecialty, setEditingSpecialty] =
    useState<ISpecialty | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const {
    data: specialties = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: async () => (await getSpecialties()).data,
  });

  const filteredSpecialties = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return specialties.filter(({ title }) =>
      title.toLowerCase().includes(searchTerm),
    );
  }, [search, specialties]);

  const resetForm = () => {
    setTitle("");
    setEditingSpecialty(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    setIsSaving(true);
    try {
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, { title: normalizedTitle });
        toast.success("Specialty updated successfully.");
      } else {
        await createSpecialty({ title: normalizedTitle });
        toast.success("Specialty created successfully.");
      }
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["specialties"] });
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    } catch (error) {
      console.error("Failed to save specialty:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not save specialty.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (specialty: ISpecialty) => {
    if (
      !window.confirm(
        `Delete "${specialty.title}"? This may affect doctors assigned to it.`,
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteSpecialty(specialty.id);
      toast.success("Specialty deleted.");
      await queryClient.invalidateQueries({ queryKey: ["specialties"] });
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    } catch (error) {
      console.error("Failed to delete specialty:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete specialty.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Specialties Management</h1>
        <p className="text-sm text-muted-foreground">
          Create, update, and remove medical specialties offered by the clinic.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">
          {editingSpecialty ? "Edit specialty" : "Add a specialty"}
        </h2>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <Input
            aria-label="Specialty title"
            placeholder="e.g. Cardiology"
            maxLength={100}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button type="submit" disabled={isSaving}>
            {editingSpecialty ? <Pencil aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {isSaving
              ? "Saving..."
              : editingSpecialty
                ? "Save changes"
                : "Add specialty"}
          </Button>
          {editingSpecialty && (
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </form>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All specialties</h2>
            <p className="text-sm text-muted-foreground">
              {specialties.length} specialties available
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search specialties"
              className="pl-9"
              placeholder="Search specialties"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {isError ? (
          <div role="alert" className="space-y-3 py-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? `Unable to load specialties: ${error.message}`
                : "Unable to load specialties."}
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
                  <TableHead>Specialty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      Loading specialties...
                    </TableCell>
                  </TableRow>
                ) : filteredSpecialties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      {specialties.length
                        ? "No specialties match your search."
                        : "No specialties found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpecialties.map((specialty) => (
                    <TableRow key={specialty.id}>
                      <TableCell className="font-medium">
                        {specialty.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSaving}
                            onClick={() => {
                              setEditingSpecialty(specialty);
                              setTitle(specialty.title);
                            }}
                          >
                            <Pencil aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isSaving}
                            onClick={() => void handleDelete(specialty)}
                          >
                            <Trash2 aria-hidden="true" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
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

export default SpecialtiesManagement;
