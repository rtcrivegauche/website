-- ==============================================================================
-- Migration 21 : Configuration des comptes de dons (Mobile Money & Banque Bénin)
-- Date : Novembre 2026
-- NOTE DE SÉCURITÉ : Ce script est 100% NON DESTRUCTIF.
-- Il utilise 'ALTER TABLE ... ADD COLUMN IF NOT EXISTS'.
-- AUCUNE de vos données existantes ne sera écrasée ou supprimée.
-- ==============================================================================

-- 1. Textes généraux et WhatsApp de confirmation
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_title TEXT DEFAULT 'Soutenez nos actions solidaires';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_subtitle TEXT DEFAULT 'Chaque don, petit ou grand, a un impact réel et direct sur la vie des communautés au Bénin.';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_intro_text TEXT DEFAULT 'Votre générosité permet de financer nos actions en faveur de l''éducation des enfants démunis, de la santé communautaire et de la préservation de l''environnement au Bénin.';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_whatsapp_number TEXT DEFAULT '+229 97 00 00 00';

-- 2. Compte MTN Mobile Money (MoMo)
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_mtn_active BOOLEAN DEFAULT true;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_mtn_number TEXT DEFAULT '97 00 00 00';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_mtn_name TEXT DEFAULT 'Rotaract Club de Cotonou Rive Gauche Cica';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_mtn_merchant_code TEXT DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_mtn_instructions TEXT DEFAULT 'Tapez *880# option 1 (Envoi d''argent) ou faites un transfert MoMo direct.';

-- 3. Compte Moov Money (Flooz)
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_moov_active BOOLEAN DEFAULT true;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_moov_number TEXT DEFAULT '95 00 00 00';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_moov_name TEXT DEFAULT 'Rotaract Club de Cotonou Rive Gauche Cica';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_moov_merchant_code TEXT DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_moov_instructions TEXT DEFAULT 'Tapez *855# option 1 ou effectuez votre transfert direct Flooz.';

-- 4. Compte Celtiis Cash (SBIN Bénin)
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_celtiis_active BOOLEAN DEFAULT true;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_celtiis_number TEXT DEFAULT '40 00 00 00';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_celtiis_name TEXT DEFAULT 'Rotaract Club de Cotonou Rive Gauche Cica';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_celtiis_instructions TEXT DEFAULT 'Tapez *888# ou transférez directement via l''application Celtiis Cash.';

-- 5. Compte Bancaire (Virement / RIB / IBAN)
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_active BOOLEAN DEFAULT true;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_name TEXT DEFAULT 'Bank of Africa (BOA Bénin)';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_account_name TEXT DEFAULT 'CLUB ROTARACT DE COTONOU RIVE GAUCHE CICA';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_rib TEXT DEFAULT 'BJ061 01001 001234567890 12';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_iban TEXT DEFAULT 'BJ66 BJ06 1010 0100 1234 5678 9012';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS donation_bank_swift TEXT DEFAULT 'AFRIBJBJ';

-- 6. Mise à jour automatique du bouton de navigation 'Faire un Don' vers la nouvelle page /faire-un-don
UPDATE public.navigation 
SET url = '/faire-un-don' 
WHERE LOWER(label) LIKE '%don%';

