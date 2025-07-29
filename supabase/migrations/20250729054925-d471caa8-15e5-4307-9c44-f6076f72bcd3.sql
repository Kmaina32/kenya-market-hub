
-- Create recently_viewed table for tracking user's recently viewed products
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON recently_viewed(viewed_at);

-- Enable RLS
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recently viewed items" ON recently_viewed
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed items" ON recently_viewed
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed items" ON recently_viewed
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recently viewed items" ON recently_viewed
    FOR DELETE USING (auth.uid() = user_id);
