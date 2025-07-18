-- Seed forums data
INSERT INTO public.forums (name, description) VALUES 
('General Discussion', 'Talk about anything and everything'),
('Ride Sharing Tips', 'Share tips and experiences about ride sharing'),
('Vehicle Maintenance', 'Discuss vehicle care and maintenance'),
('Driver Support', 'Support forum for drivers'),
('Customer Feedback', 'Feedback and suggestions from customers');

-- Seed driver saved routes
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

-- Seed some rides data (using only valid enum values: taxi, motorbike, truck, delivery)
INSERT INTO public.rides (
    user_id, pickup_address, destination_address, pickup_location, destination_location,
    vehicle_type, estimated_fare, status, created_at
) VALUES 
(gen_random_uuid(), 'CBD Nairobi', 'JKIA Airport', POINT(36.8219, -1.2921), POINT(36.9278, -1.3194), 'taxi', 1500, 'requested', now()),
(gen_random_uuid(), 'Westlands', 'Karen', POINT(36.8100, -1.2676), POINT(36.7073, -1.3197), 'taxi', 800, 'requested', now()),
(gen_random_uuid(), 'Eastleigh', 'CBD Nairobi', POINT(36.8417, -1.2721), POINT(36.8219, -1.2921), 'taxi', 300, 'requested', now());

-- Seed some sokko chats
INSERT INTO public.sokko_chats (user_id, provider_id, service_type, status) VALUES 
(gen_random_uuid(), (SELECT user_id FROM public.drivers LIMIT 1), 'ride_request', 'active'),
(gen_random_uuid(), (SELECT user_id FROM public.drivers OFFSET 1 LIMIT 1), 'ride_request', 'active'),
(gen_random_uuid(), (SELECT user_id FROM public.drivers OFFSET 2 LIMIT 1), 'maintenance_help', 'active');

-- Update driver locations with some sample coordinates around Nairobi
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