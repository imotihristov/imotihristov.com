-- =====================================================
-- OPTIONAL: Database trigger for image cleanup
-- This is a backup mechanism in case the application fails to delete images
-- Run this in the Supabase SQL Editor AFTER the main schema
-- =====================================================

-- Note: This trigger logs deleted properties with their images for manual cleanup if needed
-- Automatic deletion from storage requires a database function with HTTP calls,
-- which is complex. The application layer handles this better.

-- Create a table to log deleted properties (for cleanup tracking)
CREATE TABLE IF NOT EXISTS public.deleted_properties_log (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  property_title VARCHAR(500),
  images TEXT[],
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_by UUID REFERENCES auth.users(id)
);

-- Create a trigger function to log deletions
CREATE OR REPLACE FUNCTION log_property_deletion()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.deleted_properties_log (property_id, property_title, images, deleted_by)
  VALUES (OLD.id, OLD.title, OLD.images, auth.uid());
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_property_delete ON public.properties;
CREATE TRIGGER on_property_delete
  BEFORE DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION log_property_deletion();

-- RLS for deleted_properties_log
ALTER TABLE public.deleted_properties_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view deletion log"
ON public.deleted_properties_log FOR SELECT
USING (auth.role() = 'authenticated');

-- Optional: Create a view to see orphaned images (images that don't belong to any property)
-- This can help identify cleanup tasks
CREATE OR REPLACE VIEW orphaned_images_check AS
SELECT 
  dpl.property_id,
  dpl.property_title,
  dpl.images,
  dpl.deleted_at
FROM public.deleted_properties_log dpl
WHERE dpl.deleted_at > NOW() - INTERVAL '7 days'  -- Last 7 days
ORDER BY dpl.deleted_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON orphaned_images_check TO authenticated;
