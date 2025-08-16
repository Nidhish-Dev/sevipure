import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
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

  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileData({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      address: { ...user.address }
    });
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStateSelect = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        state: value
      }
    }));
  };

  const handleSave = async () => {
    if (!profileData.firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name",
        variant: "destructive"
      });
      return false;
    }

    if (!profileData.lastName.trim()) {
      toast({
        title: "Last Name Required",
        description: "Please enter your last name",
        variant: "destructive"
      });
      return false;
    }

    if (!profileData.address.flatHouseNo.trim() || !profileData.address.areaStreet.trim() || 
        !profileData.address.city.trim() || !profileData.address.state.trim() || 
        !profileData.address.zipCode.trim()) {
      toast({
        title: "Address Required",
        description: "Please fill in all required address fields",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        setIsEditing(false);
        // Update the user context with new data
        // You might want to add a refreshUser method to your auth context
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      address: { ...user?.address } || {
        flatHouseNo: "",
        areaStreet: "",
        landmark: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
      }
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Your basic account details
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Middle Name */}
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={profileData.middleName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="Optional"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Phone - Read Only */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={user.phone}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Phone number cannot be changed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Address Information</span>
                </CardTitle>
                <CardDescription>
                  Your delivery address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Flat, House no., Building */}
                <div className="space-y-2">
                  <Label htmlFor="flatHouseNo">Flat, House no., Building</Label>
                  <Input
                    id="flatHouseNo"
                    name="address.flatHouseNo"
                    value={profileData.address.flatHouseNo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Area, Street, Sector, Village */}
                <div className="space-y-2">
                  <Label htmlFor="areaStreet">Area, Street, Sector, Village</Label>
                  <Input
                    id="areaStreet"
                    name="address.areaStreet"
                    value={profileData.address.areaStreet}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    name="address.landmark"
                    value={profileData.address.landmark}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="Optional"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="address.city"
                    value={profileData.address.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    onValueChange={handleStateSelect} 
                    value={profileData.address.state}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
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
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="address.zipCode"
                    value={profileData.address.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.address.country}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
