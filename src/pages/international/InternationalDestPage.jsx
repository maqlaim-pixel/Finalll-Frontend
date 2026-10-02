import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Shield, Award, Globe, Plane, Compass, Heart } from 'lucide-react'
import api from '../../services/api'

// ═══════════════════════════════════════════════════════════════
// CATEGORY DATA — All 11 international destination categories
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = {
  '': {
    name: 'Popular Destinations',
    slug: '',
    tagline: 'Most-Loved International Destinations',
    description: 'Discover the most popular and sought-after international destinations loved by travelers worldwide. From iconic cities to tropical paradises.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
    heroIcon: '🌍',
    color: 'from-sky-600 to-indigo-700',
    whyItems: [
      { icon: '✈️', title: 'Curated Selection', desc: 'Handpicked destinations loved by millions of travelers' },
      { icon: '⭐', title: 'Top Rated', desc: 'Destinations with highest traveler ratings and reviews' },
      { icon: '📸', title: 'Instagram Worthy', desc: 'Picture-perfect locations for your travel feed' },
      { icon: '🏆', title: 'Award Winning', desc: 'Destinations that have won global travel awards' },
    ],
    destinations: [
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: 'Futuristic skyline, luxury shopping and desert adventures', tags: ['City', 'Luxury', 'Shopping'], rating: 4.8, price: '₹45,000' },
      { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'Golden temples, street food and vibrant nightlife', tags: ['Culture', 'Food', 'Nightlife'], rating: 4.7, price: '₹35,000' },
      { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', country: 'singapore', desc: 'Gardens, hawker food and futuristic architecture', tags: ['City', 'Family', 'Food'], rating: 4.8, price: '₹55,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Sacred temples, rice terraces and surf beaches', tags: ['Beach', 'Culture', 'Wellness'], rating: 4.8, price: '₹40,000' },
      { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'maldives', desc: 'Overwater villas, turquoise lagoons and coral reefs', tags: ['Honeymoon', 'Beach', 'Luxury'], rating: 4.9, price: '₹85,000' },
      { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', country: 'japan', desc: 'Ancient temples, neon lights and world-class cuisine', tags: ['Culture', 'Food', 'Tech'], rating: 4.9, price: '₹75,000' },
      { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', country: 'europe', desc: 'Eiffel Tower, Louvre Museum and romantic charm', tags: ['Romance', 'Heritage', 'Art'], rating: 4.8, price: '₹90,000' },
      { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', country: 'australia', desc: 'Opera House, Harbour Bridge and Bondi Beach', tags: ['City', 'Beach', 'Nature'], rating: 4.7, price: '₹1,10,000' },
      { name: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', country: 'europe', desc: 'Royal palaces, West End theatre and historic pubs', tags: ['Heritage', 'Culture', 'City'], rating: 4.7, price: '₹95,000' },
      { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', country: 'usa', desc: 'Statue of Liberty, Broadway and Central Park', tags: ['City', 'Culture', 'Shopping'], rating: 4.7, price: '₹1,20,000' },
      { name: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Petronas Towers, Batu Caves and multi-cuisine food', tags: ['City', 'Food', 'Shopping'], rating: 4.6, price: '₹30,000' },
      { name: 'Colombo, Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Ancient temples, tea plantations and stunning beaches', tags: ['Heritage', 'Nature', 'Beach'], rating: 4.6, price: '₹28,000' },
    ],
  },

  beach: {
    name: 'Beach Destinations',
    slug: 'beach',
    tagline: 'Sun, Sand & Crystal Clear Waters',
    description: 'Escape to the world most stunning beach destinations — from tropical islands to coastal paradises with pristine white sand and turquoise waters.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
    heroIcon: '🏖️',
    color: 'from-cyan-500 to-blue-600',
    whyItems: [
      { icon: '🏖️', title: 'Pristine Beaches', desc: 'White sand, turquoise water and breathtaking coastlines' },
      { icon: '🐠', title: 'Water Sports', desc: 'Snorkeling, scuba diving, surfing and jet skiing' },
      { icon: '🌅', title: 'Stunning Sunsets', desc: 'Golden hour views over the ocean every evening' },
      { icon: '🍹', title: 'Beach Clubs', desc: 'Lifestyle beach bars, shacks and oceanfront dining' },
    ],
    destinations: [
      { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'maldives', desc: 'Overwater villas and the bluest lagoons on Earth', tags: ['Luxury', 'Honeymoon'], rating: 4.9, price: '₹85,000' },
      { name: 'Phuket, Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', country: 'thailand', desc: 'Stunning beaches, beach clubs and island hopping', tags: ['Party', 'Nightlife'], rating: 4.7, price: '₹40,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Seminyak, Kuta and Uluwatu beach paradise', tags: ['Surf', 'Culture'], rating: 4.8, price: '₹40,000' },
      { name: 'Langkawi, Malaysia', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Duty-free island with pristine beaches and mangroves', tags: ['Budget', 'Nature'], rating: 4.6, price: '₹25,000' },
      { name: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop', country: 'india', desc: 'Beach shacks, nightlife and Portuguese heritage', tags: ['Party', 'Heritage'], rating: 4.5, price: '₹15,000' },
      { name: 'Gold Coast, Australia', image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', country: 'australia', desc: 'Surf beaches, theme parks and hinterland adventures', tags: ['Adventure', 'Family'], rating: 4.7, price: '₹1,00,000' },
      { name: 'Sri Lanka South Coast', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Mirissa, Unawatuna and whale watching beaches', tags: ['Budget', 'Wildlife'], rating: 4.6, price: '₹28,000' },
      { name: 'Koh Samui, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'Luxury beach resorts and palm-fringed coastlines', tags: ['Luxury', 'Honeymoon'], rating: 4.8, price: '₹50,000' },
      { name: 'Nusa Dua, Bali', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Luxury resort area with calm waters and water sports', tags: ['Luxury', 'Family'], rating: 4.7, price: '₹45,000' },
      { name: 'Miami, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', country: 'usa', desc: 'Art Deco district, South Beach and vibrant nightlife', tags: ['Nightlife', 'City'], rating: 4.6, price: '₹1,10,000' },
      { name: 'Zanzibar, Tanzania', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', country: 'africa', desc: 'Spice island with white sand beaches and crystal water', tags: ['Offbeat', 'Adventure'], rating: 4.8, price: '₹70,000' },
      { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', country: 'europe', desc: 'Iconic blue-domed churches and stunning caldera views', tags: ['Romance', 'Luxury'], rating: 4.9, price: '₹1,05,000' },
    ],
  },

  island: {
    name: 'Island Destinations',
    slug: 'island',
    tagline: 'Tropical Island Escapes',
    description: 'Discover the world most beautiful island destinations — secluded paradises with pristine beaches, lush jungles, and crystal-clear waters.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&h=600&fit=crop',
    heroIcon: '🏝️',
    color: 'from-teal-500 to-emerald-600',
    whyItems: [
      { icon: '🏝️', title: 'Secluded Paradise', desc: 'Private islands and untouched natural beauty' },
      { icon: '🤿', title: 'Marine Life', desc: 'Vibrant coral reefs and exotic underwater world' },
      { icon: '🌴', title: 'Tropical Vibes', desc: 'Palm-fringed beaches and lush tropical vegetation' },
      { icon: '🚤', title: 'Island Hopping', desc: 'Explore multiple islands in one trip' },
    ],
    destinations: [
      { name: 'Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', country: 'maldives', desc: '1,200 coral islands with overwater luxury resorts', tags: ['Luxury', 'Diving'], rating: 4.9, price: '₹85,000' },
      { name: 'Phi Phi Islands, Thailand', image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=300&fit=crop', country: 'thailand', desc: 'Maya Bay, crystal lagoons and snorkeling paradise', tags: ['Adventure', 'Beach'], rating: 4.8, price: '₹42,000' },
      { name: 'Bali & Gili Islands', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Car-free islands with pristine reefs and sunsets', tags: ['Budget', 'Diving'], rating: 4.7, price: '₹40,000' },
      { name: 'Langkawi, Malaysia', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Archipelago of 99 islands with duty-free shopping', tags: ['Nature', 'Budget'], rating: 4.6, price: '₹25,000' },
      { name: 'Sentosa, Singapore', image: 'https://images.unsplash.com/photo-1508355576831-e567172eb43a?w=400&h=300&fit=crop', country: 'singapore', desc: 'Entertainment island with Universal Studios', tags: ['Family', 'Entertainment'], rating: 4.7, price: '₹55,000' },
      { name: 'Phuket, Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', country: 'thailand', desc: 'Largest Thai island with stunning beaches and nightlife', tags: ['Party', 'Beach'], rating: 4.7, price: '₹40,000' },
      { name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Pearl of the Indian Ocean with diverse landscapes', tags: ['Culture', 'Wildlife'], rating: 4.6, price: '₹28,000' },
      { name: 'Mykonos, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', country: 'europe', desc: 'White-washed buildings, beach clubs and vibrant nightlife', tags: ['Party', 'Luxury'], rating: 4.8, price: '₹1,00,000' },
      { name: 'Bora Bora, French Polynesia', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'oceania', desc: 'Ultimate luxury island with overwater bungalows', tags: ['Honeymoon', 'Luxury'], rating: 4.9, price: '₹2,00,000' },
      { name: 'Hawaii, USA', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', country: 'usa', desc: 'Volcanic islands with surf, luau and aloha spirit', tags: ['Adventure', 'Beach'], rating: 4.8, price: '₹1,50,000' },
      { name: 'Palawan, Philippines', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'asia', desc: 'Underground rivers and pristine island lagoons', tags: ['Budget', 'Adventure'], rating: 4.7, price: '₹35,000' },
      { name: 'Zanzibar, Tanzania', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', country: 'africa', desc: 'Spice island with historic Stone Town beaches', tags: ['Offbeat', 'Culture'], rating: 4.7, price: '₹65,000' },
    ],
  },

  adventure: {
    name: 'Adventure Destinations',
    slug: 'adventure',
    tagline: 'Thrilling Adventures Await',
    description: 'For the adrenaline junkies — destinations offering bungee jumping, trekking, safaris, water sports and the most thrilling adventures on the planet.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=600&fit=crop',
    heroIcon: '🧗',
    color: 'from-orange-500 to-red-600',
    whyItems: [
      { icon: '🧗', title: 'Thrilling Activities', desc: 'Bungee, skydiving, zip-lining and extreme sports' },
      { icon: '🏔️', title: 'Mountain Treks', desc: 'Everest, Kilimanjaro and world-famous trekking routes' },
      { icon: '🤿', title: 'Underwater Adventures', desc: 'Scuba diving, snorkeling and shark encounters' },
      { icon: '🦒', title: 'Wildlife Safaris', desc: 'African safaris, tiger trails and jungle expeditions' },
    ],
    destinations: [
      { name: 'Queenstown, New Zealand', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', country: 'new-zealand', desc: 'Adventure capital — bungee, jet boating, skydiving', tags: ['Extreme', 'Nature'], rating: 4.9, price: '₹1,30,000' },
      { name: 'Interlaken, Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Paragliding, canyoning and Alpine adventures', tags: ['Extreme', 'Scenic'], rating: 4.9, price: '₹1,20,000' },
      { name: 'Nepal Himalayas', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'Everest Base Camp, Annapurna Circuit and trekking', tags: ['Trekking', 'Budget'], rating: 4.8, price: '₹35,000' },
      { name: 'Ras Al Khaimah, UAE', image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop', country: 'uae', desc: 'Jebel Jais zip-line, mountain trekking and desert', tags: ['Desert', 'Mountain'], rating: 4.7, price: '₹50,000' },
      { name: 'Costa Rica', image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc0?w=400&h=300&fit=crop', country: 'central-america', desc: 'Rainforest zip-lining, surfing and volcano hikes', tags: ['Nature', 'Eco'], rating: 4.8, price: '₹90,000' },
      { name: 'Chiang Mai, Thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', country: 'thailand', desc: 'Jungle trekking, elephant sanctuaries and rafting', tags: ['Trekking', 'Wildlife'], rating: 4.7, price: '₹30,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Surfing, volcano sunrise trekking and white water', tags: ['Surf', 'Trekking'], rating: 4.8, price: '₹40,000' },
      { name: 'New Zealand South Island', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', country: 'new-zealand', desc: 'Milford Sound, glacier hikes and milky way views', tags: ['Nature', 'Scenic'], rating: 4.9, price: '₹1,40,000' },
      { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', country: 'japan', desc: 'Mount Fuji trekking, snow monkeys and bullet trains', tags: ['Trekking', 'Culture'], rating: 4.9, price: '₹75,000' },
      { name: 'Kathmandu, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'Gateway to Himalayas, paragliding and rafting', tags: ['Budget', 'Trekking'], rating: 4.7, price: '₹25,000' },
      { name: 'Gold Coast, Australia', image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', country: 'australia', desc: 'Skydiving, bungee and surf adventures', tags: ['Extreme', 'Beach'], rating: 4.7, price: '₹1,00,000' },
      { name: 'Iceland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop', country: 'europe', desc: 'Northern lights, glacier caves and geysers', tags: ['Extreme', 'Offbeat'], rating: 4.9, price: '₹1,60,000' },
    ],
  },

  heritage: {
    name: 'Heritage Destinations',
    slug: 'heritage',
    tagline: 'Explore Rich History & Culture',
    description: 'Journey through time at the world most magnificent heritage destinations — ancient ruins, historic cities, UNESCO sites and centuries of civilization.',
    heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1400&h=600&fit=crop',
    heroIcon: '🏛️',
    color: 'from-amber-500 to-orange-600',
    whyItems: [
      { icon: '🏛️', title: 'Ancient Ruins', desc: 'Rome, Athens, Petra and lost civilizations' },
      { icon: '🏰', title: 'Historic Cities', desc: 'Medieval towns, palaces and cobblestone streets' },
      { icon: '🎨', title: 'Art & Museums', desc: 'World-class galleries and artistic masterpieces' },
      { icon: '📖', title: 'Living History', desc: 'Cultures and traditions spanning thousands of years' },
    ],
    destinations: [
      { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', country: 'europe', desc: 'Colosseum, Vatican, Pantheon and Roman Forum', tags: ['Ancient', 'Art'], rating: 4.9, price: '₹85,000' },
      { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', country: 'japan', desc: 'Ancient temples, geisha culture and zen gardens', tags: ['Temples', 'Culture'], rating: 4.9, price: '₹80,000' },
      { name: 'Beijing, China', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop', country: 'china', desc: 'Great Wall, Forbidden City and imperial history', tags: ['Imperial', 'Ancient'], rating: 4.7, price: '₹55,000' },
      { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'Grand Palace, Wat Arun and ancient Buddhist temples', tags: ['Temples', 'Culture'], rating: 4.7, price: '₹35,000' },
      { name: 'Kathmandu, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'UNESCO temples, Durbar Squares and spiritual heritage', tags: ['Temples', 'Spiritual'], rating: 4.7, price: '₹25,000' },
      { name: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Batu Caves, colonial architecture and cultural fusion', tags: ['Colonial', 'Culture'], rating: 4.6, price: '₹30,000' },
      { name: 'Hanoi, Vietnam', image: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', country: 'vietnam', desc: '1000-year old Old Quarter, temples and water puppets', tags: ['Ancient', 'Culture'], rating: 4.7, price: '₹30,000' },
      { name: 'Colombo, Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Ancient Buddhist temples, colonial heritage and markets', tags: ['Temples', 'Colonial'], rating: 4.6, price: '₹28,000' },
      { name: 'Athens, Greece', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop', country: 'europe', desc: 'Acropolis, Parthenon and birthplace of democracy', tags: ['Ancient', 'UNESCO'], rating: 4.8, price: '₹75,000' },
      { name: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=400&h=300&fit=crop', country: 'africa', desc: 'Pyramids of Giza, Sphinx and ancient Egyptian wonders', tags: ['Ancient', 'Mystery'], rating: 4.7, price: '₹60,000' },
      { name: 'Prague, Czech Republic', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', country: 'europe', desc: 'Gothic architecture, Charles Bridge and old town charm', tags: ['Medieval', 'Romance'], rating: 4.8, price: '₹70,000' },
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: 'Gold Souk, heritage villages and cultural fusion', tags: ['Culture', 'Shopping'], rating: 4.8, price: '₹45,000' },
    ],
  },

  'hill-stations': {
    name: 'Hill Stations',
    slug: 'hill-stations',
    tagline: 'Misty Mountains & Cool Retreats',
    description: 'Escape the heat at the most scenic international hill stations — misty mountains, lush valleys, pine forests and breathtaking viewpoints.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    heroIcon: '⛰️',
    color: 'from-green-500 to-emerald-600',
    whyItems: [
      { icon: '⛰️', title: 'Mountain Views', desc: 'Snow-capped peaks, valleys and panoramic vistas' },
      { icon: '🌲', title: 'Pine Forests', desc: 'Fresh mountain air among towering evergreen forests' },
      { icon: '☕', title: 'Tea & Coffee', desc: 'Plantation tours and freshly brewed hill station teas' },
      { icon: '🥾', title: 'Trekking', desc: 'Scenic mountain trails and nature walks' },
    ],
    destinations: [
      { name: 'Swiss Alps, Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Jungfrau, Matterhorn and Alpine wonderland', tags: ['Luxury', 'Scenic'], rating: 4.9, price: '₹1,20,000' },
      { name: 'Nepal Himalayas', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'Pokhara, Nagarkot and Himalayan panoramas', tags: ['Trekking', 'Budget'], rating: 4.8, price: '₹25,000' },
      { name: 'Cameron Highlands, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Tea plantations, strawberry farms and mossy forests', tags: ['Nature', 'Budget'], rating: 4.6, price: '₹22,000' },
      { name: 'Chiang Mai, Thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', country: 'thailand', desc: 'Mountain temples, night bazaars and elephant camps', tags: ['Culture', 'Nature'], rating: 4.7, price: '₹28,000' },
      { name: 'Queenstown, New Zealand', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', country: 'new-zealand', desc: 'Lake Wakatipu, Remarkables and alpine beauty', tags: ['Adventure', 'Scenic'], rating: 4.9, price: '₹1,30,000' },
      { name: 'Hakone, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', country: 'japan', desc: 'Hot springs with Mount Fuji views', tags: ['Spa', 'Scenic'], rating: 4.8, price: '₹70,000' },
      { name: 'Grindelwald, Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Eiger views, glacier treks and Alpine meadows', tags: ['Trekking', 'Luxury'], rating: 4.9, price: '₹1,25,000' },
      { name: 'Dalat, Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', country: 'vietnam', desc: 'City of eternal spring with flower gardens', tags: ['Budget', 'Nature'], rating: 4.5, price: '₹20,000' },
      { name: 'Nuwara Eliya, Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Little England with tea estates and cool climate', tags: ['Tea', 'Nature'], rating: 4.6, price: '₹28,000' },
      { name: 'Hallstatt, Austria', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', country: 'europe', desc: 'Fairy-tale lakeside village in the Alps', tags: ['Romance', 'Scenic'], rating: 4.9, price: '₹1,10,000' },
      { name: 'Lauterbrunnen, Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Valley of 72 waterfalls and Jungfrau views', tags: ['Scenic', 'Nature'], rating: 4.9, price: '₹1,15,000' },
      { name: 'Tagaytay, Philippines', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'asia', desc: 'Taal Volcano views and cool highland weather', tags: ['Budget', 'Nature'], rating: 4.5, price: '₹25,000' },
    ],
  },

  family: {
    name: 'Family Destinations',
    slug: 'family',
    tagline: 'Perfect Holidays for the Whole Family',
    description: 'Family-friendly international destinations with theme parks, kid-friendly activities, safe beaches and experiences the whole family will love.',
    heroImage: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=1400&h=600&fit=crop',
    heroIcon: '👨‍👩‍👧‍👦',
    color: 'from-pink-500 to-rose-600',
    whyItems: [
      { icon: '🎢', title: 'Theme Parks', desc: 'Universal Studios, Disney and LEGOLAND' },
      { icon: '🏖️', title: 'Safe Beaches', desc: 'Calm waters and family-friendly beach resorts' },
      { icon: '🐬', title: 'Kid Activities', desc: 'Aquariums, zoos, wildlife parks and interactive museums' },
      { icon: '🏨', title: 'Family Resorts', desc: 'Kids clubs, family suites and child-friendly amenities' },
    ],
    destinations: [
      { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', country: 'singapore', desc: 'Universal Studios, S.E.A. Aquarium and Gardens by the Bay', tags: ['Theme Park', 'City'], rating: 4.8, price: '₹55,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Waterbom, Safari Park and family-friendly beaches', tags: ['Beach', 'Nature'], rating: 4.7, price: '₹40,000' },
      { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'Dream World, Safari World and floating markets', tags: ['Theme Park', 'Culture'], rating: 4.7, price: '₹35,000' },
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: 'Aquaventure, Legoland Dubai and desert safari', tags: ['Theme Park', 'Luxury'], rating: 4.8, price: '₹65,000' },
      { name: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Sunway Lagoon, Petronas Towers and Batu Caves', tags: ['Budget', 'Theme Park'], rating: 4.6, price: '₹30,000' },
      { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', country: 'japan', desc: 'DisneySea, Tokyo DisneyLand and TeamLab', tags: ['Theme Park', 'Culture'], rating: 4.9, price: '₹80,000' },
      { name: 'Gold Coast, Australia', image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', country: 'australia', desc: 'Dreamworld, Sea World and Currumbin Wildlife', tags: ['Theme Park', 'Wildlife'], rating: 4.7, price: '₹1,00,000' },
      { name: 'Phuket, Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', country: 'thailand', desc: 'Splash Waterpark, elephant sanctuaries and calm beaches', tags: ['Beach', 'Adventure'], rating: 4.7, price: '₹40,000' },
      { name: 'Langkawi, Malaysia', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Sky Bridge, cable car and duty-free island fun', tags: ['Budget', 'Nature'], rating: 4.6, price: '₹25,000' },
      { name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Pinnawala elephants, turtle hatcheries and train rides', tags: ['Wildlife', 'Budget'], rating: 4.6, price: '₹28,000' },
      { name: 'New Zealand', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', country: 'new-zealand', desc: 'Hobbiton, Kiwi bird houses and family adventure parks', tags: ['Nature', 'Adventure'], rating: 4.8, price: '₹1,30,000' },
      { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', country: 'vietnam', desc: 'Ha Long Bay cruises, Hoi An lanterns and street food', tags: ['Budget', 'Culture'], rating: 4.7, price: '₹30,000' },
    ],
  },

  luxury: {
    name: 'Luxury Destinations',
    slug: 'luxury',
    tagline: 'Premium Experiences & Opulent Stays',
    description: 'Indulge in the finest luxury travel — 5-star resorts, private islands, Michelin dining, personal butlers and exclusive experiences.',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&h=600&fit=crop',
    heroIcon: '💎',
    color: 'from-purple-500 to-violet-600',
    whyItems: [
      { icon: '🏨', title: '5-Star Resorts', desc: 'World-class luxury hotels and private villas' },
      { icon: '🍷', title: 'Fine Dining', desc: 'Michelin-star restaurants and private chef experiences' },
      { icon: '🛩️', title: 'Private Transfers', desc: 'Yacht cruises, helicopter rides and private jets' },
      { icon: '💆', title: 'Exclusive Spas', desc: 'Award-winning wellness retreats and spa experiences' },
    ],
    destinations: [
      { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'maldives', desc: 'Overwater villas, private butlers and underwater dining', tags: ['Beach', 'Honeymoon'], rating: 4.9, price: '₹1,50,000' },
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: 'Burj Al Arab, desert glamping and luxury shopping', tags: ['City', 'Shopping'], rating: 4.8, price: '₹1,20,000' },
      { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', country: 'europe', desc: 'Caldera-view suites, sunset dining and catamaran cruises', tags: ['Romance', 'Beach'], rating: 4.9, price: '₹1,10,000' },
      { name: 'Swiss Alps, Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Glacier Express, luxury chalets and Alpine spas', tags: ['Mountain', 'Spa'], rating: 4.9, price: '₹1,50,000' },
      { name: 'Bora Bora, French Polynesia', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'oceania', desc: 'Ultimate overwater bungalows and turquoise lagoons', tags: ['Beach', 'Honeymoon'], rating: 4.9, price: '₹2,00,000' },
      { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', country: 'japan', desc: 'Aman Tokyo, kaiseki dining and private ryokans', tags: ['Culture', 'Spa'], rating: 4.9, price: '₹1,20,000' },
      { name: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', country: 'europe', desc: 'The Ritz, West End shows and royal experiences', tags: ['City', 'Culture'], rating: 4.8, price: '₹1,30,000' },
      { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', country: 'europe', desc: 'Four Seasons George V, Seine cruises and haute cuisine', tags: ['Romance', 'Art'], rating: 4.9, price: '₹1,40,000' },
      { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', country: 'usa', desc: 'The Plaza, Broadway VIP and helicopter tours', tags: ['City', 'Entertainment'], rating: 4.7, price: '₹1,50,000' },
      { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', country: 'australia', desc: 'Park Hyatt, Harbour yacht dining and wine regions', tags: ['City', 'Food'], rating: 4.8, price: '₹1,40,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Aman villas, private infinity pools and rice terrace views', tags: ['Spa', 'Beach'], rating: 4.8, price: '₹80,000' },
      { name: 'Koh Samui, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'W Retreat, Four Seasons and beachfront luxury', tags: ['Beach', 'Spa'], rating: 4.8, price: '₹70,000' },
    ],
  },

  honeymoon: {
    name: 'Honeymoon Destinations',
    slug: 'honeymoon',
    tagline: 'Romantic Escapes for Newlyweds',
    description: 'The most romantic international destinations for honeymooners — from overwater villas to candlelit beach dinners and sunset cruises.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&h=600&fit=crop',
    heroIcon: '💑',
    color: 'from-rose-500 to-pink-600',
    whyItems: [
      { icon: '💕', title: 'Romantic Settings', desc: 'Private beaches, sunset dinners and starlit skies' },
      { icon: '🏝️', title: 'Overwater Villas', desc: 'Exclusive stays above crystal-clear lagoons' },
      { icon: '🚢', title: 'Couples Experiences', desc: 'Spa treatments, yacht cruises and private tours' },
      { icon: '📸', title: 'Picture Perfect', desc: 'Stunning backdrops for honeymoon photos' },
    ],
    destinations: [
      { name: 'Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', country: 'maldives', desc: 'Overwater romance, underwater restaurants and dolphin cruises', tags: ['Beach', 'Luxury'], rating: 4.9, price: '₹1,20,000' },
      { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', country: 'europe', desc: 'Sunset caldera views, wine tasting and cave hotels', tags: ['Romance', 'Luxury'], rating: 4.9, price: '₹1,10,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: 'Private pool villas, rice terrace walks and spa retreats', tags: ['Spa', 'Culture'], rating: 4.8, price: '₹50,000' },
      { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', country: 'europe', desc: 'Eiffel Tower dinner, Seine cruise and Versailles', tags: ['Romance', 'Art'], rating: 4.9, price: '₹1,00,000' },
      { name: 'Bora Bora, French Polynesia', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'oceania', desc: 'Ultimate overwater luxury and Polynesian romance', tags: ['Beach', 'Luxury'], rating: 4.9, price: '₹2,00,000' },
      { name: 'Swiss Alps, Switzerland', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', country: 'switzerland', desc: 'Mountain chalets, Glacier Express and Alpine romance', tags: ['Mountain', 'Scenic'], rating: 4.9, price: '₹1,30,000' },
      { name: 'Koh Samui, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: 'Beach villas, couples spa and private island dining', tags: ['Beach', 'Spa'], rating: 4.8, price: '₹55,000' },
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: 'Desert glamping, Burj Khalifa dinner and yacht party', tags: ['Luxury', 'City'], rating: 4.8, price: '₹90,000' },
      { name: 'Venice, Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', country: 'europe', desc: 'Gondola rides, St. Mark\'s Square and romantic canals', tags: ['Romance', 'Heritage'], rating: 4.8, price: '₹1,00,000' },
      { name: 'Maldives Overwater Villa', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop', country: 'maldives', desc: 'Glass floor villas, couples diving and private beaches', tags: ['Beach', 'Adventure'], rating: 4.9, price: '₹1,50,000' },
      { name: 'Langkawi, Malaysia', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', country: 'malaysia', desc: 'Pangkor Laut resort, geopark and duty-free island', tags: ['Budget', 'Beach'], rating: 4.7, price: '₹40,000' },
      { name: 'Hawaii, USA', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', country: 'usa', desc: 'Beachside luaus, helicopter tours and volcano sunsets', tags: ['Beach', 'Adventure'], rating: 4.8, price: '₹1,60,000' },
    ],
  },

  weekend: {
    name: 'Weekend Getaways',
    slug: 'weekend',
    tagline: 'Quick Escapes & Short Trips',
    description: 'Perfect weekend getaway destinations — short flights from India, quick trips and refreshing breaks that fit into your busy schedule.',
    heroImage: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=1400&h=600&fit=crop',
    heroIcon: '🗓️',
    color: 'from-indigo-500 to-blue-600',
    whyItems: [
      { icon: '✈️', title: 'Short Flights', desc: 'Quick 2-4 hour flights from major Indian cities' },
      { icon: '⏱️', title: 'Quick Trips', desc: '2-3 day itineraries that fit your schedule' },
      { icon: '💰', title: 'Budget Friendly', desc: 'Affordable getaways without breaking the bank' },
      { icon: '🔄', title: 'Frequent Deals', desc: 'Regular weekend packages and flash sales' },
    ],
    destinations: [
      { name: 'Colombo, Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: '1.5 hour flight, temples and beaches', tags: ['Budget', 'Culture'], rating: 4.6, price: '₹18,000' },
      { name: 'Kathmandu, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: '1.5 hour flight, temples and Himalayan vibes', tags: ['Budget', 'Spiritual'], rating: 4.7, price: '₹15,000' },
      { name: 'Malé, Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', country: 'maldives', desc: '4 hour flight, beaches and island vibes', tags: ['Beach', 'Quick'], rating: 4.8, price: '₹35,000' },
      { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', country: 'thailand', desc: '4 hour flight, temples, food and shopping', tags: ['Food', 'Shopping'], rating: 4.7, price: '₹22,000' },
      { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', country: 'singapore', desc: '5.5 hour flight, gardens and Universal Studios', tags: ['City', 'Family'], rating: 4.8, price: '₹35,000' },
      { name: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', country: 'malaysia', desc: '5 hour flight, Petronas Towers and food', tags: ['Budget', 'Food'], rating: 4.6, price: '₹20,000' },
      { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', country: 'uae', desc: '3.5 hour flight, shopping and desert safari', tags: ['Shopping', 'Adventure'], rating: 4.8, price: '₹35,000' },
      { name: 'Hanoi, Vietnam', image: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', country: 'vietnam', desc: '4.5 hour flight, Old Quarter and street food', tags: ['Budget', 'Food'], rating: 4.7, price: '₹22,000' },
      { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', country: 'indonesia', desc: '7 hour flight, temples and beaches', tags: ['Beach', 'Culture'], rating: 4.8, price: '₹30,000' },
      { name: 'Colombo to Galle, Sri Lanka', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Train ride to Galle fort and beaches', tags: ['Heritage', 'Beach'], rating: 4.6, price: '₹20,000' },
      { name: 'Phuket, Thailand', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', country: 'thailand', desc: '4.5 hour flight, beaches and nightlife', tags: ['Beach', 'Nightlife'], rating: 4.7, price: '₹25,000' },
      { name: 'Pokhara, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'Lakeside city with Annapurna views', tags: ['Budget', 'Adventure'], rating: 4.7, price: '₹12,000' },
    ],
  },

  offbeat: {
    name: 'Offbeat Destinations',
    slug: 'offbeat',
    tagline: 'Hidden Gems & Untouched Paradises',
    description: 'Discover lesser-known international destinations — hidden gems away from tourist crowds with authentic culture, untouched nature and unique experiences.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    heroIcon: '🧭',
    color: 'from-emerald-500 to-teal-600',
    whyItems: [
      { icon: '🧭', title: 'Hidden Gems', desc: 'Destinations off the tourist trail' },
      { icon: '🌿', title: 'Untouched Nature', desc: 'Pristine landscapes without the crowds' },
      { icon: '🤝', title: 'Authentic Culture', desc: 'Real local experiences and traditions' },
      { icon: '📸', title: 'Unique Experiences', desc: 'Once-in-a-lifetime adventures and discoveries' },
    ],
    destinations: [
      { name: 'Bhutan', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'asia', desc: 'Happiness Index country with monasteries and mountains', tags: ['Spiritual', 'Mountain'], rating: 4.8, price: '₹55,000' },
      { name: 'Sri Lanka Hill Country', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', country: 'sri-lanka', desc: 'Tea estates, Ella train ride and waterfall treks', tags: ['Nature', 'Budget'], rating: 4.7, price: '₹22,000' },
      { name: 'Zanzibar, Tanzania', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', country: 'africa', desc: 'Spice island with Stone Town heritage and beaches', tags: ['Beach', 'Culture'], rating: 4.7, price: '₹65,000' },
      { name: 'Georgia', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=300&fit=crop', country: 'asia', desc: 'Caucasus beauty, Tbilisi old town and wine country', tags: ['Budget', 'Wine'], rating: 4.7, price: '₹40,000' },
      { name: 'Oman', image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop', country: 'uae', desc: 'Desert wadis, Wahiba Sands and Muscat heritage', tags: ['Desert', 'Culture'], rating: 4.7, price: '₹50,000' },
      { name: 'Da Nang, Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', country: 'vietnam', desc: 'Golden Bridge, Marble Mountains and hidden beaches', tags: ['Beach', 'Adventure'], rating: 4.7, price: '₹25,000' },
      { name: 'Luang Prabang, Laos', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', country: 'asia', desc: 'UNESCO heritage town with morning alms giving', tags: ['Spiritual', 'Budget'], rating: 4.6, price: '₹20,000' },
      { name: 'Tbilisi, Georgia', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=300&fit=crop', country: 'asia', desc: 'Hot springs, sulphur baths and ancient churches', tags: ['Budget', 'Culture'], rating: 4.6, price: '₹35,000' },
      { name: 'Pristine Islands, Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', country: 'maldives', desc: 'Local islands with authentic Maldivian life', tags: ['Budget', 'Beach'], rating: 4.7, price: '₹30,000' },
      { name: 'Chiang Rai, Thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', country: 'thailand', desc: 'White Temple, night bazaar and Golden Triangle', tags: ['Culture', 'Budget'], rating: 4.6, price: '₹18,000' },
      { name: 'Kathmandu Valley, Nepal', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', country: 'nepal', desc: 'Ancient Newari towns, temples and mountain views', tags: ['Heritage', 'Budget'], rating: 4.7, price: '₹15,000' },
      { name: 'Hoi An, Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', country: 'vietnam', desc: 'Lantern-lit old town, tailors and cooking classes', tags: ['Heritage', 'Food'], rating: 4.8, price: '₹22,000' },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function InternationalDestPage() {
  const { catSlug } = useParams()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const category = CATEGORIES[catSlug] || CATEGORIES['']

  useEffect(() => {
    setLoading(true)
    api.get('/packages')
      .then(res => {
        const all = res.data || []
        const filtered = all.filter(p =>
          p.category === 'international' || p.country !== 'India' || p.country === 'India'
        )
        setPackages(filtered)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [catSlug])

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % category.destinations.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [category])

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Category Not Found</h1>
          <p className="text-navy-500 mb-6">The destination category doesn't exist.</p>
          <Link to="/international" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Browse All</Link>
        </div>
      </div>
    )
  }

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % category.destinations.length), 4000)
  }

  const filtered = packages.filter(p => {
    const q = search.toLowerCase()
    return !q || p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q)
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    if (sortBy === 'price-low') return (a.startingPrice || 0) - (b.startingPrice || 0)
    if (sortBy === 'price-high') return (b.startingPrice || 0) - (a.startingPrice || 0)
    return 0
  })

  // All categories list for sidebar navigation
  const allCats = Object.entries(CATEGORIES).filter(([k]) => k !== '')

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-navy-900">
        <img src={category.heroImage} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="container-wide">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link to="/international" className="hover:text-white">International</Link>
              <ChevronRight size={14} />
              <Link to="/international/destinations" className="hover:text-white">Destinations</Link>
              <ChevronRight size={14} />
              <span className="text-white">{category.name}</span>
            </div>
            <span className="text-4xl mb-3 block">{category.heroIcon}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 drop-shadow-lg">{category.name}</h1>
            <p className="text-lg text-gray-200 max-w-2xl drop-shadow">{category.description}</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="#destinations" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-medium backdrop-blur-sm transition-colors">
                <Compass size={18} /> Explore Destinations
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
                Enquire Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY SECTION ═══ */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Why Choose These</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Why {category.name}?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {category.whyItems.map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-amber-100 bg-amber-50/30 hover:border-amber-300 hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-navy-900 text-sm mb-1">{item.title}</h3>
                <p className="text-navy-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DESTINATIONS GRID ═══ */}
      <section className="section-padding bg-gray-50" id="destinations">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
                <h3 className="font-bold text-navy-900 mb-4">Destinations by Type</h3>
                <div className="space-y-1">
                  <Link to="/international/destinations" className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!catSlug ? 'bg-sky-100 text-sky-700' : 'text-navy-600 hover:bg-gray-50'}`}>
                    🌍 Popular Destinations
                  </Link>
                  {allCats.map(([key, cat]) => (
                    <Link key={key} to={`/international/destinations/${key}`} className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${catSlug === key ? 'bg-sky-100 text-sky-700' : 'text-navy-600 hover:bg-gray-50'}`}>
                      {cat.heroIcon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">{category.name}</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Explore {category.name}</h2>
                  <p className="text-navy-500 mt-2">{category.destinations.length} destinations to explore</p>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-56" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.destinations.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase())).map((dest, i) => (
                  <Link key={i} to={`/international/${dest.country}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {dest.tags.map((tag, ti) => (
                          <span key={ti} className="bg-white/90 text-navy-700 text-[10px] font-medium px-2 py-0.5 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-navy-700">{dest.rating}</span>
                      </div>
                      <h3 className="font-bold text-navy-900 text-sm group-hover:text-sky-600 transition-colors">{dest.name}</h3>
                      <p className="text-xs text-navy-500 mt-1 line-clamp-2">{dest.desc}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-lg font-bold text-sky-600">{dest.price}</span>
                        <span className="text-sky-600 text-xs font-semibold border border-sky-200 px-3 py-1.5 rounded-lg group-hover:bg-sky-50 transition-colors">Explore →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PACKAGES ═══ */}
      {filtered.length > 0 && (
        <section className="section-padding bg-white" id="packages">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Related Packages</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Travel Packages</h2>
              </div>
              <div className="flex gap-3">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.slice(0, 6).map(p => (
                <Link key={p.id || p.slug} to={`/packages/${p.slug || p.id}`} className="card overflow-hidden group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={14} className="text-gold-500 fill-gold-500" />
                      <span className="text-sm font-medium">{p.rating || 0}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-sky-600">₹{p.startingPrice?.toLocaleString()}</span>
                      <span className="text-xs text-navy-500">/person</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="bg-gradient-to-r from-sky-600 to-indigo-700 py-16">
        <div className="container-wide text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Explore {category.name.replace(' Destinations', '').replace(' Getaways', '')}?</h2>
          <p className="text-lg text-sky-100 max-w-2xl mx-auto mb-8">Let our travel experts create a perfect itinerary tailored just for you.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-sky-700 hover:bg-sky-50 px-8 py-3.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
              <Send size={18} /> Enquire Now
            </Link>
            <Link to="/plan-trip" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
              <Compass size={18} /> Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="section-padding bg-gray-50" id="contact">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your Trip</h2>
              <p className="text-navy-500 mb-8">Our travel experts will craft a perfect international itinerary with visa support, flights, hotels, and experiences.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 93137 10465</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">sales@maqlaimtours.com</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><MapPin size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Visit Us</p><p className="font-semibold text-navy-900">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Send Us an Enquiry</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our travel expert will contact you shortly.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="email" placeholder="Email Address *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone Number *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Select Destination Type</option>
                    {allCats.map(([key, cat]) => <option key={key} value={key}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Number of Travelers</option><option>1 Person</option><option>2 People</option><option>3-5 People</option><option>6-10 People</option><option>10+ People</option>
                  </select>
                </div>
                <textarea placeholder="Your Message / Special Requirements" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Send size={18} /> Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
