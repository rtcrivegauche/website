-- ============================================
-- SUPABASE STORAGE - CONFIGURATION DES BUCKETS
-- ============================================
-- Configuration du stockage pour les médias

-- ============================================
-- 1. Créer les buckets de stockage
-- ============================================

-- Bucket pour les images générales
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Bucket pour les avatars/photos de profil
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Bucket pour les documents (PDF, etc.)
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Bucket pour les vidéos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- ============================================
-- 2. Politiques de stockage - IMAGES
-- ============================================

-- Lecture publique
CREATE POLICY "images_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "images_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Mise à jour pour éditeurs/admins
CREATE POLICY "images_update_editor" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Suppression pour éditeurs/admins
CREATE POLICY "images_delete_editor" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- ============================================
-- 3. Politiques de stockage - AVATARS
-- ============================================

-- Lecture publique
CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "avatars_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- Mise à jour pour propriétaire ou admin
CREATE POLICY "avatars_update_own_or_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid()
        AND r.name = 'admin'
      )
    )
  );

-- Suppression pour propriétaire ou admin
CREATE POLICY "avatars_delete_own_or_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid()
        AND r.name = 'admin'
      )
    )
  );

-- ============================================
-- 4. Politiques de stockage - DOCUMENTS
-- ============================================

-- Lecture publique
CREATE POLICY "documents_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "documents_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

-- Mise à jour pour éditeurs/admins
CREATE POLICY "documents_update_editor" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Suppression pour éditeurs/admins
CREATE POLICY "documents_delete_editor" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- ============================================
-- 5. Politiques de stockage - VIDEOS
-- ============================================

-- Lecture publique
CREATE POLICY "videos_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "videos_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos'
    AND auth.role() = 'authenticated'
  );

-- Mise à jour pour éditeurs/admins
CREATE POLICY "videos_update_editor" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Suppression pour éditeurs/admins
CREATE POLICY "videos_delete_editor" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );
