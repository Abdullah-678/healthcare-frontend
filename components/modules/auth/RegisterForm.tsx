"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/services/auth.service";

const RegisterForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const result = await registerAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Registration successful");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create an Account</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Register as a patient.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Peter Parker"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="peterparker@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>

          <Input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            placeholder="01712345678"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>

          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Dhaka, Bangladesh"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
