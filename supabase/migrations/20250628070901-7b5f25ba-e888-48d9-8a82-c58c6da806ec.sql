
-- First, let's remove duplicate entries in service_provider_profiles, keeping only the most recent one
DELETE FROM service_provider_profiles 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM service_provider_profiles 
    ORDER BY user_id, created_at DESC
);

-- Now add the unique constraint
ALTER TABLE service_provider_profiles 
ADD CONSTRAINT service_provider_profiles_user_id_unique UNIQUE (user_id);

-- Add the foreign key constraint for service_bookings
ALTER TABLE service_bookings 
DROP CONSTRAINT IF EXISTS service_bookings_provider_id_fkey;

ALTER TABLE service_bookings 
ADD CONSTRAINT service_bookings_provider_id_fkey 
FOREIGN KEY (provider_id) REFERENCES service_provider_profiles(user_id) ON DELETE SET NULL;

-- Add the missing foreign key constraints for forum and chat
DO $$
BEGIN
    -- Add forum_posts author constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'forum_posts_author_id_fkey' 
        AND table_name = 'forum_posts'
    ) THEN
        ALTER TABLE forum_posts 
        ADD CONSTRAINT forum_posts_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add chat_conversations participant1 constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chat_conversations_participant1_id_fkey' 
        AND table_name = 'chat_conversations'
    ) THEN
        ALTER TABLE chat_conversations 
        ADD CONSTRAINT chat_conversations_participant1_id_fkey 
        FOREIGN KEY (participant1_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add chat_conversations participant2 constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chat_conversations_participant2_id_fkey' 
        AND table_name = 'chat_conversations'
    ) THEN
        ALTER TABLE chat_conversations 
        ADD CONSTRAINT chat_conversations_participant2_id_fkey 
        FOREIGN KEY (participant2_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create the missing find_nearby_drivers function
CREATE OR REPLACE FUNCTION find_nearby_drivers(
  pickup_lat double precision,
  pickup_lng double precision,  
  vehicle_type_param vehicle_type,
  radius_km double precision DEFAULT 10
)
RETURNS TABLE(
  driver_id uuid,
  distance_km numeric,
  estimated_pickup_minutes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    ROUND(
      ST_Distance(
        ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
        COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)'))
      ) / 1000, 2
    )::NUMERIC(8,2) as distance_km,
    ROUND(
      ST_Distance(
        ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
        COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)'))
      ) / 1000 * 2.5
    )::INTEGER as estimated_pickup_minutes
  FROM public.drivers d
  WHERE 
    d.is_active = true 
    AND d.is_verified = true
    AND d.status = 'available'
    AND d.vehicle_type = vehicle_type_param
    AND ST_DWithin(
      ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
      COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)')),
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 5;
END;
$$;
