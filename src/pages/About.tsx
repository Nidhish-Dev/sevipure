import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, Award, Truck, Heart, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "All our products are certified organic and grown without harmful chemicals"
    },
    {
      icon: Users,
      title: "Supporting Farmers",
      description: "We work directly with local farmers, ensuring fair prices and sustainable practices"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Rigorous quality checks ensure only the finest products reach your table"
    },
    {
      icon: Truck,
      title: "Fresh Delivery",
      description: "Farm-to-door delivery ensuring maximum freshness and nutritional value"
    },
    {
      icon: Heart,
      title: "Health First",
      description: "Promoting healthier lifestyles through pure, natural products"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Complete transparency in our sourcing and production processes"
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      bio: "With 15+ years in organic farming, Priya founded SeviPure to bridge the gap between farmers and health-conscious consumers."
    },
    {
      name: "Raj Patel",
      role: "Head of Operations",
      bio: "Raj ensures our supply chain maintains the highest quality standards from farm to your doorstep."
    },
    {
      name: "Anita Kumar",
      role: "Quality Assurance",
      bio: "Anita oversees all quality control processes, ensuring every product meets our strict organic standards."
    }
  ];

  const stats = [
    { number: "500+", label: "Partner Farmers" },
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Organic Products" },
    { number: "25+", label: "States Served" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              About SeviPure
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              Connecting you with the purest, farm-fresh organic products while supporting 
              sustainable agriculture and local farming communities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  SeviPure was born from a simple vision: to make authentic, organic products 
                  accessible to every household while ensuring fair compensation for our farming partners.
                </p>
                <p>
                  Founded in 2018, we started as a small initiative connecting urban consumers 
                  with rural farmers. Today, we're proud to be a trusted platform serving 
                  thousands of families across India.
                </p>
                <p>
                  Every product in our catalog is carefully sourced from certified organic farms, 
                  ensuring you get the purest, most nutritious options for your family's well-being.
                </p>
              </div>
              <Button size="lg" className="mt-8">
                Learn More About Our Journey
              </Button>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-gradient-secondary rounded-2xl p-8 shadow-natural">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These core principles guide everything we do, from sourcing to delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-natural transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8 text-center">
                    <IconComponent className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate individuals dedicated to bringing you the finest organic products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="hover:shadow-natural transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Pure, Organic Living?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of satisfied customers who've made the switch to SeviPure's 
            premium organic products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Browse Products
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;