import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Users, Building2, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { IoPeopleOutline, IoBusinessOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Zod validation schemas - using function to access translations
const createCitizenFormSchema = (t: any) => z.object({
  firstName: z.string().min(1, t('validation.firstNameRequired')).min(2, t('validation.firstNameMinLength')),
  lastName: z.string().min(1, t('validation.lastNameRequired')).min(2, t('validation.lastNameMinLength')),
  email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[0-9\-\s\(\)]{10,}$/.test(val), {
    message: t('validation.phoneInvalid')
  }),
  city: z.string().optional(),
  preferredLanguage: z.string().min(1, t('validation.languageRequired')),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: t('validation.privacyRequired')
  })
});

const createPartnerFormSchema = (t: any) => z.object({
  companyName: z.string().min(1, t('validation.companyNameRequired')).min(2, t('validation.companyNameMinLength')),
  contactPerson: z.string().min(1, t('validation.contactPersonRequired')).min(2, t('validation.contactPersonMinLength')),
  email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[0-9\-\s\(\)]{10,}$/.test(val), {
    message: t('validation.phoneInvalidPartner')
  }),
  partnerType: z.string().min(1, t('validation.partnerTypeRequired')),
  city: z.string().optional(),
  description: z.string().optional(),
  acceptPrivacy: z.boolean().refine(val => val === true, {
    message: t('validation.privacyRequired')
  })
});

type CitizenFormData = z.infer<ReturnType<typeof createCitizenFormSchema>>;
type PartnerFormData = z.infer<ReturnType<typeof createPartnerFormSchema>>;

export default function RegistrationForms() {
  const { t } = useTranslation('forms');
  const { t: tLanding } = useTranslation('landing');
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [successType, setSuccessType] = useState<'citizen' | 'partner'>('citizen');
  const { toast } = useToast();

  // Create schemas with translations
  const citizenFormSchema = createCitizenFormSchema(t);
  const partnerFormSchema = createPartnerFormSchema(t);

  // Form hook instances
  const citizenForm = useForm<CitizenFormData>({
    resolver: zodResolver(citizenFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      preferredLanguage: 'nederlands',
      acceptPrivacy: false
    }
  });

  const partnerForm = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      partnerType: '',
      city: '',
      description: '',
      acceptPrivacy: false
    }
  });

  // Update RTL state when language changes
  const handleCitizenLanguageChange = (value: string) => {
    citizenForm.setValue('preferredLanguage', value);
    setIsRTL(value === 'arabisch');
  };

  const handleCitizenSubmit = async (data: CitizenFormData) => {
    try {
      const response = await apiRequest('POST', '/api/citizens', data);
      
      if (response.ok) {
        setSuccessType('citizen');
        setShowSuccess(true);
        citizenForm.reset();
        toast({
          title: "Registratie voltooid!",
          description: "Je registratie als burger is succesvol ontvangen.",
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = error.message || 'Er is een fout opgetreden bij het registreren';
      toast({
        title: "Registratie mislukt",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handlePartnerSubmit = async (data: PartnerFormData) => {
    try {
      const response = await apiRequest('POST', '/api/partners', data);
      
      if (response.ok) {
        setSuccessType('partner');
        setShowSuccess(true);
        partnerForm.reset();
        toast({
          title: "Registratie voltooid!",
          description: "Je registratie als partner is succesvol ontvangen.",
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = error.message || 'Er is een fout opgetreden bij het registreren';
      toast({
        title: "Registratie mislukt",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleEmergencyContact = () => {
    console.log('Emergency contact clicked');
    // TODO: Remove mock functionality - replace with actual emergency contact
  };

  if (showSuccess) {
    const successKey = successType === 'citizen' ? 'success.citizen' : 'success.partner';
    const successContent = {
      title: t(`${successKey}.title`),
      subtitle: t(`${successKey}.subtitle`),
      message: t(`${successKey}.message`)
    };

    return (
      <section className="relative py-12 lg:py-16 bg-background overflow-hidden islamic-pattern" id="registratie">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border border-border shadow-sm bg-background overflow-hidden">
              <CardContent className="p-8">
                {/* Success Icon */}
                <div className="mb-8">
                  <div className="p-4 w-fit mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-primary" data-testid="icon-success" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-foreground" data-testid="text-success-title">
                      {successContent.title}
                    </h3>
                    <p className="text-lg text-muted-foreground" data-testid="text-success-subtitle">
                      {successContent.subtitle}
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-6">
                    <p className="text-base text-foreground leading-relaxed mb-4" data-testid="text-success-message">
                      {successContent.message}
                    </p>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative py-8 sm:py-12 lg:py-16 bg-background overflow-hidden islamic-pattern" id="registratie">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
      </div>
      
      <div className="relative container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className={`transition-all duration-1000 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 sm:px-0" data-testid="text-registration-subtitle">
              {tLanding('registration.subtitle')}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div ref={formRef} className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
          formVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <Tabs defaultValue="burger" className="w-full">
            {/* Simple Tab Navigation */}
            <div className="mb-6 sm:mb-8">
              <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1 h-12 sm:h-auto">
                <TabsTrigger 
                  value="burger" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground text-sm sm:text-base py-2 sm:py-1 px-2 sm:px-3"
                  data-testid="tab-citizen"
                >
                  {t('tabs.citizens')}
                </TabsTrigger>
                <TabsTrigger 
                  value="partner" 
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground text-sm sm:text-base py-2 sm:py-1 px-2 sm:px-3"
                  data-testid="tab-partner"
                >
                  {t('tabs.partners')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Citizen Registration */}
            <TabsContent value="burger">
              <Card className="border border-border shadow-md bg-background/95 backdrop-blur-sm overflow-hidden" data-testid="card-citizen-form">
                <CardContent className={`p-4 sm:p-6 lg:p-8 ${isRTL ? 'rtl-support' : ''}`}>
                  <Form {...citizenForm}>
                    <form onSubmit={citizenForm.handleSubmit(handleCitizenSubmit)} className="space-y-6">
                      <div className="space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={citizenForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('citizenForm.fields.firstName.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('citizenForm.fields.firstName.placeholder')}
                                    data-testid="input-firstname"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={citizenForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('citizenForm.fields.lastName.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('citizenForm.fields.lastName.placeholder')}
                                    data-testid="input-lastname"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={citizenForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('citizenForm.fields.email.label')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder={t('citizenForm.fields.email.placeholder')}
                                  data-testid="input-email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">{t('citizenForm.fields.email.helpText')}</p>
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={citizenForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('citizenForm.fields.phone.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder={t('citizenForm.fields.phone.placeholder')}
                                    data-testid="input-phone"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={citizenForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('citizenForm.fields.city.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('citizenForm.fields.city.placeholder')}
                                    data-testid="input-city"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={citizenForm.control}
                          name="preferredLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('citizenForm.fields.preferredLanguage.label')}</FormLabel>
                              <Select value={field.value} onValueChange={(value) => {
                                field.onChange(value);
                                setIsRTL(value === 'arabisch');
                              }}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-language" className={isRTL ? 'select-trigger' : ''}>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="nederlands">{t('citizenForm.languageOptions.nederlands')}</SelectItem>
                                  <SelectItem value="engels">{t('citizenForm.languageOptions.engels')}</SelectItem>
                                  <SelectItem value="duits">{t('citizenForm.languageOptions.duits')}</SelectItem>
                                  <SelectItem value="arabisch">{t('citizenForm.languageOptions.arabisch')}</SelectItem>
                                  <SelectItem value="turks">{t('citizenForm.languageOptions.turks')}</SelectItem>
                                  <SelectItem value="frans">{t('citizenForm.languageOptions.frans')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <FormField
                          control={citizenForm.control}
                          name="acceptPrivacy"
                          render={({ field }) => (
                            <FormItem className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3 checkbox-wrapper' : 'space-x-3'}`}>
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-privacy"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-relaxed">
                                <FormLabel className={`text-sm ${isRTL ? 'checkbox-label' : ''}`}>
                                  <span dangerouslySetInnerHTML={{
                                    __html: t('citizenForm.privacy.linkText')
                                      .replace('{privacyLink}', `<a href="/privacy" class="text-primary hover:text-primary/80 underline font-medium" data-testid="link-privacy">${t('citizenForm.privacy.privacyLink')}</a>`)
                                      .replace('{termsLink}', `<a href="/algemene-voorwaarden" class="text-primary hover:text-primary/80 underline font-medium" data-testid="link-terms">${t('citizenForm.privacy.termsLink')}</a>`)
                                  }} />
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  {t('citizenForm.privacy.helpText')}
                                </p>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-semibold" 
                            disabled={citizenForm.formState.isSubmitting}
                            data-testid="button-submit-citizen"
                          >
                            {citizenForm.formState.isSubmitting ? t('citizenForm.submittingButton') : t('citizenForm.submitButton')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Premium Partner Registration */}
            {/* Partner Registration */}
            <TabsContent value="partner">
              <Card className="border border-border shadow-md bg-background/95 backdrop-blur-sm overflow-hidden" data-testid="card-partner-form">
                <CardContent className={`p-4 sm:p-6 lg:p-8 ${isRTL ? 'rtl-support' : ''}`}>
                  <Form {...partnerForm}>
                    <form onSubmit={partnerForm.handleSubmit(handlePartnerSubmit)} className="space-y-6">
                      <div className="space-y-6 sm:space-y-8">
                        <FormField
                          control={partnerForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('partnerForm.fields.companyName.label')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('partnerForm.fields.companyName.placeholder')}
                                  data-testid="input-company-name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={partnerForm.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('partnerForm.fields.contactPerson.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('partnerForm.fields.contactPerson.placeholder')}
                                    data-testid="input-contact-person"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={partnerForm.control}
                            name="partnerType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('partnerForm.fields.partnerType.label')}</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-partner-type" className={isRTL ? 'select-trigger' : ''}>
                                      <SelectValue placeholder={t('partnerForm.fields.partnerType.placeholder')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="uitvaartondernemer">{t('partnerForm.partnerTypes.uitvaartondernemer')}</SelectItem>
                                    <SelectItem value="moskee">{t('partnerForm.partnerTypes.moskee')}</SelectItem>
                                    <SelectItem value="verzekeraar">{t('partnerForm.partnerTypes.verzekeraar')}</SelectItem>
                                    <SelectItem value="wasplaats">{t('partnerForm.partnerTypes.wasplaats')}</SelectItem>
                                    <SelectItem value="andere">{t('partnerForm.partnerTypes.andere')}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={partnerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('partnerForm.fields.email.label')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder={t('partnerForm.fields.email.placeholder')}
                                  data-testid="input-partner-email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <FormField
                            control={partnerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('partnerForm.fields.phone.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder={t('partnerForm.fields.phone.placeholder')}
                                    data-testid="input-partner-phone"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={partnerForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('partnerForm.fields.city.label')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('partnerForm.fields.city.placeholder')}
                                    data-testid="input-partner-city"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={partnerForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('partnerForm.fields.description.label')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('partnerForm.fields.description.placeholder')}
                                  data-testid="textarea-description"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <FormField
                          control={partnerForm.control}
                          name="acceptPrivacy"
                          render={({ field }) => (
                            <FormItem className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3 checkbox-wrapper' : 'space-x-3'}`}>
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-partner-privacy"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-relaxed">
                                <FormLabel className={`text-sm ${isRTL ? 'checkbox-label' : ''}`}>
                                  <span dangerouslySetInnerHTML={{
                                    __html: t('partnerForm.privacy.linkText')
                                      .replace('{privacyLink}', `<a href="/privacy" class="text-primary hover:text-primary/80 underline font-medium" data-testid="link-privacy-partner">${t('partnerForm.privacy.privacyLink')}</a>`)
                                      .replace('{termsLink}', `<a href="/algemene-voorwaarden" class="text-primary hover:text-primary/80 underline font-medium" data-testid="link-terms-partner">${t('partnerForm.privacy.termsLink')}</a>`)
                                  }} />
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-semibold" 
                            disabled={partnerForm.formState.isSubmitting}
                            data-testid="button-submit-partner"
                          >
                            {partnerForm.formState.isSubmitting ? t('partnerForm.submittingButton') : t('partnerForm.submitButton')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}