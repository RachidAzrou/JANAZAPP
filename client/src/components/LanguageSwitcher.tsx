import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { languages, isRTL } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction for RTL languages
    const htmlElement = document.documentElement;
    if (isRTL(languageCode)) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', languageCode);
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', languageCode);
    }
    
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 font-medium rounded-md text-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
          data-testid="button-language-switcher"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wider">{currentLanguage.countryCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px]"
        data-testid="menu-language-options"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              i18n.language === language.code ? 'bg-primary/10 text-primary font-medium' : ''
            }`}
            data-testid={`menu-item-language-${language.code}`}
          >
            <span className="text-xs font-bold tracking-wider text-muted-foreground">{language.countryCode}</span>
            <span className="flex-1">{language.name}</span>
            {i18n.language === language.code && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}