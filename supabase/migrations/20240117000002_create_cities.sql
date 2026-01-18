-- Create cities table
CREATE TABLE public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  image_url TEXT,
  region TEXT,
  population INTEGER,
  wifi_rating DECIMAL(3,2) CHECK (wifi_rating >= 0 AND wifi_rating <= 5),
  cafe_rating DECIMAL(3,2) CHECK (cafe_rating >= 0 AND cafe_rating <= 5),
  cost_rating DECIMAL(3,2) CHECK (cost_rating >= 0 AND cost_rating <= 5),
  safety_rating DECIMAL(3,2) CHECK (safety_rating >= 0 AND safety_rating <= 5),
    community_rating DECIMAL(3,2) CHECK (community_rating >= 0 AND community_rating <= 5),
  overall_rating DECIMAL(3,2) CHECK (overall_rating >= 0 AND overall_rating <= 5),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can view cities
CREATE POLICY "Cities are viewable by everyone"
  ON public.cities
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Only authenticated users can insert cities
CREATE POLICY "Authenticated users can insert cities"
  ON public.cities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Only authenticated users can update cities
CREATE POLICY "Authenticated users can update cities"
  ON public.cities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Create index on slug for faster lookups
CREATE INDEX idx_cities_slug ON public.cities(slug);
CREATE INDEX idx_cities_is_featured ON public.cities(is_featured);
CREATE INDEX idx_cities_region ON public.cities(region);

-- Insert sample cities data
INSERT INTO public.cities (slug, name, name_en, description, region, tags, is_featured, wifi_rating, cafe_rating, cost_rating, safety_rating, community_rating, overall_rating) VALUES
  ('seoul', '서울', 'Seoul', '대한민국의 수도로 세계적인 메트로폴리스입니다. 강남, 홍대 등 다양한 지역에서 노마드 생활을 즐길 수 있습니다.', '서울', ARRAY['카페', '와이파이', '네트워킹', '음식'], true, 4.8, 5.0, 3.5, 4.9, 4.7, 4.5),
  ('busan', '부산', 'Busan', '아름다운 해안선과 현대적인 도시의 조화. 해운대, 광안리 등에서 일과 휴식을 동시에 즐길 수 있습니다.', '부산', ARRAY['해변', '카페', '여가', '음식'], true, 4.5, 4.3, 4.0, 4.7, 4.2, 4.3),
  ('jeju', '제주', 'Jeju', '자연의 아름다움과 함께하는 노마드 라이프. 천혜의自然环境에서 창의적인 작업이 가능합니다.', '제주', ARRAY['자연', '힐링', '카페', '트레킹'], true, 4.2, 4.5, 4.2, 4.8, 4.0, 4.3),
  ('daegu', '대구', 'Daegu', '중심부의 편리함과 합리적인 생활비. 동성로, 수성구 등에서 노마드 생활을 즐겨보세요.', '대구', ARRAY['생활비', '카페', '역사', '음식'], false, 4.3, 4.0, 4.5, 4.5, 3.8, 4.2),
  ('gwangju', '광주', 'Gwangju', '예술과 문화의 도시. 상무지구, 북구 등에서 창의적인 노마드 생활을 경험해보세요.', '광주', ARRAY['예술', '카페', '음식', '문화'], false, 4.2, 4.1, 4.3, 4.4, 3.9, 4.1),
  ('chuncheon', '춘천', 'Chuncheon', '호수와 산으로 둘러싸인 자연의 도시. 서울 근교에서 자연 속 노마드 생활을 즐길 수 있습니다.', '강원', ARRAY['자연', '레저', '카페', '호수'], false, 4.0, 3.8, 4.4, 4.6, 3.5, 4.0);
