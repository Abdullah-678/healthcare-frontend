"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSpecialties } from "@/services/specialty.service";
import { createDoctor } from "@/services/doctor.service";
import { ICreateDoctorPayload } from "@/types/doctor.types";

interface Specialty {
  id: string;
  title: string;
}

const CreateDoctorPage = () => {
  const router = useRouter();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    name: "",
    email: "",
    registrationNumber: "",
    gender: "MALE",
    appointmentFee: "",
    qualification: "",
    currentWorkingPlace: "",
    designation: "",
  });

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await getSpecialties();
        setSpecialties(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load specialties");
      }
    };

    fetchSpecialties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (id: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id)
        ? prev.filter((specialtyId) => specialtyId !== id)
        : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSpecialties.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }

    try {
      setIsLoading(true);

      const payload: ICreateDoctorPayload = {
        password: formData.password,

        doctor: {
          name: formData.name,
          email: formData.email,
          registrationNumber: formData.registrationNumber,
          gender: formData.gender as ICreateDoctorPayload["doctor"]["gender"],
          appointmentFee: Number(formData.appointmentFee),
          qualification: formData.qualification,
          currentWorkingPlace: formData.currentWorkingPlace,
          designation: formData.designation,
        },

        specialties: selectedSpecialties,
      };

      await createDoctor(payload);

      toast.success("Doctor created successfully");

      router.push("/admin/dashboard/doctors-management");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create doctor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add New Doctor</h1>
        <p className="text-sm text-muted-foreground">
          Create a new doctor account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. Rahman Ahmed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Doctor password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="BMDC-123456"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointmentFee">Appointment Fee</Label>
            <Input
              id="appointmentFee"
              name="appointmentFee"
              type="number"
              value={formData.appointmentFee}
              onChange={handleChange}
              placeholder="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="MBBS, FCPS"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Consultant"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentWorkingPlace">Current Working Place</Label>
          <Input
            id="currentWorkingPlace"
            name="currentWorkingPlace"
            value={formData.currentWorkingPlace}
            onChange={handleChange}
            placeholder="Dhaka Medical College Hospital"
            required
          />
        </div>

        <div className="space-y-3">
          <Label>Specialties</Label>

          {specialties.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No specialties available.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {specialties.map((specialty) => (
                <label
                  key={specialty.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty.id)}
                    onChange={() => handleSpecialtyChange(specialty.id)}
                  />

                  <span>{specialty.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Doctor..." : "Create Doctor"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDoctorPage;
