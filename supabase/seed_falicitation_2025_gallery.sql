-- Supplemental Seed: Falicitation 2025 Gallery Records
-- Preserves original gallery records from legacy project using stable UUIDs and conflict handling.
INSERT INTO public.gallery_images (id, title, image_url, category, display_order, is_active)
VALUES
  ('86e73dba-8b65-4e93-acfd-d00c783384dc', 'falicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-8.webp', 'events', 3, true),
  ('7c2ca6d6-cf8e-4b31-b25a-aaa22c909c3e', 'falicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-2.webp', 'events', 4, true),
  ('54e5ce27-3f84-4ba7-88dd-92b16e612a66', 'felicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-3.webp', 'events', 5, true),
  ('6192d7e0-18de-4e7f-be8c-10a021b02aa5', 'falicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-4.webp', 'events', 6, true),
  ('e4fdad15-c9b1-48eb-96ba-1a07a2209a7d', 'falicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-5.webp', 'events', 7, true),
  ('e187018a-b363-4c8a-be01-da6b9f5f9434', 'falicitation 2025', 'https://raysacademybhopal.in/gallery/f2025-1.webp', 'events', 8, true)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    image_url = EXCLUDED.image_url,
    category = EXCLUDED.category,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

