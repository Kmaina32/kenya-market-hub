-- Seed forums data
INSERT INTO public.forums (name, description) VALUES 
('General Discussion', 'Talk about anything and everything'),
('Ride Sharing Tips', 'Share tips and experiences about ride sharing'),
('Vehicle Maintenance', 'Discuss vehicle care and maintenance'),
('Driver Support', 'Support forum for drivers'),
('Customer Feedback', 'Feedback and suggestions from customers');

-- Seed driver saved routes for existing drivers
INSERT INTO public.driver_saved_routes (driver_id, name, from_address, to_address) 
SELECT 
    d.id,
    'Route ' || (ROW_NUMBER() OVER()),
    CASE (ROW_NUMBER() OVER()) % 5
        WHEN 1 THEN 'CBD Nairobi'
        WHEN 2 THEN 'Westlands'
        WHEN 3 THEN 'Karen'
        WHEN 4 THEN 'Eastleigh'
        ELSE 'Industrial Area'
    END,
    CASE (ROW_NUMBER() OVER()) % 5
        WHEN 1 THEN 'JKIA Airport'
        WHEN 2 THEN 'Kiambu'
        WHEN 3 THEN 'Machakos'
        WHEN 4 THEN 'Thika'
        ELSE 'Ruiru'
    END
FROM public.drivers d
LIMIT 10;

-- Update driver locations with sample coordinates around Nairobi
UPDATE public.drivers 
SET current_location = CASE 
    WHEN id = (SELECT id FROM public.drivers ORDER BY created_at LIMIT 1 OFFSET 0) THEN POINT(36.8219, -1.2921)  -- CBD
    WHEN id = (SELECT id FROM public.drivers ORDER BY created_at LIMIT 1 OFFSET 1) THEN POINT(36.8100, -1.2676)  -- Westlands
    WHEN id = (SELECT id FROM public.drivers ORDER BY created_at LIMIT 1 OFFSET 2) THEN POINT(36.7073, -1.3197)  -- Karen
    WHEN id = (SELECT id FROM public.drivers ORDER BY created_at LIMIT 1 OFFSET 3) THEN POINT(36.8417, -1.2721)  -- Eastleigh
    WHEN id = (SELECT id FROM public.drivers ORDER BY created_at LIMIT 1 OFFSET 4) THEN POINT(36.8566, -1.3103)  -- Industrial Area
    ELSE POINT(36.8219, -1.2921)  -- Default to CBD
END,
last_location_update = now(),
status = 'available';