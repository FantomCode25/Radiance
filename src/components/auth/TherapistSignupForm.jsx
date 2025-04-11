import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Calendar,
  AlertCircle,
  BookOpen,
  Languages,
  DollarSign,
  Camera,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTherapistAuth } from "@/hooks/useTherapistAuth";

const TherapistSignupForm = () => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    image: "",
    specialization: "",
    experience: "",
    education: "",
    languages: "",
    pricePerSession: "",
    availability: ""
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useTherapistAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    console.log("clicked");
    
    setIsLoading(true);

    try {
      await signup({
        ...formData,
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
        pricePerSession: parseInt(formData.pricePerSession),
        languages: formData.languages.split(",").map((lang) => lang.trim()),
      });
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Therapist Signup</h2>
      {error && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <InputWithIcon
            label="Full Name"
            name="name"
            icon={<User />}
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email */}
          <InputWithIcon
            label="Email"
            name="email"
            type="email"
            icon={<Mail />}
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <InputWithIcon
            label="Password"
            name="password"
            type="password"
            icon={<Lock />}
            value={formData.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <InputWithIcon
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            icon={<Lock />}
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Age */}
          <InputWithIcon
            label="Age"
            name="age"
            type="number"
            icon={<Calendar />}
            value={formData.age}
            onChange={handleChange}
          />

          {/* Image URL */}
          <InputWithIcon
            label="Profile Image URL"
            name="image"
            icon={<Camera />}
            value={formData.image}
            onChange={handleChange}
          />

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              name="specialization"
              onValueChange={(value) =>
                setFormData({ ...formData, specialization: value })
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cognitive Behavioral Therapy">
                  Cognitive Behavioral Therapy
                </SelectItem>
                <SelectItem value="Trauma-Focused Therapy">
                  Trauma-Focused Therapy
                </SelectItem>
                <SelectItem value="Exposure Therapy for PTSD">
                  Exposure Therapy for PTSD
                </SelectItem>
                <SelectItem value="Mindfulness Therapy for Anxiety">
                  Mindfulness Therapy for Anxiety
                </SelectItem>
                <SelectItem value="Addiction Recovery Counseling">
                  Addiction Recovery Counseling
                </SelectItem>
                <SelectItem value="Depression Therapy">
                  Depression Therapy
                </SelectItem>
                <SelectItem value="Anxiety Therapy">Anxiety Therapy</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience */}
          <InputWithIcon
            label="Experience (years)"
            name="experience"
            type="number"
            icon={<Award />}
            value={formData.experience}
            onChange={handleChange}
          />

          {/* Education */}
          <InputWithIcon
            label="Education"
            name="education"
            icon={<BookOpen />}
            value={formData.education}
            onChange={handleChange}
          />

          {/* Languages */}
          <InputWithIcon
            label="Languages (comma separated)"
            name="languages"
            icon={<Languages />}
            placeholder="English, Hindi, Telugu"
            value={formData.languages}
            onChange={handleChange}
          />

          {/* Price per Session */}
          <InputWithIcon
            label="Price per Session (₹)"
            name="pricePerSession"
            type="number"
            icon={<DollarSign />}
            value={formData.pricePerSession}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select
              name="availability"
              onValueChange={(value) =>
                setFormData({ ...formData, availability: value })
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekdays, Evenings">
                  Weekdays, Evenings
                </SelectItem>
                <SelectItem value="Weekdays, Weekends">
                  Weekdays, Weekends
                </SelectItem>
                <SelectItem value="Evenings, Weekends">
                  Evenings, Weekends
                </SelectItem>
                <SelectItem value="Weekdays, Early Morning">
                  Weekdays, Early Morning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        <Button
          type="submit"
          className="w-full bg-oasis-primary hover:bg-oasis-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already registered?{" "}
          <Link
            to="/therapist-login"
            className="font-medium text-oasis-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

// ✅ Helper component for cleaner input rendering
const InputWithIcon = ({
  label,
  name,
  icon,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-400">{icon}</span>
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10"
        required
      />
    </div>
  </div>
);

export default TherapistSignupForm;
