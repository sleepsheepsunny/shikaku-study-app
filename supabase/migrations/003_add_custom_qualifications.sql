-- ===========================
-- 003: Add exam info + custom qualifications
-- ===========================

-- Phase B: Add exam info columns to qualifications
ALTER TABLE qualifications
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS exam_info JSONB DEFAULT '{}';

-- Phase C: Add owner_user_id for user-created custom qualifications
-- NULL = system built-in, non-NULL = user-added (private to that user)
ALTER TABLE qualifications
  ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Index for fast lookup of user's custom qualifications
CREATE INDEX IF NOT EXISTS idx_qualifications_owner_user_id
  ON qualifications(owner_user_id)
  WHERE owner_user_id IS NOT NULL;

-- ===========================
-- RLS policies for custom qualifications
-- ===========================

-- Allow users to see their own custom qualifications (in addition to existing system policy)
CREATE POLICY "Users can see their own custom qualifications"
  ON qualifications FOR SELECT
  USING (owner_user_id = auth.uid());

-- Allow users to insert their own custom qualifications
CREATE POLICY "Users can insert custom qualifications"
  ON qualifications FOR INSERT
  WITH CHECK (owner_user_id = auth.uid() AND owner_user_id IS NOT NULL);

-- Allow users to update their own custom qualifications
CREATE POLICY "Users can update their own custom qualifications"
  ON qualifications FOR UPDATE
  USING (owner_user_id = auth.uid());

-- Allow users to delete their own custom qualifications
CREATE POLICY "Users can delete their own custom qualifications"
  ON qualifications FOR DELETE
  USING (owner_user_id = auth.uid());
