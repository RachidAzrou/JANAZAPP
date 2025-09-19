import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { goToSection } from "@/lib/sectionNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoUrl from "@assets/Logo Icon@2x_1758311227966.png";

export default function Header() {
  const { t } = useTranslation('header');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    goToSection(sectionId, setLocation);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="container mx-auto pl-1 pr-4 sm:pl-1 sm:pr-6 lg:pl-2 lg:pr-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <img src={logoUrl} alt="JanazApp" className="h-10 sm:h-12 w-auto cursor-pointer" data-testid="img-logo" />
            </Link>
          </div>

          {/* Desktop Navigation - positioned more to the right */}
          <nav className="hidden md:flex items-center flex-1 justify-end mr-8">
            <div className="flex items-center space-x-8">
              <Link href="/over-ons" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="link-about">
                {t('navigation.aboutUs')}
              </Link>
              <a 
                href="/#diensten" 
                className="text-foreground hover:text-primary transition-colors font-medium" 
                data-testid="link-services"
                onClick={(e) => handleSectionClick(e, 'diensten')}
              >
                {t('navigation.services')}
              </a>
              <a 
                href="/#registratie" 
                className="text-foreground hover:text-primary transition-colors font-medium" 
                data-testid="link-register"
                onClick={(e) => handleSectionClick(e, 'registratie')}
              >
                {t('navigation.register')}
              </a>
            </div>
          </nav>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <Button variant="ghost" size="default" className="font-semibold rounded-md bg-primary/15 text-primary hover:bg-primary/25 hover:scale-105 transition-all duration-300 px-4 py-2" data-testid="button-login">
              {t('navigation.login')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log('Mobile menu toggled');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-background/95 animate-in slide-in-from-top-2 duration-200" data-testid="nav-mobile">
            <div className="space-y-1">
              <Link href="/over-ons" className="block text-foreground hover:text-primary transition-colors py-3 px-2 rounded-md hover:bg-muted" data-testid="link-about-mobile">
                {t('navigation.aboutUs')}
              </Link>
              <a 
                href="/#diensten" 
                className="block text-foreground hover:text-primary transition-colors py-3 px-2 rounded-md hover:bg-muted" 
                data-testid="link-services-mobile"
                onClick={(e) => handleSectionClick(e, 'diensten')}
              >
                {t('navigation.services')}
              </a>
              <a 
                href="/#registratie" 
                className="block text-foreground hover:text-primary transition-colors py-3 px-2 rounded-md hover:bg-muted" 
                data-testid="link-register-mobile"
                onClick={(e) => handleSectionClick(e, 'registratie')}
              >
                {t('navigation.register')}
              </a>
              <div className="mt-6 space-y-3 pt-4 border-t">
                <LanguageSwitcher />
                <Button variant="ghost" size="default" className="w-full font-semibold rounded-md bg-primary/15 text-primary hover:bg-primary/25 hover:scale-105 transition-all duration-300 px-4 py-2" data-testid="button-login-mobile">
                  {t('navigation.login')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}