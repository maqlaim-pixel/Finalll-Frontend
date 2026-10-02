import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Shield, Heart, Star, Clock, Phone, Mail, MapPin, ChevronRight, ChevronLeft, Users, Camera, Tag, Plane, Hotel, UtensilsCrossed, Eye, Search } from 'lucide-react';
import PackageCard from '../../components/common/PackageCard';
import ComingSoon from '../../components/common/ComingSoon';
import api from '../../services/api';

const CATEGORIES = {
  'family-getaways': {
    title: 'Family Getaways',
    subtitle: 'Create Lifelong Memories Together',
    heroImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80',
    description: 'Discover amazing destinations perfect for the whole family. From beach resorts to mountain retreats, find the perfect getaway that everyone will love.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Carefully selected destinations and activities perfect for all age groups.' },
      { icon: Shield, title: 'Safe & Secure', desc: "Your family's safety is our priority at every step of your journey." },
      { icon: Tag, title: 'Best Price Guarantee', desc: 'Get the best value for your money with exclusive deals & offers.' },
      { icon: Clock, title: '24x7 Support', desc: 'We are here for you anytime, anywhere on your trip.' },
      { icon: Star, title: 'Memorable Experiences', desc: 'Create unforgettable memories with unique family experiences.' },
      { icon: Heart, title: 'Comfort & Convenience', desc: 'Handpicked stays, smooth transfers and hassle-free itineraries.' },
    ],
    tags: ['Beach', 'Mountain', 'Adventure', 'Culture', 'Wildlife', 'Pilgrimage', 'Luxury', 'Budget', 'Road Trip', 'Nature'],
  },
  'family-beach': {
    title: 'Family Beach Holidays',
    subtitle: 'Sun, Sand & Family Fun',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    description: 'Enjoy sun-kissed beaches with your family. Crystal clear waters, soft sand, and exciting water activities for all ages.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Beach resorts with kids clubs and family activities.' },
      { icon: Shield, title: 'Safe Beaches', desc: 'Curated beaches with lifeguards and safe swimming zones.' },
      { icon: Tag, title: 'Best Price', desc: 'Exclusive beach holiday packages at unbeatable prices.' },
      { icon: Clock, title: '24x7 Support', desc: 'Round-the-clock assistance during your beach vacation.' },
      { icon: Star, title: 'Water Activities', desc: 'Snorkeling, kayaking, and more for the whole family.' },
      { icon: Heart, title: 'Beach Resorts', desc: 'Handpicked beachfront resorts with modern amenities.' },
    ],
    tags: ['Goa', 'Kerala', 'Maldives', 'Sri Lanka', 'Andaman', 'Bali', 'Phuket', 'Hua Hin', 'Alibaug', 'Pondicherry'],
  },
  'family-hill': {
    title: 'Family Hill Holidays',
    subtitle: 'Mountain Adventures Await',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Escape to the cool hills with your family. Enjoy breathtaking views, pine forests, and mountain adventures.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Hill stations with activities for all ages.' },
      { icon: Shield, title: 'Safe Treks', desc: 'Guided family-friendly treks and nature walks.' },
      { icon: Tag, title: 'Best Price', desc: 'Affordable hill station packages for families.' },
      { icon: Clock, title: '24x7 Support', desc: 'Help available throughout your mountain getaway.' },
      { icon: Star, title: 'Mountain Resorts', desc: 'Cozy stays with stunning mountain views.' },
      { icon: Heart, title: 'Nature Activities', desc: 'Wildlife spotting, boating, and outdoor fun.' },
    ],
    tags: ['Manali', 'Shimla', 'Munnar', 'Ooty', 'Coorg', 'Lonavala', 'Darjeeling', 'Nainital', 'Mussoorie', 'Kodaikanal'],
  },
  'theme-park': {
    title: 'Theme Park Holidays',
    subtitle: 'Thrills & Excitement for All Ages',
    heroImage: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=1920&q=80',
    description: 'Experience the magic of theme parks with your family. Roller coasters, water parks, and entertainment for everyone.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Parks with rides for toddlers to thrill-seekers.' },
      { icon: Shield, title: 'Safe Rides', desc: 'All parks meet international safety standards.' },
      { icon: Tag, title: 'Best Price', desc: 'Combo tickets and hotel + park packages.' },
      { icon: Clock, title: '24x7 Support', desc: 'Assistance with bookings and park information.' },
      { icon: Star, title: 'VIP Access', desc: 'Skip-the-line passes and exclusive experiences.' },
      { icon: Heart, title: 'Multi-Day Passes', desc: 'Flexible passes for extended fun.' },
    ],
    tags: ['Disneyland', 'Universal Studios', 'Adventure Island', 'Wonderla', 'Imagicaa', 'EsselWorld', 'Water Kingdom', 'Nicco Park', 'Science City', 'Ramoji Film City'],
  },
  'wildlife-holidays': {
    title: 'Wildlife Holidays',
    subtitle: 'Encounter Nature Up Close',
    heroImage: 'https://images.unsplash.com/photo-1535338454528-1b5f51097792?w=1920&q=80',
    description: 'Explore the wilderness with your family. Safari adventures, wildlife sanctuaries, and nature camps.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Kid-safe safari vehicles and family lodges.' },
      { icon: Shield, title: 'Expert Guides', desc: 'Trained naturalists for safe wildlife encounters.' },
      { icon: Tag, title: 'Best Price', desc: 'Safari packages with accommodation included.' },
      { icon: Clock, title: '24x7 Support', desc: 'On-ground support during your safari.' },
      { icon: Star, title: 'Premium Lodges', desc: 'Stay inside national parks and reserves.' },
      { icon: Heart, title: 'Photography Tours', desc: 'Special wildlife photography packages.' },
    ],
    tags: ['Jim Corbett', 'Ranthambore', 'Bandhavgarh', 'Kaziranga', 'Sundarbans', 'Periyar', 'Pench', 'Tadoba', 'Satpura', 'Gir'],
  },
  'road-trip': {
    title: 'Road Trip Holidays',
    subtitle: 'Hit the Road with Family',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Plan the perfect family road trip. Scenic routes, adventure stops, and unforgettable experiences along the way.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Routes planned with family rest stops.' },
      { icon: Shield, title: 'Safe Drives', desc: 'Well-maintained routes and backup support.' },
      { icon: Tag, title: 'Best Price', desc: 'Self-drive and chauffeur packages available.' },
      { icon: Clock, title: '24x7 Support', desc: 'Roadside assistance throughout the trip.' },
      { icon: Star, title: 'Custom Routes', desc: 'Personalized itineraries for your family.' },
      { icon: Heart, title: 'Scenic Stops', desc: 'Curated photo spots and dining places.' },
    ],
    tags: ['Ladakh', 'Spiti Valley', 'Goa', 'Rajasthan', 'Coorg', 'Hampi', 'Meghalaya', 'Kerala', 'Mahabaleshwar', 'Munnar'],
  },
  'budget-family': {
    title: 'Budget Family Holidays',
    subtitle: 'Amazing Holidays, Smart Prices',
    heroImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    description: 'Enjoy incredible family vacations without breaking the bank. Affordable packages with great experiences.',
    features: [
      { icon: Users, title: 'Family Friendly', desc: 'Budget stays that are comfortable and clean.' },
      { icon: Shield, title: 'Safe & Quality', desc: 'Quality assured even on budget packages.' },
      { icon: Tag, title: 'Best Price', desc: 'Lowest prices guaranteed with no hidden costs.' },
      { icon: Clock, title: '24x7 Support', desc: 'Full support even on budget trips.' },
      { icon: Star, title: 'Value Packages', desc: 'Maximum experience at minimum cost.' },
      { icon: Heart, title: 'Flexible Payment', desc: 'EMI options and easy cancellation policies.' },
    ],
    tags: ['Goa', 'Ooty', 'Manali', 'Darjeeling', 'Pondicherry', 'Kodaikanal', 'Rishikesh', 'Udaipur', 'Jaipur', 'Shimla'],
  },
  // Honeymoon
  'honeymoon-getaways': {
    title: 'Honeymoon Getaways',
    subtitle: 'Begin Your Forever Journey',
    heroImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=80',
    description: 'Start your married life with unforgettable romantic getaways. From beach paradises to mountain retreats.',
    features: [
      { icon: Heart, title: 'Romantic Stays', desc: 'Handpicked romantic resorts and villas.' },
      { icon: Star, title: 'Special Touches', desc: 'Candlelight dinners, flower decorations, and more.' },
      { icon: Shield, title: 'Private & Exclusive', desc: 'Secluded stays for complete privacy.' },
      { icon: Clock, title: '24x7 Support', desc: 'Dedicated honeymoon coordinator.' },
      { icon: Users, title: 'Custom Itineraries', desc: 'Personalized plans for every couple.' },
      { icon: Tag, title: 'Best Price', desc: 'Special honeymoon packages with extras.' },
    ],
    tags: ['Maldives', 'Bali', 'Santorini', 'Paris', 'Switzerland', 'Kerala', 'Goa', 'Andaman', 'Mauritius', 'Sri Lanka'],
  },
  'honeymoon-beach': {
    title: 'Beach Honeymoon',
    subtitle: 'Romance by the Sea',
    heroImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=1920&q=80',
    description: 'Walk hand in hand on pristine beaches. Crystal waters, sunset views, and luxury beach resorts.',
    features: [
      { icon: Heart, title: 'Beachfront Romance', desc: 'Overwater villas and beachside cottages.' },
      { icon: Star, title: 'Sunset Dinners', desc: 'Private beach dining under the stars.' },
      { icon: Shield, title: 'Exclusive Resorts', desc: 'Adults-only premium beach resorts.' },
      { icon: Clock, title: 'Spa & Wellness', desc: 'Couples spa treatments and relaxation.' },
      { icon: Users, title: 'Water Activities', desc: 'Snorkeling, diving, and boat rides together.' },
      { icon: Tag, title: 'Best Value', desc: 'Honeymoon packages with complimentary extras.' },
    ],
    tags: ['Maldives', 'Bali', 'Phuket', 'Goa', 'Andaman', 'Sri Lanka', 'Fiji', 'Seychelles', 'Santorini', 'Hua Hin'],
  },
  'honeymoon-mountain': {
    title: 'Mountain Honeymoon',
    subtitle: 'Romance in the Misty Mountains',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Cozy up in the mountains with your beloved. Misty views, bonfires, and intimate moments.',
    features: [
      { icon: Heart, title: 'Mountain Views', desc: 'Rooms with stunning valley and mountain views.' },
      { icon: Star, title: 'Cozy Stays', desc: 'Boutique hotels and mountain cabins.' },
      { icon: Shield, title: 'Private Retreats', desc: 'Secluded properties away from crowds.' },
      { icon: Clock, title: 'Adventure for Two', desc: 'Trekking, camping, and nature walks.' },
      { icon: Users, title: 'Bonfire Evenings', desc: 'Private bonfire and stargazing sessions.' },
      { icon: Tag, title: 'Best Price', desc: 'Mountain honeymoon packages starting ₹25,000.' },
    ],
    tags: ['Manali', 'Shimla', 'Munnar', 'Coorg', 'Darjeeling', 'Lonavala', 'Chail', 'Kasauli', 'Nainital', 'Mussoorie'],
  },
  'romantic-getaways': {
    title: 'Romantic Getaways',
    subtitle: 'Love is in the Air',
    heroImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1920&q=80',
    description: 'Escape with your special someone to the most romantic destinations. Intimate stays, candlelight dinners, and unforgettable moments.',
    features: [
      { icon: Heart, title: 'Romantic Stays', desc: 'Handpicked intimate resorts and boutique hotels.' },
      { icon: Star, title: 'Candlelight Dinners', desc: 'Private dining under the stars or by the beach.' },
      { icon: Shield, title: 'Complete Privacy', desc: 'Secluded villas and suites for couples only.' },
      { icon: Clock, title: 'Flexible Duration', desc: '2-night to 10-night romantic packages.' },
      { icon: Users, title: 'Couple Activities', desc: 'Spa, cooking classes, and sunset cruises.' },
      { icon: Tag, title: 'Best Price', desc: 'Romantic packages starting ₹15,000/couple.' },
    ],
    tags: ['Maldives', 'Bali', 'Paris', 'Santorini', 'Kerala', 'Goa', 'Udaipur', 'Andaman', 'Mauritius', 'Switzerland'],
  },
  'beach-honeymoons': {
    title: 'Beach Honeymoons',
    subtitle: 'Where Waves Whisper Love',
    heroImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=1920&q=80',
    description: 'Wiggle your toes in warm sand together. Beachfront luxury, water sports, and sun-kissed romance.',
    features: [
      { icon: Heart, title: 'Beachfront Villas', desc: 'Wake up to ocean views every morning.' },
      { icon: Star, title: 'Water Activities', desc: 'Snorkeling, jet ski, and sunset boat rides.' },
      { icon: Shield, title: 'Couples Spa', desc: 'Beachside massage and wellness treatments.' },
      { icon: Clock, title: 'Island Hopping', desc: 'Explore multiple islands together.' },
      { icon: Users, title: 'Private Beach', desc: 'Exclusive beach access at premium resorts.' },
      { icon: Tag, title: 'Best Price', desc: 'Beach honeymoon packages from ₹35,000.' },
    ],
    tags: ['Maldives', 'Bali', 'Phuket', 'Goa', 'Andaman', 'Sri Lanka', 'Fiji', 'Seychelles', 'Hua Hin', 'Koh Samui'],
  },
  'hill-station-honeymoons': {
    title: 'Hill Station Honeymoons',
    subtitle: 'Misty Mountains, Warm Hearts',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Cozy up in charming hill stations. Pine-scented air, misty mornings, and crackling fireplaces.',
    features: [
      { icon: Heart, title: 'Mountain Cottages', desc: 'Charming stays with valley views.' },
      { icon: Star, title: 'Nature Walks', desc: 'Hand-in-hand walks through tea gardens.' },
      { icon: Shield, title: 'Bonfire Nights', desc: 'Private bonfire with hot chocolate.' },
      { icon: Clock, title: 'Sightseeing Tours', desc: 'Guided tours of scenic viewpoints.' },
      { icon: Users, title: 'Adventure Activities', desc: 'Zip-lining, paragliding for couples.' },
      { icon: Tag, title: 'Best Price', desc: 'Hill station honeymoons from ₹20,000.' },
    ],
    tags: ['Manali', 'Shimla', 'Munnar', 'Coorg', 'Ooty', 'Lonavala', 'Darjeeling', 'Kodaikanal', 'Nainital', 'Chail'],
  },
  'luxury-honeymoons': {
    title: 'Luxury Honeymoons',
    subtitle: 'Indulge in Opulence Together',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    description: 'Experience the finest luxury on your honeymoon. Five-star resorts, private pools, and world-class service.',
    features: [
      { icon: Star, title: '5-Star Resorts', desc: 'World-renowned luxury properties.' },
      { icon: Heart, title: 'Private Pool Villas', desc: 'Your own infinity pool with a view.' },
      { icon: Shield, title: 'Butler Service', desc: 'Personal butler for every need.' },
      { icon: Clock, title: 'Fine Dining', desc: 'Michelin-star restaurant experiences.' },
      { icon: Users, title: 'Private Transfers', desc: 'Luxury car and helicopter transfers.' },
      { icon: Tag, title: 'Exclusive Access', desc: 'VIP access to exclusive experiences.' },
    ],
    tags: ['Maldives', 'Santorini', 'Dubai', 'Switzerland', 'Paris', 'Bali', 'Mauritius', 'Seychelles', 'Amalfi', 'Tuscany'],
  },
  'international-honeymoons': {
    title: 'International Honeymoons',
    subtitle: 'Love Without Borders',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Explore exotic international destinations together. From tropical islands to European cities.',
    features: [
      { icon: Heart, title: 'Visa Assistance', desc: 'Complete visa support for all countries.' },
      { icon: Star, title: 'International Hotels', desc: 'Curated stays at top international resorts.' },
      { icon: Shield, title: 'Travel Insurance', desc: 'Comprehensive coverage included.' },
      { icon: Clock, title: 'Custom Itineraries', desc: 'Tailored plans for your dream trip.' },
      { icon: Users, title: 'Airport Transfers', desc: 'Hassle-free transfers at destination.' },
      { icon: Tag, title: 'Best Price', desc: 'International honeymoon packages from ₹80,000.' },
    ],
    tags: ['Maldives', 'Bali', 'Santorini', 'Paris', 'Switzerland', 'Dubai', 'Thailand', 'Vietnam', 'Japan', 'New Zealand'],
  },
  'adventure-honeymoons': {
    title: 'Adventure Honeymoons',
    subtitle: 'Thrill Together, Love Together',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'For couples who love adrenaline. Trekking, diving, safari, and exciting adventures as a duo.',
    features: [
      { icon: Users, title: 'Couples Adventures', desc: 'Activities designed for two.' },
      { icon: Shield, title: 'Safety Certified', desc: 'International safety standards.' },
      { icon: Tag, title: 'Best Price', desc: 'Adventure honeymoon packages from ₹40,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: '3-day to 14-day adventure trips.' },
      { icon: Star, title: 'Expert Guides', desc: 'Certified adventure instructors.' },
      { icon: Heart, title: 'Unique Experiences', desc: 'Memorable adventures for couples.' },
    ],
    tags: ['Rishikesh', 'Ladakh', 'Andaman', 'Costa Rica', 'New Zealand', 'Iceland', 'Peru', 'Nepal', 'Bali', 'Thailand'],
  },
  'budget-honeymoons': {
    title: 'Budget Honeymoons',
    subtitle: 'Affordable Romance, Priceless Memories',
    heroImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    description: "Beautiful honeymoons don't have to cost a fortune. Smart planning, great stays, and magical moments.",
    features: [
      { icon: Heart, title: 'Value Stays', desc: 'Comfortable and romantic budget stays.' },
      { icon: Star, title: 'Smart Itineraries', desc: 'Maximum romance at minimum cost.' },
      { icon: Shield, title: 'No Hidden Costs', desc: 'Transparent pricing, everything included.' },
      { icon: Clock, title: 'Flexible Payment', desc: 'EMI options and easy cancellations.' },
      { icon: Users, title: 'Couple Deals', desc: 'Special couple-only discounts.' },
      { icon: Tag, title: 'Best Price', desc: 'Budget honeymoons starting ₹12,000/couple.' },
    ],
    tags: ['Goa', 'Ooty', 'Coorg', 'Pondicherry', 'Manali', 'Kodaikanal', 'Rishikesh', 'Mahabaleshwar', 'Gokarna', 'Munnar'],
  },
  // Adventure
  'adventure-holidays': {
    title: 'Adventure Holidays',
    subtitle: 'Push Your Limits',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Experience thrilling adventures with expert guides. Trekking, rafting, bungee, and more.',
    features: [
      { icon: Users, title: 'Expert Guides', desc: 'Certified adventure professionals.' },
      { icon: Shield, title: 'Safety First', desc: 'International safety equipment and protocols.' },
      { icon: Tag, title: 'Best Price', desc: 'Adventure packages at competitive prices.' },
      { icon: Clock, title: '24x7 Support', desc: 'On-ground support during adventures.' },
      { icon: Star, title: 'Premium Gear', desc: 'Top-quality equipment provided.' },
      { icon: Heart, title: 'Group Discounts', desc: 'Special rates for group adventures.' },
    ],
    tags: ['Rishikesh', 'Ladakh', 'Spiti', 'Manali', 'Coorg', 'Munnar', 'Andaman', 'Darjeeling', 'Shillong', 'Kodaikanal'],
  },
  'adventure-rafting': {
    title: 'White Water Rafting',
    subtitle: 'Ride the Rapids',
    heroImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80',
    description: 'Feel the rush of white water rafting through exciting rapids. From beginner to expert levels.',
    features: [
      { icon: Users, title: 'All Levels', desc: 'Rapids for beginners to experts.' },
      { icon: Shield, title: 'Certified Guides', desc: 'Trained rafting instructors.' },
      { icon: Tag, title: 'Best Price', desc: 'Rafting packages from ₹1,500/person.' },
      { icon: Clock, title: 'Flexible Timing', desc: 'Morning and afternoon slots available.' },
      { icon: Star, title: 'Premium Equipment', desc: 'All safety gear included.' },
      { icon: Heart, title: 'Group Booking', desc: 'Special rates for teams and families.' },
    ],
    tags: ['Rishikesh', 'Kullu', 'Coorg', 'Dandeli', 'Manali', 'Ladakh', 'Arunachal', 'Meghalaya', 'Uttarakhand', 'Karnataka'],
  },
  'adventure-trekking': {
    title: 'Trekking & Hiking',
    subtitle: 'Conquer the Peaks',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Trek through stunning landscapes. From easy day hikes to challenging multi-day expeditions.',
    features: [
      { icon: Users, title: 'All Levels', desc: 'Easy, moderate, and difficult treks.' },
      { icon: Shield, title: 'Safety Equipment', desc: 'Full gear and first-aid provided.' },
      { icon: Tag, title: 'Best Price', desc: 'Trekking packages starting ₹5,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: '1-day to 15-day treks available.' },
      { icon: Star, title: 'Expert Leaders', desc: 'Experienced trek leaders on every trip.' },
      { icon: Heart, title: 'Camp Nights', desc: 'Stunning campsites under the stars.' },
    ],
    tags: ['Hampta Pass', 'Valley of Flowers', 'Chadar', 'Kedarkantha', 'Roopkund', 'Sandakphu', 'Great Lakes', 'Tirumala', 'Narasimha', 'Kumara Parvatha'],
  },
  'adventure-camping': {
    title: 'Camping Adventures',
    subtitle: 'Under the Stars',
    heroImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80',
    description: 'Experience the great outdoors with premium camping. Luxury tents, bonfires, and nature.',
    features: [
      { icon: Users, title: 'Family & Group', desc: 'Camping for all group sizes.' },
      { icon: Shield, title: 'Safe Locations', desc: 'Curated safe camping spots.' },
      { icon: Tag, title: 'Best Price', desc: 'Glamping from ₹3,000/person/night.' },
      { icon: Clock, title: 'Weekend Getaways', desc: '2N/3D weekend camping packages.' },
      { icon: Star, title: 'Premium Tents', desc: 'Swiss tents with all amenities.' },
      { icon: Heart, title: 'Activities Included', desc: 'Bonfire, hiking, and stargazing.' },
    ],
    tags: ['Rishikesh', 'Lonavala', 'Coorg', 'Kodaikanal', 'Munnar', 'Shillong', 'Kasol', 'Tirthan Valley', 'Chopta', 'Binsar'],
  },
  'adventure-safari': {
    title: 'Wildlife Safari',
    subtitle: 'Into the Wild',
    heroImage: 'https://images.unsplash.com/photo-1535338454528-1b5f51097792?w=1920&q=80',
    description: 'Go on thrilling wildlife safaris. Spot tigers, elephants, and exotic birds in their natural habitat.',
    features: [
      { icon: Users, title: 'Family Safari', desc: 'Kid-friendly jeep and bus safaris.' },
      { icon: Shield, title: 'Expert Naturalists', desc: 'Trained guides for every safari.' },
      { icon: Tag, title: 'Best Price', desc: 'Safari + stay packages from ₹15,000.' },
      { icon: Clock, title: 'Morning & Evening', desc: 'Both dawn and dusk safari slots.' },
      { icon: Star, title: 'Premium Lodges', desc: 'Stay inside national parks.' },
      { icon: Heart, title: 'Photography Tours', desc: 'Special wildlife photography packages.' },
    ],
    tags: ['Ranthambore', 'Jim Corbett', 'Bandhavgarh', 'Kaziranga', 'Sundarbans', 'Pench', 'Tadoba', 'Gir', 'Periyar', 'Satpura'],
  },
  'trekking-holidays': {
    title: 'Trekking Holidays',
    subtitle: 'Conquer New Heights Together',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Trek through breathtaking landscapes. From easy walks to challenging expeditions, find your perfect trail.',
    features: [
      { icon: Users, title: 'All Levels', desc: 'Easy, moderate, and difficult treks.' },
      { icon: Shield, title: 'Expert Leaders', desc: 'Certified trek leaders on every trip.' },
      { icon: Tag, title: 'Best Price', desc: 'Trekking packages from ₹5,000/person.' },
      { icon: Clock, title: 'Flexible Duration', desc: 'Day treks to 15-day expeditions.' },
      { icon: Star, title: 'Premium Gear', desc: 'All equipment provided.' },
      { icon: Heart, title: 'Camp Nights', desc: 'Stunning campsites under the stars.' },
    ],
    tags: ['Hampta Pass', 'Valley of Flowers', 'Chadar', 'Kedarkantha', 'Roopkund', 'Sandakphu', 'Great Lakes', 'Brahmatal', 'Har Ki Dun', 'Kuari Pass'],
  },
  'camping-holidays': {
    title: 'Camping Holidays',
    subtitle: 'Sleep Under the Stars',
    heroImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80',
    description: 'Experience the magic of outdoor camping. Luxury tents, bonfires, and pure nature immersion.',
    features: [
      { icon: Users, title: 'Group & Family', desc: 'Camping for all group sizes.' },
      { icon: Shield, title: 'Safe Locations', desc: 'Curated safe camping spots.' },
      { icon: Tag, title: 'Best Price', desc: 'Glamping from ₹3,000/person/night.' },
      { icon: Clock, title: 'Weekend Packages', desc: '2N/3D weekend camping trips.' },
      { icon: Star, title: 'Premium Tents', desc: 'Swiss tents with all amenities.' },
      { icon: Heart, title: 'Activities Included', desc: 'Bonfire, hiking, stargazing, and more.' },
    ],
    tags: ['Rishikesh', 'Lonavala', 'Coorg', 'Kodaikanal', 'Munnar', 'Shillong', 'Kasol', 'Tirthan Valley', 'Chopta', 'Binsar'],
  },
  'wildlife-adventures': {
    title: 'Wildlife Adventures',
    subtitle: 'Encounter the Wild',
    heroImage: 'https://images.unsplash.com/photo-1535338454528-1b5f51097792?w=1920&q=80',
    description: 'Get up close with wildlife on thrilling safari adventures. Spot tigers, elephants, and exotic birds.',
    features: [
      { icon: Users, title: 'Safari Rides', desc: 'Jeep and canter safaris available.' },
      { icon: Shield, title: 'Expert Naturalists', desc: 'Trained guides for every encounter.' },
      { icon: Tag, title: 'Best Price', desc: 'Wildlife packages from ₹12,000.' },
      { icon: Clock, title: 'Dawn & Dusk Slots', desc: 'Best timing for wildlife sighting.' },
      { icon: Star, title: 'Forest Lodges', desc: 'Stay inside national parks.' },
      { icon: Heart, title: 'Photography Tours', desc: 'Special wildlife photography packages.' },
    ],
    tags: ['Ranthambore', 'Jim Corbett', 'Bandhavgarh', 'Kaziranga', 'Sundarbans', 'Pench', 'Tadoba', 'Gir', 'Periyar', 'Satpura'],
  },
  'water-adventure': {
    title: 'Water Adventure',
    subtitle: 'Ride the Rapids & Waves',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    description: 'Feel the rush of water adventures. Rafting, kayaking, scuba diving, and more aquatic thrills.',
    features: [
      { icon: Users, title: 'All Skill Levels', desc: 'From beginner to expert rapids.' },
      { icon: Shield, title: 'Safety Certified', desc: 'International safety equipment.' },
      { icon: Tag, title: 'Best Price', desc: 'Water adventures from ₹1,500/person.' },
      { icon: Clock, title: 'Flexible Timing', desc: 'Morning and afternoon slots.' },
      { icon: Star, title: 'Premium Equipment', desc: 'All gear provided and maintained.' },
      { icon: Heart, title: 'Group Booking', desc: 'Special team and family rates.' },
    ],
    tags: ['Rishikesh', 'Kullu', 'Goa', 'Andaman', 'Dandeli', 'Coorg', 'Manali', 'Ladakh', 'Meghalaya', 'Valley of Flowers'],
  },
  'mountain-adventures': {
    title: 'Mountain Adventures',
    subtitle: 'Peak Thrills Await',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Conquer mountains with exciting adventures. Rock climbing, paragliding, rappelling, and more.',
    features: [
      { icon: Users, title: 'All Levels', desc: 'Beginner-friendly to extreme.' },
      { icon: Shield, title: 'Certified Guides', desc: 'Professional mountain instructors.' },
      { icon: Tag, title: 'Best Price', desc: 'Mountain packages from ₹8,000.' },
      { icon: Clock, title: 'Day & Multi-day', desc: 'Flexible adventure durations.' },
      { icon: Star, title: 'Premium Gear', desc: 'Climbing and safety equipment provided.' },
      { icon: Heart, title: 'Scenic Routes', desc: 'Adventures with stunning views.' },
    ],
    tags: ['Manali', 'Rishikesh', 'Lonavala', 'Munnar', 'Coorg', 'Shillong', 'Darjeeling', 'Kodaikanal', 'Ooty', 'Chikmagalur'],
  },
  'desert-adventures': {
    title: 'Desert Adventures',
    subtitle: 'Golden Sands, Endless Thrills',
    heroImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80',
    description: 'Experience the magic of desert adventures. Camel safaris, dune bashing, and starlit camps.',
    features: [
      { icon: Users, title: 'Camel Safaris', desc: 'Traditional desert camel rides.' },
      { icon: Shield, title: 'Desert Camps', desc: 'Safe and comfortable desert stays.' },
      { icon: Tag, title: 'Best Price', desc: 'Desert packages from ₹6,000/person.' },
      { icon: Clock, title: 'Night Safaris', desc: 'Magical under-the-stars experiences.' },
      { icon: Star, title: 'Cultural Shows', desc: 'Folk music, dance, and bonfire.' },
      { icon: Heart, title: 'Dune Bashing', desc: 'Thrilling 4x4 dune drives.' },
    ],
    tags: ['Jaisalmer', 'Jodhpur', 'Bikaner', 'Pushkar', 'Thar Desert', 'Ladakh', 'Nubra Valley', 'Rann of Kutch', 'Osian', 'Sam Sand Dunes'],
  },
  'winter-adventures': {
    title: 'Winter Adventures',
    subtitle: 'Embrace the Chill',
    heroImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80',
    description: 'Conquer the cold with exciting winter adventures. Snow trekking, skiing, ice skating, and more.',
    features: [
      { icon: Users, title: 'Snow Activities', desc: 'Skiing, snowboarding, and sledging.' },
      { icon: Shield, title: 'Winter Gear', desc: 'Complete cold-weather equipment.' },
      { icon: Tag, title: 'Best Price', desc: 'Winter packages from ₹10,000/person.' },
      { icon: Clock, title: 'Dec-Mar Season', desc: 'Peak winter adventure season.' },
      { icon: Star, title: 'Snow Camps', desc: 'Cozy stays in snow-covered landscapes.' },
      { icon: Heart, title: 'Snow Treks', desc: 'Chadar, Kedarkantha, and more.' },
    ],
    tags: ['Manali', 'Shimla', 'Ladakh', 'Gulmarg', 'Auli', 'Kedarkantha', 'Chadar', 'Spiti Valley', 'Rohtang', 'Solang Valley'],
  },
  // Beach
  'beach-holidays': {
    title: 'Beach Holidays',
    subtitle: 'Where Sand Meets Sky',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    description: 'Relax on pristine beaches with crystal clear waters. Sun, sand, and serenity await.',
    features: [
      { icon: Heart, title: 'Beachfront Hotels', desc: 'Stay steps from the sand.' },
      { icon: Shield, title: 'Safe Beaches', desc: 'Curated beaches with lifeguards.' },
      { icon: Tag, title: 'Best Price', desc: 'Beach packages from ₹12,000/person.' },
      { icon: Clock, title: 'Flexible Duration', desc: '2-day to 10-day beach holidays.' },
      { icon: Star, title: 'Water Sports', desc: 'Snorkeling, surfing, and more.' },
      { icon: Users, title: 'Group Discounts', desc: 'Special rates for groups and families.' },
    ],
    tags: ['Goa', 'Kerala', 'Andaman', 'Maldives', 'Bali', 'Sri Lanka', 'Phuket', 'Pondicherry', 'Alibaug', 'Varkala'],
  },
  'beach-romantic': {
    title: 'Romantic Beach Getaways',
    subtitle: 'Love by the Ocean',
    heroImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=1920&q=80',
    description: 'Share romantic moments on beautiful beaches. Sunset walks, candlelight dinners, and luxury stays.',
    features: [
      { icon: Heart, title: 'Couples Special', desc: 'Packages designed for couples.' },
      { icon: Star, title: 'Luxury Resorts', desc: 'Premium beachfront properties.' },
      { icon: Shield, title: 'Privacy Guaranteed', desc: 'Secluded and intimate locations.' },
      { icon: Clock, title: 'Spa Included', desc: 'Couples spa in every package.' },
      { icon: Users, title: 'Special Touches', desc: 'Flowers, cake, and decorations.' },
      { icon: Tag, title: 'Best Price', desc: 'Romantic packages from ₹20,000.' },
    ],
    tags: ['Maldives', 'Bali', 'Goa', 'Santorini', 'Andaman', 'Mauritius', 'Phuket', 'Sri Lanka', 'Kerala', 'Seychelles'],
  },
  'beach-adventure': {
    title: 'Adventure Beach Holidays',
    subtitle: 'Thrills on the Waves',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    description: 'Combine beach relaxation with exciting water sports. Surfing, diving, jet skiing, and more.',
    features: [
      { icon: Users, title: 'Water Sports', desc: 'Surfing, diving, kayaking, and more.' },
      { icon: Shield, title: 'Certified Instructors', desc: 'Professional water sports training.' },
      { icon: Tag, title: 'Best Price', desc: 'Adventure beach packages from ₹18,000.' },
      { icon: Clock, title: 'Full Day Activities', desc: 'Packed itinerary with activities.' },
      { icon: Star, title: 'Premium Equipment', desc: 'All gear provided.' },
      { icon: Heart, title: 'Island Hopping', desc: 'Explore multiple islands.' },
    ],
    tags: ['Andaman', 'Goa', 'Gokarna', 'Maldives', 'Bali', 'Phuket', 'Koh Samui', 'Hikkaduwa', 'Padi', 'Blue Lagoon'],
  },
  'beach-getaways': {
    title: 'Beach Getaways',
    subtitle: 'Unwind by the Shore',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    description: 'Quick and refreshing beach escapes. Sunbathe, swim, and stroll along golden shores.',
    features: [
      { icon: Heart, title: 'Beachfront Stays', desc: 'Hotels right on the beach.' },
      { icon: Shield, title: 'Safe Beaches', desc: 'Curated beaches with lifeguards.' },
      { icon: Tag, title: 'Best Price', desc: 'Getaways starting ₹8,000/person.' },
      { icon: Clock, title: 'Quick Escapes', desc: '2N/3D to 5N/6D packages.' },
      { icon: Star, title: 'Sunset Views', desc: 'Premium sunset-facing rooms.' },
      { icon: Users, title: 'Couple & Family', desc: 'Packages for every traveler.' },
    ],
    tags: ['Goa', 'Gokarna', 'Alibaug', 'Pondicherry', 'Kovalam', 'Varkala', 'Mangalore', 'Kanyakumari', 'Murdeshwar', 'Hampi Beach'],
  },
  'island-holidays': {
    title: 'Island Holidays',
    subtitle: 'Paradise Found',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a3934d?w=1920&q=80',
    description: 'Escape to pristine islands. Crystal waters, coral reefs, and untouched tropical beauty.',
    features: [
      { icon: Heart, title: 'Island Resorts', desc: 'Luxury stays on private islands.' },
      { icon: Shield, title: 'Snorkeling & Diving', desc: 'Explore vibrant underwater worlds.' },
      { icon: Tag, title: 'Best Price', desc: 'Island packages from ₹25,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: '3-day to 10-day island trips.' },
      { icon: Star, title: 'Boat Transfers', desc: 'Speedboat and seaplane options.' },
      { icon: Users, title: 'Honeymoon Special', desc: 'Romantic island escape packages.' },
    ],
    tags: ['Maldives', 'Andaman', 'Lakshadweep', 'Sri Lanka', 'Phuket', 'Koh Samui', 'Bali', 'Seychelles', 'Fiji', 'Mauritius'],
  },
  'tropical-beach-holidays': {
    title: 'Tropical Beach Holidays',
    subtitle: 'Sun, Sand & Palm Trees',
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80',
    description: 'Experience tropical paradise. Warm waters, lush greenery, and exotic beach destinations.',
    features: [
      { icon: Heart, title: 'Tropical Resorts', desc: 'Beachfront properties with pools.' },
      { icon: Shield, title: 'Guided Tours', desc: 'Explore hidden tropical gems.' },
      { icon: Tag, title: 'Best Price', desc: 'Tropical packages from ₹30,000.' },
      { icon: Clock, title: 'Year-Round', desc: 'Tropical weather all year.' },
      { icon: Star, title: 'Spa & Wellness', desc: 'Ayurvedic and tropical spa.' },
      { icon: Users, title: 'Family Friendly', desc: 'Safe for kids and seniors.' },
    ],
    tags: ['Bali', 'Phuket', 'Krabi', 'Hua Hin', 'Langkawi', 'Sri Lanka', 'Maldives', 'Thailand', 'Vietnam', 'Philippines'],
  },
  'luxury-beach-holidays': {
    title: 'Luxury Beach Holidays',
    subtitle: 'Prestige by the Sea',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    description: 'Indulge in beach luxury. Five-star resorts, private villas, and world-class dining by the ocean.',
    features: [
      { icon: Star, title: '5-Star Resorts', desc: 'Top-rated luxury beach properties.' },
      { icon: Heart, title: 'Private Villas', desc: 'Exclusive pool villas on the beach.' },
      { icon: Shield, title: 'Butler Service', desc: 'Personal concierge at your service.' },
      { icon: Tag, title: 'Best Price', desc: 'Luxury beach from ₹60,000/night.' },
      { icon: Clock, title: 'Fine Dining', desc: 'Michelin-star beach restaurants.' },
      { icon: Users, title: 'Exclusive Access', desc: 'Private beach and VIP areas.' },
    ],
    tags: ['Maldives', 'Seychelles', 'Santorini', 'Amalfi Coast', 'Bali', 'Phuket', 'Mauritius', 'Dubai', 'Goa Luxury', 'Sri Lanka'],
  },
  'budget-beach-holidays': {
    title: 'Budget Beach Holidays',
    subtitle: 'Affordable Beach Fun',
    heroImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    description: 'Enjoy the beach without breaking the bank. Comfortable stays and fun activities at great prices.',
    features: [
      { icon: Heart, title: 'Clean Stays', desc: 'Budget-friendly comfortable hotels.' },
      { icon: Shield, title: 'Safe Beaches', desc: 'Curated safe beach destinations.' },
      { icon: Tag, title: 'Best Price', desc: 'Beach holidays from ₹5,000/person.' },
      { icon: Clock, title: 'Flexible Plans', desc: 'Customize your budget trip.' },
      { icon: Star, value: 'Group Discounts', desc: 'Special rates for groups.' },
      { icon: Users, title: 'No Hidden Costs', desc: 'Transparent all-inclusive pricing.' },
    ],
    tags: ['Goa', 'Gokarna', 'Pondicherry', 'Varkala', 'Alibaug', 'Kanyakumari', 'Mangalore', 'Murdeshwar', 'Dapoli', 'Shrivardhan'],
  },
  'water-sports-holidays': {
    title: 'Water Sports Holidays',
    subtitle: 'Ride the Waves',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
    description: 'Get your adrenaline pumping with exciting water sports. Surfing, diving, jet skiing, and more.',
    features: [
      { icon: Users, title: 'All Skill Levels', desc: 'Beginner to expert activities.' },
      { icon: Shield, title: 'Certified Trainers', desc: 'Professional water sports instructors.' },
      { icon: Tag, title: 'Best Price', desc: 'Water sports from ₹1,000/activity.' },
      { icon: Clock, title: 'Full Day Fun', desc: 'Packed activity schedules.' },
      { icon: Star, title: 'Premium Gear', desc: 'All equipment provided and maintained.' },
      { icon: Heart, title: 'Combo Packages', desc: 'Multiple activities at discounted rates.' },
    ],
    tags: ['Goa', 'Andaman', 'Bali', 'Phuket', 'Maldives', 'Gokarna', 'Dapoli', 'Hikkaduwa', 'Koh Samui', 'Krabi'],
  },
  // Spiritual
  'spiritual-holidays': {
    title: 'Spiritual Holidays',
    subtitle: 'Journey of the Soul',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Find inner peace on spiritual journeys. Visit sacred temples, ashrams, and holy places.',
    features: [
      { icon: Heart, title: 'Temple Tours', desc: 'Guided visits to sacred temples.' },
      { icon: Shield, title: 'Trusted Pilgrimages', desc: 'Verified and safe spiritual tours.' },
      { icon: Tag, title: 'Best Price', desc: 'Spiritual packages from ₹8,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: '1-day darshan to 15-day pilgrimages.' },
      { icon: Star, title: 'Expert Guides', desc: 'Spiritual guides and pundits.' },
      { icon: Users, title: 'Group Tours', desc: 'Join organized spiritual groups.' },
    ],
    tags: ['Varanasi', 'Rishikesh', 'Haridwar', 'Tirupati', 'Amritsar', 'Mathura', 'Dwarka', 'Puri', 'Madurai', 'Shirdi'],
  },
  'spiritual-yoga': {
    title: 'Yoga & Meditation Retreats',
    subtitle: 'Find Your Inner Peace',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Rejuvenate your body and soul with authentic yoga and meditation experiences.',
    features: [
      { icon: Heart, title: 'Certified Gurus', desc: 'Learn from world-renowned teachers.' },
      { icon: Shield, title: 'Ashram Stays', desc: 'Authentic ashram accommodation.' },
      { icon: Tag, title: 'Best Price', desc: 'Retreats from ₹5,000/day all-inclusive.' },
      { icon: Clock, title: 'Daily Schedule', desc: 'Structured yoga and meditation.' },
      { icon: Star, title: 'Ayurveda', desc: 'Ayurvedic treatments included.' },
      { icon: Users, title: 'Small Groups', desc: 'Intimate groups for personal attention.' },
    ],
    tags: ['Rishikesh', 'Haridwar', 'Kerala', 'Mysore', 'Dharamshala', 'Pune', 'Goa', 'Udaipur', 'Varanasi', 'Munnar'],
  },
  'spiritual-temple': {
    title: 'Temple Tours',
    subtitle: 'Sacred Journeys',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Visit the most sacred temples across India and beyond. Experience divine blessings.',
    features: [
      { icon: Heart, title: 'VIP Darshan', desc: 'Skip-the-line temple entry.' },
      { icon: Shield, title: 'Pandit Arrangements', desc: 'Pooja and rituals arranged.' },
      { icon: Tag, title: 'Best Price', desc: 'Temple packages from ₹6,000.' },
      { icon: Clock, title: 'Flexible Itinerary', desc: 'Customizable temple circuits.' },
      { icon: Star, title: 'AC Transport', desc: 'Comfortable AC vehicle throughout.' },
      { icon: Users, title: 'Group Tours', desc: 'Daily departure group tours.' },
    ],
    tags: ['Tirupati', 'Varanasi', 'Mathura', 'Amritsar', 'Puri', 'Madurai', 'Rameswaram', 'Dwarka', 'Shirdi', 'Sai Baba'],
  },
  'spiritual-ayurveda': {
    title: 'Ayurveda & Wellness',
    subtitle: 'Heal Your Body, Calm Your Mind',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Traditional Ayurvedic treatments and wellness therapies. Detox, rejuvenate, and heal.',
    features: [
      { icon: Heart, title: 'Ayurvedic Doctors', desc: 'Consultation with qualified doctors.' },
      { icon: Shield, title: 'Authentic Treatments', desc: 'Traditional Panchakarma therapies.' },
      { icon: Tag, title: 'Best Price', desc: '7-day packages from ₹25,000.' },
      { icon: Clock, title: 'Customized Plans', desc: 'Personalized treatment plans.' },
      { icon: Star, title: 'Organic Food', desc: 'Sattvic diet included.' },
      { icon: Users, title: 'Couples Programs', desc: 'Special wellness programs for couples.' },
    ],
    tags: ['Kerala', 'Rishikesh', 'Mysore', 'Udaipur', 'Goa', 'Hampi', 'Coorg', 'Alleppey', 'Kovalam', 'Varkala'],
  },
  'pilgrimage-tours': {
    title: 'Pilgrimage Tours',
    subtitle: 'Sacred Journeys of Faith',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80',
    description: 'Embark on sacred pilgrimages across India and beyond. Visit holy cities, temples, and spiritual centers.',
    features: [
      { icon: Heart, title: 'VIP Darshan', desc: 'Skip-the-line temple entry.' },
      { icon: Shield, title: 'Trusted Tours', desc: 'Verified pilgrimage operators.' },
      { icon: Tag, title: 'Best Price', desc: 'Pilgrimage packages from ₹6,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: '1-day to 15-day pilgrimages.' },
      { icon: Star, title: 'Expert Guides', desc: 'Spiritual guides and pundits.' },
      { icon: Users, title: 'Group Tours', desc: 'Daily departure group tours.' },
    ],
    tags: ['Varanasi', 'Tirupati', 'Haridwar', 'Rishikesh', 'Amritsar', 'Mathura', 'Dwarka', 'Puri', 'Rameswaram', 'Shirdi'],
  },
  'temple-tours': {
    title: 'Temple Tours',
    subtitle: 'Divine Blessings Await',
    heroImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=1920&q=80',
    description: 'Visit the most sacred temples across India. Experience divine architecture, rituals, and spiritual bliss.',
    features: [
      { icon: Heart, title: 'Temple Circuit', desc: 'Multi-temple tour packages.' },
      { icon: Shield, title: 'Pandit Arrangements', desc: 'Pooja and rituals arranged.' },
      { icon: Tag, title: 'Best Price', desc: 'Temple tours from ₹5,000/person.' },
      { icon: Clock, title: 'Day & Multi-day', desc: 'Flexible temple visit durations.' },
      { icon: Star, title: 'AC Transport', desc: 'Comfortable AC vehicle throughout.' },
      { icon: Users, title: 'Family Packages', desc: 'Special family pilgrimage rates.' },
    ],
    tags: ['Tirupati', 'Varanasi', 'Mathura', 'Amritsar', 'Puri', 'Madurai', 'Rameswaram', 'Dwarka', 'Shirdi', 'Sai Baba'],
  },
  'spiritual-retreats': {
    title: 'Spiritual Retreats',
    subtitle: 'Find Your Inner Peace',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Disconnect from the world and reconnect with yourself. Silent retreats, ashram stays, and spiritual immersion.',
    features: [
      { icon: Heart, title: 'Ashram Stays', desc: 'Authentic ashram accommodation.' },
      { icon: Shield, title: 'Silent Retreats', desc: 'Guided silence and meditation.' },
      { icon: Tag, title: 'Best Price', desc: 'Retreats from ₹8,000/week.' },
      { icon: Clock, title: '7 to 21 Days', desc: 'Various retreat durations.' },
      { icon: Star, title: 'Sattvic Diet', desc: 'Pure vegetarian meals included.' },
      { icon: Users, title: 'Personal Guidance', desc: 'One-on-one spiritual mentoring.' },
    ],
    tags: ['Rishikesh', 'Haridwar', 'Dharamshala', 'Varanasi', 'Pondicherry', 'Auroville', 'Kerala', 'Mysore', 'Shirdi', 'Tiruvannamalai'],
  },
  'meditation-holidays': {
    title: 'Meditation Holidays',
    subtitle: 'Silence the Mind, Find Clarity',
    heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80',
    description: 'Learn and practice meditation in serene settings. Vipassana, mindfulness, and transcendental meditation.',
    features: [
      { icon: Heart, title: 'Expert Teachers', desc: 'Learn from master meditators.' },
      { icon: Shield, title: 'Peaceful Settings', desc: 'Quiet locations for deep practice.' },
      { icon: Tag, title: 'Best Price', desc: 'Meditation from ₹3,000/day.' },
      { icon: Clock, title: '3 to 30 Days', desc: 'Flexible meditation programs.' },
      { icon: Star, title: 'All Traditions', desc: 'Vipassana, Zen, Mindfulness, TM.' },
      { icon: Users, title: 'Beginner Friendly', desc: 'Programs for all experience levels.' },
    ],
    tags: ['Dharamshala', 'Rishikesh', 'Pondicherry', 'Auroville', 'Varanasi', 'Tiruvannamalai', 'Mysore', 'Kerala', 'Ladakh', 'Spiti'],
  },
  'yoga-holidays': {
    title: 'Yoga Holidays',
    subtitle: 'Breathe, Stretch, Transform',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80',
    description: 'Deepen your yoga practice in the birthplace of yoga. From Hatha to Ashtanga, find your flow.',
    features: [
      { icon: Heart, title: 'Certified Gurus', desc: 'Learn from world-renowned teachers.' },
      { icon: Shield, title: 'Yoga Ashrams', desc: 'Authentic ashram experiences.' },
      { icon: Tag, title: 'Best Price', desc: 'Yoga from ₹5,000/day all-inclusive.' },
      { icon: Clock, title: 'Daily Schedule', desc: 'Structured yoga and meditation.' },
      { icon: Star, title: 'All Styles', desc: 'Hatha, Ashtanga, Vinyasa, Yin, Kundalini.' },
      { icon: Users, title: 'Small Groups', desc: 'Intimate groups for personal attention.' },
    ],
    tags: ['Rishikesh', 'Haridwar', 'Kerala', 'Mysore', 'Goa', 'Dharamshala', 'Udaipur', 'Varanasi', 'Munnar', 'Coorg'],
  },
  'festival-holidays': {
    title: 'Festival Holidays',
    subtitle: 'Celebrate India\'s Vibrant Culture',
    heroImage: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1920&q=80',
    description: 'Experience India\'s colorful festivals. Holi, Diwali, Navratri, Pushkar Fair, and more cultural celebrations.',
    features: [
      { icon: Heart, title: 'Festival Experiences', desc: 'Immerse in local celebrations.' },
      { icon: Shield, title: 'Safe Travel', desc: 'Curated festival tour packages.' },
      { icon: Tag, title: 'Best Price', desc: 'Festival packages from ₹12,000.' },
      { icon: Clock, title: 'Seasonal Trips', desc: 'Aligned with festival dates.' },
      { icon: Star, title: 'Cultural Immersion', desc: 'Authentic local experiences.' },
      { icon: Users, title: 'Group Tours', desc: 'Join fellow festival travelers.' },
    ],
    tags: ['Holi - Mathura', 'Diwali - Varanasi', 'Navratri - Gujarat', 'Pushkar Fair', 'Onam - Kerala', 'Pongal - Tamil Nadu', 'Dussehra - Mysore', 'Baisakhi - Punjab', 'Christmas - Goa', 'Eid - Delhi'],
  },
  // Luxury
  'luxury-holidays': {
    title: 'Luxury Holidays',
    subtitle: 'Travel in Opulence',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    description: 'Experience the finest in luxury travel. Five-star hotels, private transfers, and exclusive experiences.',
    features: [
      { icon: Star, title: '5-Star Hotels', desc: 'World-class luxury properties.' },
      { icon: Heart, title: 'Private Transfers', desc: 'Luxury vehicles and private jets.' },
      { icon: Shield, title: 'Concierge Service', desc: 'Dedicated luxury travel concierge.' },
      { icon: Tag, title: 'Exclusive Access', desc: 'Private tours and VIP experiences.' },
      { icon: Clock, title: 'Flexible Schedule', desc: 'Your pace, your way.' },
      { icon: Users, title: 'Personal Butler', desc: 'Butler service at top properties.' },
    ],
    tags: ['Maldives', 'Dubai', 'Switzerland', 'Paris', 'Bali', 'Santorini', 'Maui', 'Iceland', 'Aman', 'Four Seasons'],
  },
  'luxury-resorts': {
    title: 'Luxury Resort Escapes',
    subtitle: 'Where Luxury Meets Nature',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    description: 'Unwind at the world\'s finest luxury resorts. Infinity pools, spa treatments, and gourmet dining.',
    features: [
      { icon: Star, title: 'Premium Resorts', desc: 'Top-rated luxury resorts worldwide.' },
      { icon: Heart, title: 'Spa & Wellness', desc: 'Award-winning spa experiences.' },
      { icon: Shield, title: 'Exclusive Villas', desc: 'Private pool villas available.' },
      { icon: Tag, title: 'Best Price', desc: 'Luxury packages from ₹50,000/night.' },
      { icon: Clock, title: 'Flexible Check-in', desc: 'Early check-in and late check-out.' },
      { icon: Users, title: 'Honeymoon Specials', desc: 'Packages for romantic getaways.' },
    ],
    tags: ['Taj', 'Oberoi', 'Leela', 'Aman', 'Four Seasons', 'Ritz Carlton', 'Anantara', 'Six Senses', 'St Regis', 'W Hotel'],
  },
  'luxury-cruise': {
    title: 'Luxury Cruises',
    subtitle: 'Sail in Grandeur',
    heroImage: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&q=80',
    description: 'Set sail on luxury cruise ships. Gourmet dining, entertainment, and exotic ports of call.',
    features: [
      { icon: Star, title: 'Premium Ships', desc: 'World-class cruise liners.' },
      { icon: Heart, title: 'Fine Dining', desc: 'Michelin-star dining onboard.' },
      { icon: Shield, title: 'Safe Sailing', desc: 'International safety standards.' },
      { icon: Tag, title: 'Best Price', desc: 'Cruise packages from ₹60,000.' },
      { icon: Clock, title: 'Multiple Durations', desc: '3-night to 14-night cruises.' },
      { icon: Users, title: 'Family Friendly', desc: 'Kids clubs and family cabins.' },
    ],
    tags: ['Mediterranean', 'Caribbean', 'Norwegian Fjords', 'Alaska', 'Baltic Sea', 'Greek Islands', 'Dubai', 'Singapore', 'Maldives', 'Coastal India'],
  },
  // Weekend
  'weekend-getaways': {
    title: 'Weekend Getaways',
    subtitle: 'Quick Escapes, Big Memories',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Make the most of your weekends. Quick trips to amazing destinations near you.',
    features: [
      { icon: Clock, title: 'Quick Trips', desc: '2N/3D weekend packages.' },
      { icon: Tag, title: 'Best Price', desc: 'Weekend deals from ₹5,000/person.' },
      { icon: Shield, title: 'Easy Booking', desc: 'Last-minute availability.' },
      { icon: Users, title: 'All Groups', desc: 'Solo, couple, family, and group options.' },
      { icon: Star, title: 'Curated Picks', desc: 'Best weekend destinations near you.' },
      { icon: Heart, title: 'Flexible Plans', desc: 'Customize your weekend.' },
    ],
    tags: ['Goa', 'Lonavala', 'Mahabaleshwar', 'Alibaug', 'Pondicherry', 'Udaipur', 'Jaipur', 'Rishikesh', 'Shimla', 'Kodaikanal'],
  },
  'weekend-nature': {
    title: 'Nature Weekends',
    subtitle: 'Reconnect with Nature',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Escape to nature for the weekend. Lush forests, waterfalls, and mountain trails.',
    features: [
      { icon: Heart, title: 'Nature Trails', desc: 'Guided nature walks and treks.' },
      { icon: Shield, title: 'Eco Stays', desc: 'Sustainable and eco-friendly stays.' },
      { icon: Tag, title: 'Best Price', desc: 'Nature weekends from ₹6,000.' },
      { icon: Clock, title: '2N/3D Packages', desc: 'Perfect weekend duration.' },
      { icon: Star, title: 'Wildlife Spotting', desc: 'Bird watching and animal spotting.' },
      { icon: Users, title: 'Group Options', desc: 'Corporate and family group rates.' },
    ],
    tags: ['Coorg', 'Wayanad', 'Munnar', 'Kodaikanal', 'Ooty', 'Chikmagalur', 'Kabini', 'Bandipur', 'Coonoor', 'Nandi Hills'],
  },
  'weekend-city': {
    title: 'City Weekend Breaks',
    subtitle: 'Explore the City Life',
    heroImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
    description: 'Discover exciting city breaks. Museums, nightlife, food tours, and cultural experiences.',
    features: [
      { icon: Star, title: 'City Hotels', desc: 'Central locations, premium hotels.' },
      { icon: Heart, title: 'Food Tours', desc: 'Best culinary experiences.' },
      { icon: Shield, title: 'Easy Transport', desc: 'Metro and cab-friendly cities.' },
      { icon: Tag, title: 'Best Price', desc: 'City packages from ₹4,000.' },
      { icon: Clock, title: '1N/2D to 2N/3D', desc: 'Flexible weekend durations.' },
      { icon: Users, title: 'Solo Friendly', desc: 'Great for solo travelers too.' },
    ],
    tags: ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'],
  },
  // Offbeat
  'offbeat-destinations': {
    title: 'Offbeat Destinations',
    subtitle: 'Beyond the Beaten Path',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Discover hidden gems away from the crowds. Unique experiences in untouched locations.',
    features: [
      { icon: Users, title: 'Small Groups', desc: 'Exclusive small-group tours.' },
      { icon: Shield, title: 'Local Expertise', desc: 'Guided by local experts.' },
      { icon: Tag, title: 'Best Price', desc: 'Offbeat packages from ₹15,000.' },
      { icon: Clock, title: 'Flexible Duration', desc: 'Customizable itineraries.' },
      { icon: Star, title: 'Authentic Stays', desc: 'Homestays and boutique properties.' },
      { icon: Heart, title: 'Sustainable Travel', desc: 'Responsible and eco-friendly.' },
    ],
    tags: ['Spiti Valley', 'Meghalaya', 'Ziro Valley', 'Hampi', 'Chopta', 'Lepchajewar', 'Mechuka', 'Tirthan Valley', 'Chembra Peak', 'Wayanad'],
  },
  'offbeat-northeast': {
    title: 'Northeast India',
    subtitle: 'India\'s Best Kept Secret',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
    description: 'Explore the pristine beauty of Northeast India. Living root bridges, tea gardens, and tribal culture.',
    features: [
      { icon: Heart, title: 'Cultural Immersion', desc: 'Experience tribal cultures and festivals.' },
      { icon: Shield, title: 'Safe Travel', desc: 'Curated safe routes and stays.' },
      { icon: Tag, title: 'Best Price', desc: 'NE packages from ₹20,000.' },
      { icon: Clock, title: '7-15 Days', desc: 'Ideal durations for NE exploration.' },
      { icon: Star, title: 'Offroad Adventures', desc: '4x4 rides to remote villages.' },
      { icon: Users, title: 'Expert Guides', desc: 'Local guides who know the region.' },
    ],
    tags: ['Meghalaya', 'Sikkim', 'Arunachal', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Assam', 'Kaziranga', 'Tawang'],
  },
  'offbeat-hills': {
    title: 'Offbeat Hill Stations',
    subtitle: 'Secret Mountain Retreats',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    description: 'Discover lesser-known hill stations away from the tourist crowds. Serene and untouched.',
    features: [
      { icon: Heart, title: 'Peaceful Stays', desc: 'Quiet properties away from crowds.' },
      { icon: Shield, title: 'Scenic Routes', desc: 'Beautiful drives to hidden hills.' },
      { icon: Tag, title: 'Best Price', desc: 'From ₹8,000 for 2N/3D.' },
      { icon: Clock, title: 'Weekend Friendly', desc: 'Quick 2-3 day trips.' },
      { icon: Star, title: 'Nature Walks', desc: 'Guided walks through forests.' },
      { icon: Users, title: 'Solo & Couple', desc: 'Perfect for quiet getaways.' },
    ],
    tags: ['Chopta', 'Tirthan Valley', 'Binsar', 'Chail', 'Lansdowne', 'Munsiyari', 'Dhanaulti', 'Naukuchiatal', 'Kanatal', 'Ramgarh'],
  },
};

const POPULAR_PACKAGES = {
  'family-getaways': [
    { title: 'Maldives Family Getaway', duration: '4 Nights / 5 Days', price: '₹64,999', tag: 'BEST SELLER', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a3934d?w=400&q=80' },
    { title: 'Switzerland Family Tour', duration: '6 Nights / 7 Days', price: '₹1,49,999', tag: 'FAMILY FAVOURITE', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
    { title: 'Dubai Family Adventure', duration: '4 Nights / 5 Days', price: '₹89,999', tag: 'POPULAR', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
    { title: 'Bali Family Holiday', duration: '5 Nights / 6 Days', price: '₹74,999', tag: 'VALUE PACK', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
    { title: 'Ooty Family Escape', duration: '3 Nights / 4 Days', price: '₹34,999', tag: 'SHORT BREAK', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  ],
  default: [
    { title: 'Weekend Beach Retreat', duration: '2 Nights / 3 Days', price: '₹12,999', tag: 'WEEKEND SPECIAL', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
    { title: 'Mountain Adventure', duration: '3 Nights / 4 Days', price: '₹18,999', tag: 'ADVENTURE', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
    { title: 'Heritage Tour', duration: '4 Nights / 5 Days', price: '₹24,999', tag: 'CULTURAL', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80' },
    { title: 'Wildlife Safari', duration: '3 Nights / 4 Days', price: '₹29,999', tag: 'WILDLIFE', img: 'https://images.unsplash.com/photo-1535338454528-1b5f51097792?w=400&q=80' },
    { title: 'Luxury Spa Retreat', duration: '2 Nights / 3 Days', price: '₹35,999', tag: 'LUXURY', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
  ],
};

const GALLERY_IMAGES = {
  'family-getaways': [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  ],
};

export default function HolidayCategoryPage() {
  const { typeSlug, subSlug } = useParams();
  const slug = subSlug || typeSlug;
  const category = CATEGORIES[slug] || CATEGORIES['family-getaways'];
  const gallery = GALLERY_IMAGES[slug] || GALLERY_IMAGES.default;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTravelers, setSelectedTravelers] = useState('2 Adults, 2 Children');
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', mobile: '', email: '', destination: '', dates: '', travelers: '', message: '' });
  const [apiPackages, setApiPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Fetch packages from API dynamically
  useEffect(() => {
    setLoadingPackages(true);
    api.get('/packages')
      .then(res => {
        const all = res.data || [];
        // Match packages by category title, tags, or destination keywords
        const catLower = category.title.toLowerCase();
        const slugLower = slug.toLowerCase();
        const tags = (category.tags || []).map(t => t.toLowerCase());

        const filtered = all.filter(p => {
          const titleMatch = p.title?.toLowerCase().includes(catLower) || p.title?.toLowerCase().includes(slugLower);
          const tagMatch = p.tags?.toLowerCase().split(',').some(t => tags.includes(t.trim()));
          const destMatch = p.destination?.toLowerCase().includes(catLower) || p.state?.toLowerCase().includes(catLower);
          return titleMatch || tagMatch || destMatch;
        });
        setApiPackages(filtered);
      })
      .catch(() => setApiPackages([]))
      .finally(() => setLoadingPackages(false));
  }, [category, slug]);

  const filteredPackages = useMemo(() => {
    // Use API packages if available, otherwise fall back to hardcoded
    const source = apiPackages.length > 0 ? apiPackages : (POPULAR_PACKAGES[slug] || POPULAR_PACKAGES.default);
    if (apiPackages.length > 0) {
      return source.filter(p => !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Hardcoded fallback
    return source.filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [apiPackages, slug, searchQuery]);

  const scrollPackages = (dir) => {
    const container = document.getElementById('packages-scroll');
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[520px]">
        <img src={category.heroImage} alt={category.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/holidays" className="hover:text-white">Holidays</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{category.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Holidays Made <span className="text-yellow-400">Better Together</span>
          </h1>
          <p className="text-xl text-white/90 italic mb-2">{category.subtitle}</p>
          <p className="text-white/80 max-w-xl mb-8">{category.description}</p>
          <div className="flex gap-8 mb-8">
            {category.features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <f.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Search Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 border-r pr-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Where do you want to go?</div>
                <input type="text" placeholder="Search Destinations" className="text-sm font-medium w-full outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 border-r pr-4">
              <span className="text-gray-400 text-lg">📅</span>
              <div>
                <div className="text-xs text-gray-500">Travel Month</div>
                <select className="text-sm font-medium w-full outline-none bg-transparent" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                  <option value="">Select Month</option>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 border-r pr-4">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Travellers</div>
                <select className="text-sm font-medium w-full outline-none bg-transparent" value={selectedTravelers} onChange={e => setSelectedTravelers(e.target.value)}>
                  <option>2 Adults, 2 Children</option>
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>Family (4+)</option>
                  <option>Group (8+)</option>
                </select>
              </div>
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap transition">
              <span>🔍</span> Find Holidays
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Why Choose {category.title} with Us?</h2>
          <div className="w-16 h-1 bg-yellow-500 mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {category.features.map((f, i) => (
              <div key={i} className="text-center p-4 rounded-xl hover:shadow-lg transition border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Popular {category.title} Packages</h2>
            {apiPackages.length > 0 && (
              <Link to="/packages" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">View All Packages <ChevronRight className="w-4 h-4" /></Link>
            )}
          </div>

          {/* Loading state */}
          {loadingPackages && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-navy-500">Loading packages...</p>
            </div>
          )}

          {/* Packages found — show cards */}
          {!loadingPackages && apiPackages.length > 0 && (
            <div className="relative">
              <div id="packages-scroll" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apiPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </div>
          )}

          {/* No packages — Coming Soon with Contact Us */}
          {!loadingPackages && apiPackages.length === 0 && (
            <ComingSoon categoryName={category.title} />
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Beautiful Memories, Happy Moments</h2>
          <div className="w-16 h-1 bg-yellow-500 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {gallery.slice(0, showAllPhotos ? gallery.length : 5).map((img, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden h-40 group cursor-pointer">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
              </div>
            ))}
          </div>
          {gallery.length > 5 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAllPhotos(!showAllPhotos)} className="border border-gray-300 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 mx-auto">
                <Camera className="w-4 h-4" /> {showAllPhotos ? 'Show Less' : 'View More Photos'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tags */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4">Explore by Interest</h3>
          <div className="flex flex-wrap gap-2">
            {category.tags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Let's Plan Your <span className="text-yellow-400">Perfect Holiday!</span></h2>
              <p className="text-gray-300 mb-8">Our travel experts will help you choose the best destination and customize a holiday that is perfect for you.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-yellow-400" /><span>+91 93137 10465</span></div>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-yellow-400" /><span>info@travelvista.com</span></div>
                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-yellow-400" /><span>24x7 Customer Support</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-gray-800">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input placeholder="Your Name" className="border border-gray-200 rounded-lg px-4 py-3 text-sm" />
                <input placeholder="Mobile Number" className="border border-gray-200 rounded-lg px-4 py-3 text-sm" />
                <input placeholder="Email Address" className="border border-gray-200 rounded-lg px-4 py-3 text-sm" />
                <select className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
                  <option>Select Destination</option>
                  <option>{category.title}</option>
                  {category.tags.slice(0, 6).map((t, i) => <option key={i}>{t}</option>)}
                </select>
                <input type="date" className="border border-gray-200 rounded-lg px-4 py-3 text-sm" />
                <select className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
                  <option>Number of Travellers</option>
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3-5 People</option>
                  <option>6-10 People</option>
                  <option>10+ People</option>
                </select>
              </div>
              <textarea placeholder="Your Message" rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-4 resize-none" />
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition">✈️ Get Free Quote</button>
              <p className="text-center text-xs text-gray-400 mt-2">Our expert will get in touch with you shortly!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
