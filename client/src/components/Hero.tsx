import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IoPeopleOutline, IoBusinessOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { goToSection } from "@/lib/sectionNav";
import heroImage from "@assets/generated_images/Islamic_architecture_hero_background_5d13e65a.png";
import logoImage from "@assets/JanazaApp.ai_1758310618265.png";

export default function Hero() {
  const { t } = useTranslation('landing');
  const [, setLocation] = useLocation();
  
  return (
    <section className="relative min-h-[100svh] sm:min-h-screen flex items-center justify-center py-8 sm:py-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Peaceful Islamic architecture" 
          className="w-full h-full object-cover"
          data-testid="img-hero-background"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-0" data-testid="logo-hero">
            <img 
              src={logoImage} 
              alt="JanazApp Logo" 
              className="h-48 sm:h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] w-auto mx-auto drop-shadow-lg"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-40" data-testid="text-hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <p className="text-sm sm:text-lg text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-2 sm:px-0" data-testid="text-hero-description">
            {t('hero.description')}
          </p>

          {/* Registration Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Burgers Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover-elevate" data-testid="card-citizens">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4">
                  <IoPeopleOutline className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3" data-testid="text-citizens-title">
                  {t('hero.citizensCard.title')}
                </h3>
                <p className="text-sm sm:text-base text-white/80 mb-4" data-testid="text-citizens-description">
                  {t('hero.citizensCard.description')}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => goToSection('registratie', setLocation)}
                  data-testid="button-register-citizen"
                >
                  {t('hero.citizensCard.buttonText')}
                </Button>
              </CardContent>
            </Card>

            {/* Partners Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover-elevate" data-testid="card-partners">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4">
                  <IoBusinessOutline className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3" data-testid="text-partners-title">
                  {t('hero.partnersCard.title')}
                </h3>
                <p className="text-sm sm:text-base text-white/80 mb-4" data-testid="text-partners-description">
                  {t('hero.partnersCard.description')}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => goToSection('registratie', setLocation)}
                  data-testid="button-register-partner"
                >
                  {t('hero.partnersCard.buttonText')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}