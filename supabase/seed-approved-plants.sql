insert into public.plants (
  name,
  description,
  latitude,
  longitude,
  tags,
  status
)
values
  (
    'Monstera Deliciosa',
    'A tropical split-leaf plant commonly grown indoors and in warm humid gardens.',
    1.3521,
    103.8198,
    array['tropical', 'indoor', 'foliage'],
    'approved'
  ),
  (
    'Japanese Maple',
    'A graceful ornamental tree known for delicate leaves and strong seasonal color.',
    35.6762,
    139.6503,
    array['tree', 'ornamental', 'temperate'],
    'approved'
  ),
  (
    'Lavender',
    'A fragrant flowering herb often found in sunny dry gardens and used for aroma.',
    43.2965,
    5.3698,
    array['herb', 'flower', 'mediterranean'],
    'approved'
  ),
  (
    'Saguaro Cactus',
    'A large desert cactus adapted to hot dry climates and iconic in arid landscapes.',
    32.2226,
    -110.9747,
    array['cactus', 'desert', 'succulent'],
    'approved'
  ),
  (
    'Blue Jacaranda',
    'A flowering tree with purple-blue blossoms that stands out strongly during bloom season.',
    -33.8688,
    151.2093,
    array['tree', 'flowering', 'urban'],
    'approved'
  );
