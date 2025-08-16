import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      flatHouseNo: "",
      areaStreet: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    }
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStateSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        state: value
      }
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast({
        title: "Last Name Required",
        description: "Please enter your last name",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.address.flatHouseNo.trim()) {
      toast({
        title: "Flat/House Number Required",
        description: "Please enter your flat or house number",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.address.areaStreet.trim()) {
      toast({
        title: "Area/Street Required",
        description: "Please enter your area or street",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.address.city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter your city",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.address.state.trim()) {
      toast({
        title: "State Required",
        description: "Please select your state",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.address.zipCode.trim() || formData.address.zipCode.length !== 6) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 6-digit ZIP code",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Account Created Successfully",
          description: "Please login with your email to continue",
        });
        navigate('/login');
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-natural">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                {step === 1 ? 'Step 1: Personal Information' : 'Step 2: Address Information'}
              </CardDescription>
            </CardHeader>

            {step === 1 ? (
              <form onSubmit={handleNext}>
                <CardContent className="space-y-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
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
                    <Label htmlFor="lastName">Last Name *</Label>
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

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
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

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="Enter your 10-digit phone number"
                        value={formData.phone}
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
                  {/* Flat, House no., Building */}
                  <div className="space-y-2">
                    <Label htmlFor="flatHouseNo">Flat, House no., Building *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="flatHouseNo"
                        name="address.flatHouseNo"
                        type="text"
                        placeholder="Enter flat/house no."
                        value={formData.address.flatHouseNo}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Area, Street, Sector, Village */}
                  <div className="space-y-2">
                    <Label htmlFor="areaStreet">Area, Street, Sector, Village *</Label>
                    <Input
                      id="areaStreet"
                      name="address.areaStreet"
                      type="text"
                      placeholder="Enter area/street"
                      value={formData.address.areaStreet}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      name="address.landmark"
                      type="text"
                      placeholder="E.g. near Apollo Hospital"
                      value={formData.address.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="address.city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={handleStateSelect} value={formData.address.state}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ZIP Code */}
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="address.zipCode"
                      type="text"
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit ZIP code"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="address.country"
                      type="text"
                      value={formData.address.country}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
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