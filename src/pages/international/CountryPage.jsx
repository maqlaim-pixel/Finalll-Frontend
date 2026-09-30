import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Shield, Award, Globe, Plane, Heart } from 'lucide-react'
import WhyTravelSection from '../../components/common/WhyTravelSection'
import PackageCard from '../../components/common/PackageCard'
import ComingSoon from '../../components/common/ComingSoon'
import api from '../../services/api'

// ═══════════════════════════════════════════════════════════════
// COUNTRY DATA — All 14 international countries
// ═══════════════════════════════════════════════════════════════
const COUNTRIES = {
  uae: {
    name: 'United Arab Emirates',
    shortName: 'UAE',
    slug: 'uae',
    emoji: '🇦🇪',
    tagline: 'City of Gold & Modern Wonders',
    description: 'From the towering Burj Khalifa to the golden sands of the desert, the UAE offers a perfect blend of luxury, adventure, culture and world-class shopping.',
    heroImages: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover the United Arab Emirates',
    heroSubtitle: 'Luxury • Adventure • Culture • Shopping',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    whyItems: [
      { icon: '🏗️', title: 'Iconic Landmarks', desc: 'Burj Khalifa, Palm Jumeirah & futuristic architecture' },
      { icon: '🏜️', title: 'Desert Safari', desc: 'Thrilling dune bashing, camel rides & BBQ dinners' },
      { icon: '🛍️', title: 'World-Class Shopping', desc: 'Dubai Mall, gold souks & luxury retail therapy' },
      { icon: '🏖️', title: 'Stunning Beaches', desc: 'JBR Beach, Saadiyat Island & pristine coastlines' },
      { icon: '🎢', title: 'Entertainment', desc: 'Theme parks, water parks & record-breaking attractions' },
      { icon: '✨', title: 'Luxury Living', desc: '5-star hotels, fine dining & opulent experiences' },
    ],
    destinations: [
      { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', desc: 'City of superlatives — tallest buildings, biggest malls, and endless entertainment' },
      { name: 'Abu Dhabi', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=400&h=300&fit=crop', desc: 'Cultural capital with Sheikh Zayed Mosque and Louvre Museum' },
      { name: 'Sharjah', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', desc: 'Heritage and art hub with beautiful museums and souks' },
      { name: 'Ras Al Khaimah', image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop', desc: 'Adventure capital with Jebel Jais zip-line and mountain trekking' },
      { name: 'Ajman', image: 'https://images.unsplash.com/photo-1597659840241-37e2b7c2f486?w=400&h=300&fit=crop', desc: 'Hidden gem with quiet beaches and authentic Arabian culture' },
      { name: 'Fujairah', image: 'https://images.unsplash.com/photo-1565552655680-2f190496107d?w=400&h=300&fit=crop', desc: 'Eastern coast paradise for diving, snorkeling and fort exploration' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', alt: 'Dubai Skyline', location: 'Dubai' },
      { url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop', alt: 'Burj Khalifa', location: 'Dubai' },
      { url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop', alt: 'Desert Safari', location: 'Dubai' },
      { url: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=400&h=300&fit=crop', alt: 'Sheikh Zayed Mosque', location: 'Abu Dhabi' },
      { url: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop', alt: 'Jebel Jais', location: 'Ras Al Khaimah' },
      { url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', alt: 'Sharjah Souks', location: 'Sharjah' },
    ],
    stats: { destinations: '30+', packages: '50+', travelers: '25,000+', rating: '4.8' },
  },

  thailand: {
    name: 'Thailand',
    shortName: 'Thailand',
    slug: 'thailand',
    emoji: '🇹🇭',
    tagline: 'Land of Smiles',
    description: 'Thailand enchants with its ornate temples, tropical beaches, royal palaces, and legendary street food. From Bangkok\'s bustle to Phuket\'s serenity, every corner tells a story.',
    heroImages: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Thailand',
    heroSubtitle: 'Temples • Beaches • Street Food • Nightlife',
    cities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi', 'Pattaya', 'Koh Samui'],
    whyItems: [
      { icon: '🛕', title: 'Golden Temples', desc: 'Grand Palace, Wat Arun & ancient Buddhist temples' },
      { icon: '🍜', title: 'Legendary Street Food', desc: 'Pad Thai, mango sticky rice & night market feasts' },
      { icon: '🏖️', title: 'Tropical Islands', desc: 'Phuket, Krabi, Koh Samui & Phi Phi Islands' },
      { icon: '💆', title: 'Thai Spa & Wellness', desc: 'World-famous Thai massage & wellness retreats' },
      { icon: '🎉', title: 'Vibrant Nightlife', desc: 'Rooftop bars, night markets & Full Moon Party' },
      { icon: '🐘', title: 'Wildlife & Nature', desc: 'Elephant sanctuaries, jungles & national parks' },
    ],
    destinations: [
      { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', desc: 'The bustling capital with golden temples, floating markets & nightlife' },
      { name: 'Phuket', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', desc: 'Thailand\'s largest island with stunning beaches and luxury resorts' },
      { name: 'Chiang Mai', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', desc: 'Mountain city with ancient temples, night bazaars & elephant parks' },
      { name: 'Krabi', image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=300&fit=crop', desc: 'Dramatic limestone cliffs, emerald waters & island hopping' },
      { name: 'Pattaya', image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop', desc: 'Beach city with water sports, walking street & entertainment' },
      { name: 'Koh Samui', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', desc: 'Luxury tropical island with palm-fringed beaches & coconut groves' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', alt: 'Wat Arun', location: 'Bangkok' },
      { url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', alt: 'Doi Suthep Temple', location: 'Chiang Mai' },
      { url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', alt: 'Patong Beach', location: 'Phuket' },
      { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=300&fit=crop', alt: 'Railay Beach', location: 'Krabi' },
      { url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop', alt: 'Floating Market', location: 'Bangkok' },
      { url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', alt: 'Thai Food', location: 'Chiang Mai' },
    ],
    stats: { destinations: '40+', packages: '60+', travelers: '30,000+', rating: '4.9' },
  },

  singapore: {
    name: 'Singapore',
    shortName: 'Singapore',
    slug: 'singapore',
    emoji: '🇸🇬',
    tagline: 'Garden City of the Future',
    description: 'Singapore dazzles with its futuristic skyline, lush gardens, world-class cuisine, and multicultural heritage. A tiny island with outsized experiences.',
    heroImages: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508355576831-e567172eb43a?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Singapore',
    heroSubtitle: 'Gardens • Food • Shopping • Culture',
    cities: ['Marina Bay', 'Sentosa', 'Orchard Road', 'Chinatown', 'Little India', 'Kampong Glam'],
    whyItems: [
      { icon: '🌿', title: 'Gardens by the Bay', desc: 'Supertree Grove, Cloud Forest & Flower Dome' },
      { icon: '🏙️', title: 'Marina Bay Sands', desc: 'Iconic skyline, infinity pool & light shows' },
      { icon: '🍜', title: 'Hawker Centres', desc: 'Michelin-starred street food at affordable prices' },
      { icon: '🎰', title: 'Sentosa Island', desc: 'Theme parks, beaches & Universal Studios' },
      { icon: '🛍️', title: 'Shopping Paradise', desc: 'Orchard Road, Bugis Street & luxury boutiques' },
      { icon: '🎭', title: 'Multicultural Heritage', desc: 'Chinatown, Little India & Kampong Glam' },
    ],
    destinations: [
      { name: 'Marina Bay', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', desc: 'Futuristic skyline with Sands, Gardens & Merlion Park' },
      { name: 'Sentosa Island', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop', desc: 'Fun island with Universal Studios, S.E.A. Aquarium & beaches' },
      { name: 'Chinatown', image: 'https://images.unsplash.com/photo-1508355576831-e567172eb43a?w=400&h=300&fit=crop', desc: 'Heritage district with temples, street food & shops' },
      { name: 'Orchard Road', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', desc: 'Premier shopping belt with malls and luxury brands' },
      { name: 'Little India', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop', desc: 'Vibrant streets with colorful shops, temples & Indian food' },
      { name: 'Jurong Bird Park', image: 'https://images.unsplash.com/photo-1508355576831-e567172eb43a?w=400&h=300&fit=crop', desc: 'World\'s largest bird paradise with 5,000+ birds' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', alt: 'Marina Bay Sands', location: 'Marina Bay' },
      { url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop', alt: 'Gardens by the Bay', location: 'Marina Bay' },
      { url: 'https://images.unsplash.com/photo-1508355576831-e567172eb43a?w=400&h=300&fit=crop', alt: 'Sentosa Beach', location: 'Sentosa' },
      { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', alt: 'Singapore Skyline', location: 'Downtown' },
    ],
    stats: { destinations: '25+', packages: '40+', travelers: '20,000+', rating: '4.8' },
  },

  malaysia: {
    name: 'Malaysia',
    shortName: 'Malaysia',
    slug: 'malaysia',
    emoji: '🇲🇾',
    tagline: 'Truly Asia',
    description: 'Malaysia is a kaleidoscope of cultures, cuisine, and natural beauty. From Kuala Lumpur\'s Petronas Towers to Langkawi\'s beaches, it truly is "Truly Asia".',
    heroImages: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591018653367-3a1e4e5a54c5?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Malaysia',
    heroSubtitle: 'Culture • Nature • Food • Adventure',
    cities: ['Kuala Lumpur', 'Langkawi', 'Penang', 'Cameron Highlands', 'Kota Kinabalu', 'Malacca'],
    whyItems: [
      { icon: '🗼', title: 'Petronas Towers', desc: 'World-famous twin towers & KL skyline' },
      { icon: '🏝️', title: 'Island Paradise', desc: 'Langkawi, Perhentian Islands & Redang' },
      { icon: '🍜', title: 'Food Heaven', desc: 'Nasi Lemak, Char Kway Teow & Roti Canai' },
      { icon: '🌿', title: 'Rainforests', desc: 'Taman Negara, Borneo & Cameron Highlands' },
      { icon: '🏖️', title: 'Beaches', desc: 'Pristine beaches and crystal-clear waters' },
      { icon: '🎭', title: 'Cultural Fusion', desc: 'Malay, Chinese, Indian & indigenous heritage' },
    ],
    destinations: [
      { name: 'Kuala Lumpur', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', desc: 'Modern capital with Petronas Towers and vibrant food scene' },
      { name: 'Langkawi', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', desc: 'Duty-free island with stunning beaches and sky bridge' },
      { name: 'Penang', image: 'https://images.unsplash.com/photo-1591018653367-3a1e4e5a54c5?w=400&h=300&fit=crop', desc: 'Heritage city with famous street food and colonial charm' },
      { name: 'Cameron Highlands', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', desc: 'Cool hill station with tea plantations and strawberry farms' },
      { name: 'Kota Kinabalu', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', desc: 'Gateway to Mount Kinabalu and Borneo\'s wildlife' },
      { name: 'Malacca', image: 'https://images.unsplash.com/photo-1591018653367-3a1e4e5a54c5?w=400&h=300&fit=crop', desc: 'UNESCO heritage city with Portuguese & Dutch history' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', alt: 'Petronas Towers', location: 'Kuala Lumpur' },
      { url: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', alt: 'Langkawi Sky Bridge', location: 'Langkawi' },
      { url: 'https://images.unsplash.com/photo-1591018653367-3a1e4e5a54c5?w=400&h=300&fit=crop', alt: 'Penang Street Art', location: 'Penang' },
    ],
    stats: { destinations: '30+', packages: '45+', travelers: '18,000+', rating: '4.7' },
  },

  maldives: {
    name: 'Maldives',
    shortName: 'Maldives',
    slug: 'maldives',
    emoji: '🇲🇻',
    tagline: 'Tropical Paradise',
    description: 'The Maldives is the epitome of tropical luxury — overwater villas, turquoise lagoons, pristine white sand beaches, and vibrant coral reefs.',
    heroImages: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Maldives',
    heroSubtitle: 'Beaches • Overwater Villas • Diving • Romance',
    cities: ['Malé', 'Baa Atoll', 'Ari Atoll', 'South Malé Atoll', 'Noonu Atoll', 'Laamu Atoll'],
    whyItems: [
      { icon: '🏝️', title: 'Overwater Villas', desc: 'Luxury stays above crystal-clear lagoons' },
      { icon: '🐠', title: 'Snorkeling & Diving', desc: 'Vibrant coral reefs and marine life' },
      { icon: '💎', title: 'Turquoise Waters', desc: 'Pristine white sand beaches and blue lagoons' },
      { icon: '💑', title: 'Romance', desc: 'Perfect honeymoon and romantic getaway' },
      { icon: '🧖', title: 'Luxury Spas', desc: 'Overwater spas and wellness retreats' },
      { icon: '🌅', title: 'Sunset Cruises', desc: 'Dolphin watching and private island dining' },
    ],
    destinations: [
      { name: 'Malé', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', desc: 'The capital city with local culture and markets' },
      { name: 'Baa Atoll', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', desc: 'UNESCO Biosphere Reserve with manta rays' },
      { name: 'Ari Atoll', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop', desc: 'Best diving with whale sharks and coral gardens' },
      { name: 'South Malé Atoll', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', desc: 'Pristine resorts close to the airport' },
      { name: 'Noonu Atoll', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', desc: 'Exclusive private island resorts' },
      { name: 'Laamu Atoll', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop', desc: 'Surfing paradise and eco-luxury stays' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', alt: 'Overwater Villa', location: 'Baa Atoll' },
      { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop', alt: 'Turquoise Lagoon', location: 'Ari Atoll' },
      { url: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop', alt: 'Beach Sunset', location: 'Malé' },
    ],
    stats: { destinations: '20+', packages: '35+', travelers: '15,000+', rating: '4.9' },
  },

  indonesia: {
    name: 'Indonesia (Bali)',
    shortName: 'Bali',
    slug: 'indonesia',
    emoji: '🇮🇩',
    tagline: 'Island of Gods',
    description: 'Bali and Indonesia offer a magical mix of ancient temples, lush rice terraces, vibrant coral reefs, and a deeply spiritual culture that captivates every traveler.',
    heroImages: [
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573790387438-4b9fa79c2885?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Bali & Indonesia',
    heroSubtitle: 'Temples • Rice Terraces • Beaches • Culture',
    cities: ['Ubud', 'Seminyak', 'Kuta', 'Nusa Dua', 'Uluwatu', 'Gili Islands'],
    whyItems: [
      { icon: '🛕', title: 'Ancient Temples', desc: 'Tanah Lot, Uluwatu & sacred water temples' },
      { icon: '🌾', title: 'Rice Terraces', desc: 'Tegallalang & Jatiluwih UNESCO terraces' },
      { icon: '🏄', title: 'Surfing Capital', desc: 'World-class waves at Kuta, Uluwatu & Canggu' },
      { icon: '🐒', title: 'Wildlife', desc: 'Sacred monkeys, turtles & volcanic treks' },
      { icon: '💆', title: 'Wellness Retreats', desc: 'Yoga, meditation & traditional Balinese spa' },
      { icon: '🎭', title: 'Balinese Culture', desc: 'Traditional dance, ceremonies & art villages' },
    ],
    destinations: [
      { name: 'Ubud', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', desc: 'Art, culture, rice terraces and spiritual heart of Bali' },
      { name: 'Seminyak', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', desc: 'Trendy beach clubs, boutiques and sunset bars' },
      { name: 'Kuta', image: 'https://images.unsplash.com/photo-1573790387438-4b9fa79c2885?w=400&h=300&fit=crop', desc: 'Famous surf beach with vibrant nightlife' },
      { name: 'Nusa Dua', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', desc: 'Luxury resort area with pristine beaches' },
      { name: 'Uluwatu', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', desc: 'Clifftop temple and world-class surfing' },
      { name: 'Gili Islands', image: 'https://images.unsplash.com/photo-1573790387438-4b9fa79c2885?w=400&h=300&fit=crop', desc: 'Three tiny islands with no cars and crystal waters' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', alt: 'Rice Terraces', location: 'Ubud' },
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', alt: 'Tanah Lot Temple', location: 'Bali' },
      { url: 'https://images.unsplash.com/photo-1573790387438-4b9fa79c2885?w=400&h=300&fit=crop', alt: 'Uluwatu Beach', location: 'Uluwatu' },
    ],
    stats: { destinations: '35+', packages: '50+', travelers: '22,000+', rating: '4.8' },
  },

  vietnam: {
    name: 'Vietnam',
    shortName: 'Vietnam',
    slug: 'vietnam',
    emoji: '🇻🇳',
    tagline: 'Timeless Charm',
    description: 'Vietnam captivates with its dramatic landscapes, rich history, incredible street food, and warm hospitality. From Ha Long Bay to Ho Chi Minh City, every moment is an adventure.',
    heroImages: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Vietnam',
    heroSubtitle: 'History • Food • Nature • Adventure',
    cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Ha Long Bay', 'Phu Quoc'],
    whyItems: [
      { icon: '🚢', title: 'Ha Long Bay', desc: 'UNESCO limestone karsts and emerald waters' },
      { icon: '🍜', title: 'Pho & Street Food', desc: 'World-famous noodles, banh mi & egg coffee' },
      { icon: '🏮', title: 'Hoi An Ancient Town', desc: 'Lantern-lit streets and tailor shops' },
      { icon: '🏖️', title: 'Beautiful Beaches', desc: 'Da Nang, Nha Trang & Phu Quoc Island' },
      { icon: '🏍️', title: 'Motorbike Adventures', desc: 'Epic road trips through mountains and coast' },
      { icon: '🏛️', title: 'Rich History', desc: 'War museums, ancient temples & colonial architecture' },
    ],
    destinations: [
      { name: 'Ha Long Bay', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop', desc: 'Thousands of limestone islands rising from emerald waters' },
      { name: 'Hanoi', image: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', desc: 'Ancient capital with Old Quarter, lakes & street food' },
      { name: 'Hoi An', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', desc: 'Charming ancient town with lanterns & tailor shops' },
      { name: 'Ho Chi Minh City', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop', desc: 'Bustling metropolis with war history and modern vibes' },
      { name: 'Da Nang', image: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', desc: 'Coastal city with Golden Bridge and beautiful beaches' },
      { name: 'Phu Quoc', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', desc: 'Pearl Island with stunning beaches and pepper farms' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop', alt: 'Ha Long Bay', location: 'Quang Ninh' },
      { url: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', alt: 'Hanoi Old Quarter', location: 'Hanoi' },
      { url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', alt: 'Hoi An Lanterns', location: 'Hoi An' },
    ],
    stats: { destinations: '25+', packages: '40+', travelers: '15,000+', rating: '4.7' },
  },

  japan: {
    name: 'Japan',
    shortName: 'Japan',
    slug: 'japan',
    emoji: '🇯🇵',
    tagline: 'Land of the Rising Sun',
    description: 'Japan seamlessly blends ancient traditions with cutting-edge modernity. Cherry blossoms, serene temples, neon-lit cities, and world-class cuisine await.',
    heroImages: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Japan',
    heroSubtitle: 'Tradition • Technology • Cherry Blossoms • Cuisine',
    cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Hakone', 'Nara'],
    whyItems: [
      { icon: '⛩️', title: 'Ancient Temples', desc: 'Fushimi Inari, Kinkaku-ji & Senso-ji' },
      { icon: '🌸', title: 'Cherry Blossoms', desc: 'Spring sakura season is magical' },
      { icon: '🍣', title: 'Japanese Cuisine', desc: 'Sushi, ramen, wagyu & sake' },
      { icon: '🚄', title: 'Bullet Trains', desc: 'Shinkansen speed and efficiency' },
      { icon: '🏙️', title: 'Modern Cities', desc: 'Tokyo\'s neon lights and Osaka\'s street food' },
      { icon: '🏔️', title: 'Mount Fuji', desc: 'Japan\'s iconic volcanic peak' },
    ],
    destinations: [
      { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', desc: 'The bustling capital with temples, tech & neon lights' },
      { name: 'Kyoto', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', desc: 'Cultural heart with geishas, gardens & temples' },
      { name: 'Osaka', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop', desc: 'Kitchen of Japan with incredible street food' },
      { name: 'Hakone', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', desc: 'Hot springs with Mount Fuji views' },
      { name: 'Nara', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', desc: 'Ancient capital with friendly deer and giant Buddha' },
      { name: 'Hiroshima', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop', desc: 'Peace Memorial Park and gateway to Miyajima Island' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', alt: 'Tokyo Tower', location: 'Tokyo' },
      { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', alt: 'Fushimi Inari', location: 'Kyoto' },
      { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop', alt: 'Mount Fuji', location: 'Hakone' },
    ],
    stats: { destinations: '30+', packages: '45+', travelers: '12,000+', rating: '4.9' },
  },

  switzerland: {
    name: 'Switzerland',
    shortName: 'Switzerland',
    slug: 'switzerland',
    emoji: '🇨🇭',
    tagline: 'Heaven on Earth',
    description: 'Switzerland mesmerizes with snow-capped Alps, pristine lakes, charming villages, and precision-perfect experiences. A paradise for nature lovers and adventure seekers.',
    heroImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Switzerland',
    heroSubtitle: 'Alps • Lakes • Villages • Adventure',
    cities: ['Zurich', 'Lucerne', 'Interlaken', 'Geneva', 'Zermatt', 'Grindelwald'],
    whyItems: [
      { icon: '🏔️', title: 'Swiss Alps', desc: 'Jungfrau, Matterhorn & breathtaking peaks' },
      { icon: '🚂', title: 'Scenic Trains', desc: 'Glacier Express & Bernina Express routes' },
      { icon: '🧀', title: 'Swiss Cuisine', desc: 'Fondue, raclette & Swiss chocolate' },
      { icon: '⛷️', title: 'Winter Sports', desc: 'World-class skiing and snowboarding' },
      { icon: '🏞️', title: 'Pristine Lakes', desc: 'Lake Geneva, Lake Lucerne & crystal waters' },
      { icon: '🏘️', title: 'Charming Villages', desc: 'Grindelwald, Zermatt & fairy-tale towns' },
    ],
    destinations: [
      { name: 'Interlaken', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', desc: 'Adventure capital nestled between two lakes' },
      { name: 'Zurich', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=300&fit=crop', desc: 'Cosmopolitan city with lake views and old town charm' },
      { name: 'Lucerne', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop', desc: 'Medieval Chapel Bridge and Alpine backdrop' },
      { name: 'Zermatt', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', desc: 'Car-free village at the foot of the Matterhorn' },
      { name: 'Geneva', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=300&fit=crop', desc: 'International city with Jet d\'Eau and UN headquarters' },
      { name: 'Grindelwald', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop', desc: 'Alpine village with Eiger views and glacier treks' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', alt: 'Jungfrau Region', location: 'Interlaken' },
      { url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=300&fit=crop', alt: 'Lake Zurich', location: 'Zurich' },
      { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop', alt: 'Matterhorn', location: 'Zermatt' },
    ],
    stats: { destinations: '20+', packages: '30+', travelers: '10,000+', rating: '4.9' },
  },

  'sri-lanka': {
    name: 'Sri Lanka',
    shortName: 'Sri Lanka',
    slug: 'sri-lanka',
    emoji: '🇱🇰',
    tagline: 'Pearl of the Indian Ocean',
    description: 'Sri Lanka packs incredible diversity into a small island — ancient cities, lush tea plantations, pristine beaches, and abundant wildlife.',
    heroImages: [
      'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Sri Lanka',
    heroSubtitle: 'Temples • Tea • Safari • Beaches',
    cities: ['Colombo', 'Kandy', 'Ella', 'Galle', 'Sigiriya', 'Nuwara Eliya'],
    whyItems: [
      { icon: '🦁', title: 'Wildlife Safari', desc: 'Yala & Udawalawe national parks' },
      { icon: '🍵', title: 'Tea Plantations', desc: 'Hill country tea estates and factory tours' },
      { icon: '🏛️', title: 'Ancient Cities', desc: 'Sigiriya Rock Fortress & Polonnaruwa' },
      { icon: '🏖️', title: 'Beautiful Beaches', desc: 'Unawatuna, Mirissa & Arugam Bay' },
      { icon: '🚂', title: 'Scenic Train Rides', desc: 'Kandy to Ella — one of the world\'s best train journeys' },
      { icon: '🐢', title: 'Sea Turtles', desc: 'Turtle hatcheries and nesting beaches' },
    ],
    destinations: [
      { name: 'Sigiriya', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', desc: 'Ancient rock fortress with stunning frescoes' },
      { name: 'Ella', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', desc: 'Hill country gem with Nine Arch Bridge' },
      { name: 'Galle', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=300&fit=crop', desc: 'Dutch colonial fort and coastal charm' },
      { name: 'Kandy', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', desc: 'Cultural capital with Temple of the Tooth' },
      { name: 'Nuwara Eliya', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', desc: 'Little England with tea plantations and cool climate' },
      { name: 'Mirissa', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=300&fit=crop', desc: 'Whale watching and palm-fringed beaches' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', alt: 'Sigiriya Rock', location: 'Sigiriya' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', alt: 'Tea Plantation', location: 'Ella' },
      { url: 'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=300&fit=crop', alt: 'Galle Fort', location: 'Galle' },
    ],
    stats: { destinations: '25+', packages: '35+', travelers: '12,000+', rating: '4.7' },
  },

  europe: {
    name: 'Europe',
    shortName: 'Europe',
    slug: 'europe',
    emoji: '🇪🇺',
    tagline: 'Classic Elegance',
    description: 'Europe is a tapestry of history, art, culture, and breathtaking landscapes. From Parisian cafes to Swiss Alps, Roman ruins to Nordic fjords — every country is a world of its own.',
    heroImages: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Europe',
    heroSubtitle: 'History • Art • Culture • Scenic Beauty',
    cities: ['Paris', 'Rome', 'Barcelona', 'Amsterdam', 'London', 'Prague'],
    whyItems: [
      { icon: '🗼', title: 'Iconic Landmarks', desc: 'Eiffel Tower, Colosseum & Sagrada Familia' },
      { icon: '🎨', title: 'Art & Museums', desc: 'Louvre, Vatican Museums & Prado' },
      { icon: '🍷', title: 'Wine & Cuisine', desc: 'French wine, Italian pasta & Spanish tapas' },
      { icon: '🏰', title: 'Castles & Heritage', desc: 'Medieval castles, palaces & historic cities' },
      { icon: '🏔️', title: 'Alpine Scenery', desc: 'Swiss Alps, Austrian lakes & Nordic fjords' },
      { icon: '✈️', title: 'Multi-Country Tours', desc: 'Explore 5+ countries in one trip' },
    ],
    destinations: [
      { name: 'Paris', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', desc: 'City of Lights with Eiffel Tower and Louvre Museum' },
      { name: 'Rome', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', desc: 'Eternal City with Colosseum, Vatican & ancient ruins' },
      { name: 'Barcelona', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', desc: 'Gaudí architecture, beaches and vibrant nightlife' },
      { name: 'Amsterdam', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', desc: 'Canals, museums, tulips and cycling culture' },
      { name: 'London', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', desc: 'Big Ben, Buckingham Palace & West End theatre' },
      { name: 'Prague', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', desc: 'Fairy-tale old town and stunning Gothic architecture' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', alt: 'Eiffel Tower', location: 'Paris, France' },
      { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', alt: 'Colosseum', location: 'Rome, Italy' },
      { url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', alt: 'Sagrada Familia', location: 'Barcelona, Spain' },
    ],
    stats: { destinations: '50+', packages: '70+', travelers: '25,000+', rating: '4.8' },
  },

  australia: {
    name: 'Australia',
    shortName: 'Australia',
    slug: 'australia',
    emoji: '🇦🇺',
    tagline: 'Land Down Under',
    description: 'Australia offers endless adventures — from the Great Barrier Reef and Uluru to cosmopolitan Sydney and Melbourne. A continent of unique wildlife and stunning landscapes.',
    heroImages: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover Australia',
    heroSubtitle: 'Reefs • Outback • Wildlife • Cities',
    cities: ['Sydney', 'Melbourne', 'Gold Coast', 'Cairns', 'Brisbane', 'Perth'],
    whyItems: [
      { icon: '🐚', title: 'Great Barrier Reef', desc: 'World\'s largest coral reef system' },
      { icon: '🦘', title: 'Unique Wildlife', desc: 'Koalas, kangaroos & Tasmanian devils' },
      { icon: '🏖️', title: 'Stunning Beaches', desc: 'Bondi, Whitehaven & 10,000+ beaches' },
      { icon: '🏙️', title: 'Vibrant Cities', desc: 'Sydney Opera House & Melbourne laneways' },
      { icon: '🏜️', title: 'The Outback', desc: 'Uluru, red desert & Aboriginal culture' },
      { icon: '🍷', title: 'Wine Regions', desc: 'Barossa Valley, Hunter Valley & Yarra' },
    ],
    destinations: [
      { name: 'Sydney', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', desc: 'Iconic Opera House, Harbour Bridge & Bondi Beach' },
      { name: 'Melbourne', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop', desc: 'Arts, coffee culture, street art & Great Ocean Road' },
      { name: 'Gold Coast', image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', desc: 'Theme parks, surfing beaches & hinterland' },
      { name: 'Cairns', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', desc: 'Gateway to Great Barrier Reef & Daintree Rainforest' },
      { name: 'Brisbane', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop', desc: 'Sunny capital with South Bank & Story Bridge' },
      { name: 'Perth', image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', desc: 'Indian Ocean gateway with Rottnest Island' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', alt: 'Sydney Opera House', location: 'Sydney' },
      { url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop', alt: 'Great Ocean Road', location: 'Melbourne' },
      { url: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop', alt: 'Gold Coast', location: 'Gold Coast' },
    ],
    stats: { destinations: '30+', packages: '45+', travelers: '15,000+', rating: '4.8' },
  },

  'new-zealand': {
    name: 'New Zealand',
    shortName: 'New Zealand',
    slug: 'new-zealand',
    emoji: '🇳🇿',
    tagline: 'Middle Earth',
    description: 'New Zealand is a paradise of fjords, glaciers, volcanic landscapes, and adventure. From the Lord of the Rings landscapes to Maori culture, it\'s truly Middle Earth brought to life.',
    heroImages: [
      'https://images.unsplash.com/photo-1469521669194-babb45599def?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470075801209-17f9ec0each9e?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover New Zealand',
    heroSubtitle: 'Fjords • Adventure • Nature • Maori Culture',
    cities: ['Auckland', 'Queenstown', 'Wellington', 'Christchurch', 'Rotorua', 'Milford Sound'],
    whyItems: [
      { icon: '🏔️', title: 'Fjords & Glaciers', desc: 'Milford Sound, Franz Josef & Fox Glacier' },
      { icon: '🧥', title: 'Adventure Capital', desc: 'Bungee, skydiving, jet boating in Queenstown' },
      { icon: '🌿', title: 'Middle Earth Landscapes', desc: 'Hobbiton, Tongariro & stunning national parks' },
      { icon: '🌋', title: 'Volcanic Wonders', desc: 'Rotorua geothermal & White Island' },
      { icon: '🐦', title: 'Unique Wildlife', desc: 'Kiwi birds, dolphins & whale watching' },
      { icon: '💑', title: 'Romantic Escapes', desc: 'Lake Tekapo, Wanaka & stargazing' },
    ],
    destinations: [
      { name: 'Queenstown', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', desc: 'Adventure capital with bungee, skiing & lake cruises' },
      { name: 'Auckland', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', desc: 'City of Sails with Sky Tower & harbor islands' },
      { name: 'Milford Sound', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', desc: 'Breathtaking fjord with waterfalls and wildlife' },
      { name: 'Rotorua', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', desc: 'Geothermal wonders and Maori cultural experiences' },
      { name: 'Wellington', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', desc: 'Capital city with Te Papa museum and craft beer scene' },
      { name: 'Christchurch', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', desc: 'Garden City with punting and Antarctic Centre' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', alt: 'Milford Sound', location: 'South Island' },
      { url: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', alt: 'Lake Tekapo', location: 'South Island' },
    ],
    stats: { destinations: '20+', packages: '30+', travelers: '8,000+', rating: '4.9' },
  },

  usa: {
    name: 'United States of America',
    shortName: 'USA',
    slug: 'usa',
    emoji: '🇺🇸',
    tagline: 'The Land of Dreams',
    description: 'The USA offers endless diversity — from New York\'s skyline to the Grand Canyon, from Hollywood glamour to Hawaiian beaches. Every state is a new adventure.',
    heroImages: [
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1400&h=600&fit=crop',
    ],
    heroTitle: 'Discover the United States',
    heroSubtitle: 'Cities • National Parks • Entertainment • Diversity',
    cities: ['New York', 'Los Angeles', 'Las Vegas', 'San Francisco', 'Miami', 'Washington DC'],
    whyItems: [
      { icon: '🗽', title: 'Iconic Cities', desc: 'New York, LA, Chicago & Las Vegas' },
      { icon: '🏔️', title: 'National Parks', desc: 'Grand Canyon, Yellowstone & Yosemite' },
      { icon: '🎢', title: 'Entertainment', desc: 'Disney World, Hollywood & Broadway' },
      { icon: '🌆', title: 'Diverse Culture', desc: 'Melting pot of food, art & traditions' },
      { icon: '🏖️', title: 'Coastal Beauty', desc: 'Miami Beach, California coast & Hawaii' },
      { icon: '🛍️', title: 'Shopping & Tech', desc: 'Silicon Valley, outlet malls & luxury brands' },
    ],
    destinations: [
      { name: 'New York City', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', desc: 'The city that never sleeps — Times Square, Central Park & Broadway' },
      { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', desc: 'Hollywood, beaches & celebrity sightings' },
      { name: 'Las Vegas', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop', desc: 'Entertainment capital with shows, casinos & Grand Canyon day trips' },
      { name: 'San Francisco', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', desc: 'Golden Gate Bridge, cable cars & Silicon Valley' },
      { name: 'Miami', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', desc: 'Art Deco district, South Beach & vibrant nightlife' },
      { name: 'Washington DC', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop', desc: 'Capital city with monuments, museums & history' },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', alt: 'Statue of Liberty', location: 'New York' },
      { url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', alt: 'Hollywood Sign', location: 'Los Angeles' },
      { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop', alt: 'Golden Gate Bridge', location: 'San Francisco' },
    ],
    stats: { destinations: '50+', packages: '60+', travelers: '20,000+', rating: '4.7' },
  },
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CountryPage() {
  const { destSlug } = useParams()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [galleryIndex, setGalleryIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const country = COUNTRIES[destSlug]

  useEffect(() => {
    if (!country) return
    setLoading(true)
    // Fetch packages that match this country
    api.get('/packages')
      .then(res => {
        const all = res.data || []
        const nameLower = country.name.toLowerCase()
        const shortLower = country.shortName.toLowerCase()
        const filtered = all.filter(p =>
          p.country?.toLowerCase() === nameLower ||
          p.destination?.toLowerCase().includes(nameLower) ||
          p.destination?.toLowerCase().includes(shortLower) ||
          p.tags?.toLowerCase().includes(nameLower) ||
          p.tags?.toLowerCase().includes(shortLower)
        )
        setPackages(filtered)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [country])

  useEffect(() => {
    if (!country) return
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % country.heroImages.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [country])

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Country Not Found</h1>
          <p className="text-navy-500 mb-6">The country you're looking for doesn't exist.</p>
          <Link to="/international" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Browse All Countries
          </Link>
        </div>
      </div>
    )
  }

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % country.heroImages.length), 5000)
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

  return (
    <div>
      {/* ═══ HERO CAROUSEL ═══ */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-navy-900">
        {country.heroImages.map((img, i) => {
          const src = typeof img === 'string' ? img : img.url
          return (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={src} alt={country.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                <div className="container-wide">
                  <p className="text-gold-400 text-sm font-medium mb-2">{country.emoji} {country.tagline}</p>
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{country.heroTitle}</h1>
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow">{country.heroSubtitle}</p>
                  <p className="text-gray-300 mt-3 max-w-xl text-sm md:text-base">{country.description}</p>
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-gold-400" /> <strong>{country.stats.destinations}</strong> Destinations</div>
                    <div className="flex items-center gap-2 text-sm"><Award size={16} className="text-gold-400" /> <strong>{country.stats.packages}</strong> Packages</div>
                    <div className="flex items-center gap-2 text-sm"><Heart size={16} className="text-gold-400" /> <strong>{country.stats.travelers}</strong> Happy Travelers</div>
                    <div className="flex items-center gap-2 text-sm"><Shield size={16} className="text-gold-400" /> {country.stats.rating} ★ Rating</div>
                  </div>
                  <Link to="#packages" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    {loading ? 'Loading...' : <>{`Explore ${packages.length > 0 ? packages.length + ' Packages' : 'Packages'}`} <ArrowRight size={18} /></>}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={() => goToSlide((currentSlide - 1 + country.heroImages.length) % country.heroImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronLeft size={24} /></button>
        <button onClick={() => goToSlide((currentSlide + 1) % country.heroImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {country.heroImages.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      </section>

      {/* ═══ WHY TRAVEL SECTION ═══ */}
      <WhyTravelSection title={`Why Travel to ${country.shortName}?`} subtitle={`Discover ${country.shortName}`} items={country.whyItems} />

      {/* ═══ TOP DESTINATIONS ═══ */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Explore {country.shortName}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Top Destinations in {country.shortName}</h2>
            <p className="text-navy-500 mt-3 max-w-xl mx-auto">Discover the most incredible places to visit in {country.shortName}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.destinations.map((dest, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-bold text-lg">{dest.name}</h3>
                  <p className="text-sm text-gray-200 mt-1 line-clamp-2">{dest.desc}</p>
                  <p className="text-xs text-gold-400 mt-2 font-medium">Explore More →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PACKAGES / COMING SOON ═══ */}
      <section className="section-padding bg-gray-50" id="packages">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">{country.shortName} Packages</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">
              {packages.length > 0 ? `${country.shortName} Travel Packages` : `${country.shortName} Packages`}
            </h2>
            <p className="text-navy-500 mt-3">
              {packages.length > 0 ? `${packages.length} package${packages.length !== 1 ? 's' : ''} available` : `Curated ${country.shortName} travel experiences — coming soon!`}
            </p>
          </div>

          {packages.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input type="text" placeholder={`Search ${country.shortName} packages...`} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-56" />
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <PackageCard key={p.id || p.slug} pkg={p} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Search size={40} className="mx-auto text-navy-300 mb-3" />
                  <p className="text-navy-600 font-medium">No packages match your search</p>
                  <button onClick={() => setSearch('')} className="text-sky-600 hover:text-sky-700 text-sm font-medium mt-2">Clear Search</button>
                </div>
              )}
            </>
          ) : (
            <ComingSoon categoryName={country.shortName} />
          )}
        </div>
      </section>

      {/* ═══ CITIES QUICK LINKS ═══ */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Popular Cities</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Top Cities in {country.shortName}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {country.cities.map((city, i) => (
              <Link key={i} to={`/packages?destination=${encodeURIComponent(city)}`} className="group bg-gradient-to-br from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 rounded-xl p-4 text-center border border-sky-100 hover:border-sky-300 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-sky-100 group-hover:bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <MapPin size={20} className="text-sky-600" />
                </div>
                <h3 className="font-semibold text-navy-800 text-sm">{city}</h3>
                <p className="text-xs text-navy-400 mt-1">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMAGE GALLERY ═══ */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Photo Gallery</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">{country.shortName} in Pictures</h2>
            <p className="text-navy-500 mt-3">A visual journey through {country.shortName}'s most breathtaking destinations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {country.gallery.map((img, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} className="group relative rounded-xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-sky-500">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{img.alt}</p>
                  <p className="text-gray-300 text-xs">{img.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      {galleryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}>
          <button onClick={() => setGalleryIndex(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + country.gallery.length) % country.gallery.length) }} className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"><ChevronLeft size={40} /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={country.gallery[galleryIndex].url} alt={country.gallery[galleryIndex].alt} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-4">
              <p className="text-white text-lg font-semibold">{country.gallery[galleryIndex].alt}</p>
              <p className="text-gray-400 text-sm">{country.gallery[galleryIndex].location}</p>
              <p className="text-gray-500 text-xs mt-1">{galleryIndex + 1} / {country.gallery.length}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % country.gallery.length) }} className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"><ChevronRight size={40} /></button>
        </div>
      )}

      {/* ═══ TRUST STATS ═══ */}
      <section className="bg-gradient-to-r from-navy-900 to-sky-900 py-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-3xl font-bold">{country.stats.destinations}</div>
              <div className="text-sm text-gray-300 mt-1">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{country.stats.packages}</div>
              <div className="text-sm text-gray-300 mt-1">Packages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{country.stats.travelers}</div>
              <div className="text-sm text-gray-300 mt-1">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{country.stats.rating} ★</div>
              <div className="text-sm text-gray-300 mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="section-padding bg-gradient-to-br from-indigo-900 to-sky-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-300 font-semibold text-sm uppercase tracking-wider">Why MAQLAIM TOURS</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Choose Us for {country.shortName} Travel?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✈️', title: 'Visa Assistance', desc: `Complete visa support for ${country.shortName} — documentation and tracking` },
              { icon: '🏨', title: 'Premium Hotels', desc: 'Handpicked 4-star and 5-star accommodations at best rates' },
              { icon: '🌍', title: 'Expert Guides', desc: `Local and experienced guides for ${country.shortName} tours` },
              { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock assistance during your international trip' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / ENQUIRY ═══ */}
      <section className="section-padding bg-white" id="contact">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your {country.shortName} Trip</h2>
              <p className="text-navy-500 mb-8">Ready to explore {country.shortName}? Our travel experts will craft a perfect itinerary with visa support, flights, hotels, and experiences.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 98765 43210</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">hello@travelvista.com</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><MapPin size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Visit Us</p><p className="font-semibold text-navy-900">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Send Us an Enquiry</h3>
              <form onSubmit={e => { e.preventDefault(); alert(`Thank you! Our ${country.shortName} travel expert will contact you shortly.`) }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="email" placeholder="Email Address *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone Number *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="text" placeholder="Preferred Destination" defaultValue={country.shortName} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Number of Travelers</option>
                    <option>1 Person</option><option>2 People</option><option>3-5 People</option>
                    <option>6-10 People</option><option>10+ People</option>
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
