import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, CheckCircle, Monitor, Smartphone, Clock } from "lucide-react";
import { IoPeopleOutline, IoBusinessOutline } from "react-icons/io5";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { MdOutlineSpeed, MdDevices, MdOutlineCircleNotifications } from "react-icons/md";
import { PiMosqueBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import mockupImage from "@assets/2_1758294099667.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: MdOutlineSpeed,
    title: "Snelle Procedures",
    kicker: "24-48 uur sneller",
    description: "Verminder wachttijden door gestroomlijnde digitale processen.",
    benefit: "Geen gemiste termijnen meer"
  },
  {
    icon: MdDevices,
    title: "Digitale Documentatie",
    kicker: "Alles op één plek",
    description: "Van overlijdensakte tot laissez-passer, volledig georganiseerd.",
    benefit: "Geen verdwaalde documenten"
  },
  {
    icon: AiOutlineSafetyCertificate,
    title: "Veilig & Betrouwbaar",
    kicker: "GDPR compliant",
    description: "Moderne encryptie en volledige privacy-bescherming.",
    benefit: "Uw gegevens zijn veilig"
  },
  {
    icon: PiMosqueBold,
    title: "Cultureel Bewust",
    kicker: "Islamitisch gericht",
    description: "Rekening houdend met religieuze vereisten en tradities.",
    benefit: "Respectvolle behandeling"
  },
  {
    icon: Plane,
    title: "Repatriëring",
    kicker: "Repatriëring mogelijk",
    description: "Ondersteuning voor consulaire procedures en repatriëring.",
    benefit: "Naar land van herkomst"
  },
  {
    icon: MdOutlineCircleNotifications,
    title: "Transparante Voortgang",
    kicker: "Real-time updates",
    description: "Altijd op de hoogte van de status van procedures.",
    benefit: "Geen onzekerheid meer"
  }
];


export default function Features() {
  const { t } = useTranslation('landing');
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });

  return (
    <section ref={sectionRef} className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden islamic-pattern" id="diensten">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sophisticated Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary))_0.5px,_transparent_0.5px)] bg-[length:24px_24px] opacity-[0.15] animate-pulse"></div>
        
        {/* Elegant Geometric Shapes */}
        <div className="absolute top-8 sm:top-16 left-4 sm:left-8 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-primary/8 to-primary/3 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-16 sm:bottom-32 right-6 sm:right-12 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-tl from-primary/6 to-primary/2 rounded-full blur-2xl animate-pulse delay-1000 opacity-80"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/4 to-primary/8 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Subtle Line Accents */}
      </div>
      
      <div className="relative container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Premium Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className={`transition-all duration-1000 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 sm:px-0" data-testid="text-features-subtitle">
              {t('features.subtitle')}
            </p>
          </div>
        </div>

        {/* Platform Preview with Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Mockup Links */}
          <div className={`transition-all duration-1000 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <img 
              src={mockupImage} 
              alt="JanazApp Platform Preview - Desktop en Mobiel Interface" 
              className="w-full h-auto"
            />
          </div>

          {/* Features Rechts */}
          <div ref={featuresRef}>
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 sm:gap-4 group hover-elevate transition-all duration-700 ease-out p-2 sm:p-0 rounded-lg ${
                      featuresVisible 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-8'
                    }`}
                    style={{ 
                      transitionDelay: featuresVisible ? `${index * 150}ms` : '0ms'
                    }}
                    data-testid={`feature-item-${index}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-105 transition-all duration-300">
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                        {t(`features.items.${index}.title`)}
                      </h4>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {t(`features.items.${index}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}