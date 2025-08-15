import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry"
];

const Signup = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    email: "",
    pincode: "",
    flat: "",
    area: "",
    landmark: "",
    townCity: "",
    state: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateSelect = (value) => {
    setFormData(prev => ({ ...prev, state: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
    // Handle signup logic here
  };

  const filteredStates = indianStates.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-natural">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Sign up for a new SeviPure account
              </CardDescription>
            </CardHeader>

            {step === 1 ? (
              <form onSubmit={handleNext}>
                <CardContent className="space-y-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name (Optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="middleName"
                        name="middleName"
                        type="text"
                        placeholder="Enter your middle name"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactNo"
                        name="contactNo"
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="Enter your 10-digit contact number"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Next
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Log in here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Pincode */}
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit PIN code"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Flat/House No. */}
                  <div className="space-y-2">
                    <Label htmlFor="flat">Flat, House no., Building</Label>
                    <Input
                      id="flat"
                      name="flat"
                      type="text"
                      placeholder="Enter flat/house no."
                      value={formData.flat}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Area/Street */}
                  <div className="space-y-2">
                    <Label htmlFor="area">Area, Street, Sector, Village</Label>
                    <Input
                      id="area"
                      name="area"
                      type="text"
                      placeholder="Enter area/street"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      type="text"
                      placeholder="E.g. near Apollo Hospital"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Town/City */}
                  <div className="space-y-2">
                    <Label htmlFor="townCity">Town/City</Label>
                    <Input
                      id="townCity"
                      name="townCity"
                      type="text"
                      placeholder="Enter town/city"
                      value={formData.townCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      type="text"
                      placeholder="Search states..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    <Select onValueChange={handleStateSelect} value={formData.state}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStates.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;