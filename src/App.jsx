import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Auth
const VerifyOtpPage = lazy(() => import('./pages/auth/VerifyOtpPage'))

// Layouts
import PublicLayout from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/home/HomePage'
const DestinationsPage = lazy(() => import('./pages/destinations/DestinationsPage'))
const DestinationDetail = lazy(() => import('./pages/destinations/DestinationDetail'))
const PackagesPage = lazy(() => import('./pages/packages/PackagesPage'))
const PackageDetail = lazy(() => import('./pages/packages/PackageDetail'))
const TrekkingPackagesPage = lazy(() => import('./pages/adventure/TrekkingPackagesPage'))
const HotelsPage = lazy(() => import('./pages/hotels/HotelsPage'))
const HotelDetail = lazy(() => import('./pages/hotels/HotelDetail'))
const ActivitiesPage = lazy(() => import('./pages/activities/ActivitiesPage'))
const ActivityDetail = lazy(() => import('./pages/activities/ActivityDetail'))
const BlogPage = lazy(() => import('./pages/blog/BlogPage'))
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'))
const TravelTipsPage = lazy(() => import('./pages/TravelTipsPage'))
const BestTimeToVisitPage = lazy(() => import('./pages/BestTimeToVisitPage'))
const TravelCostPage = lazy(() => import('./pages/TravelCostPage'))
const VisaInformationPage = lazy(() => import('./pages/VisaInformationPage'))
const OffersPage = lazy(() => import('./pages/offers/OffersPage'))
const AboutPage = lazy(() => import('./pages/about/AboutPage'))
const ContactPage = lazy(() => import('./pages/contact/ContactPage'))
const PlanTripPage = lazy(() => import('./pages/home/PlanTripPage'))
const MenuLandingPage = lazy(() => import('./pages/menu/MenuLandingPage'))
const IndiaPage = lazy(() => import('./pages/india/IndiaPage'))
const PopularDestinationsPage = lazy(() => import('./pages/india/PopularDestinationsPage'))
const HeritageDestinationsPage = lazy(() => import('./pages/india/HeritageDestinationsPage'))
const ReligiousDestinationsPage = lazy(() => import('./pages/india/ReligiousDestinationsPage'))
const HillStationsPage = lazy(() => import('./pages/india/HillStationsPage'))
const BeachesPage = lazy(() => import('./pages/india/BeachesPage'))
const WildlifeDestinationsPage = lazy(() => import('./pages/india/WildlifeDestinationsPage'))
const NationalParksPage = lazy(() => import('./pages/india/NationalParksPage'))
const WeekendGetawaysPage = lazy(() => import('./pages/india/WeekendGetawaysPage'))
const OffbeatDestinationsPage = lazy(() => import('./pages/india/OffbeatDestinationsPage'))
const FamousDestinationsPage = lazy(() => import('./pages/india/FamousDestinationsPage'))
const AllIndiaDestinationsPage = lazy(() => import('./pages/india/AllIndiaDestinationsPage'))
const IndiaExperiencesPage = lazy(() => import('./pages/india/IndiaExperiencesPage'))
const GirNationalParkPage = lazy(() => import('./pages/india/GirNationalParkPage'))
const RanthamboreNationalParkPage = lazy(() => import('./pages/india/RanthamboreNationalParkPage'))
const BandhavgarhNationalParkPage = lazy(() => import('./pages/india/BandhavgarhNationalParkPage'))
const PenchNationalParkPage = lazy(() => import('./pages/india/PenchNationalParkPage'))
const JimCorbettNationalParkPage = lazy(() => import('./pages/india/JimCorbettNationalParkPage'))
const SundarbansNationalParkPage = lazy(() => import('./pages/india/SundarbansNationalParkPage'))
const KazirangaNationalParkPage = lazy(() => import('./pages/india/KazirangaNationalParkPage'))
const HowToReachPage = lazy(() => import('./pages/india/HowToReachPage'))
const PackingGuidesPage = lazy(() => import('./pages/PackingGuidesPage'))
const InternationalPage = lazy(() => import('./pages/international/InternationalPage'))
const CountryPage = lazy(() => import('./pages/international/CountryPage'))
const InternationalDestPage = lazy(() => import('./pages/international/InternationalDestPage'))
const InternationalPlacesPage = lazy(() => import('./pages/international/InternationalPlacesPage'))
const InternationalActivitiesPage = lazy(() => import('./pages/international/InternationalActivitiesPage'))
const InternationalCitiesPage = lazy(() => import('./pages/international/InternationalCitiesPage'))
const HolidayPage = lazy(() => import('./pages/holiday/HolidayPage'))
const HolidayCategoryPage = lazy(() => import('./pages/holiday/HolidayCategoryPage'))
const DomesticHoneymoonPage = lazy(() => import('./pages/holiday/DomesticHoneymoonPage'))
const InternationalHoneymoonPage = lazy(() => import('./pages/holiday/InternationalHoneymoonPage'))
const BeachHoneymoonPage = lazy(() => import('./pages/holiday/BeachHoneymoonPage'))
const HillStationHoneymoonPage = lazy(() => import('./pages/holiday/HillStationHoneymoonPage'))
const LuxuryHoneymoonPage = lazy(() => import('./pages/holiday/LuxuryHoneymoonPage'))
const AdventureHoneymoonPage = lazy(() => import('./pages/holiday/AdventureHoneymoonPage'))
const BudgetHoneymoonPage = lazy(() => import('./pages/holiday/BudgetHoneymoonPage'))
const HoneymoonPackagesPage = lazy(() => import('./pages/holiday/HoneymoonPackagesPage'))
const MICEPage = lazy(() => import('./pages/mice/MICEPage'))
const MICEDestinationPage = lazy(() => import('./pages/mice/MICEDestinationPage'))
const CorporateTravelPage = lazy(() => import('./pages/mice/CorporateTravelPage'))
const MICESupportPage = lazy(() => import('./pages/mice/MICESupportPage'))
const WeddingPage = lazy(() => import('./pages/wedding/WeddingPage'))
const RajasthanWeddingPage = lazy(() => import('./pages/wedding/RajasthanWeddingPage'))
const GoaWeddingPage = lazy(() => import('./pages/wedding/GoaWeddingPage'))
const UdaipurWeddingPage = lazy(() => import('./pages/wedding/UdaipurWeddingPage'))
const JaipurWeddingPage = lazy(() => import('./pages/wedding/JaipurWeddingPage'))
const JodhpurWeddingPage = lazy(() => import('./pages/wedding/JodhpurWeddingPage'))
const KeralaWeddingPage = lazy(() => import('./pages/wedding/KeralaWeddingPage'))
const MaharashtraWeddingPage = lazy(() => import('./pages/wedding/MaharashtraWeddingPage'))
const HimachalWeddingPage = lazy(() => import('./pages/wedding/HimachalWeddingPage'))
const KashmirWeddingPage = lazy(() => import('./pages/wedding/KashmirWeddingPage'))
const AyodhyaWeddingPage = lazy(() => import('./pages/wedding/AyodhyaWeddingPage'))
const VaranasiWeddingPage = lazy(() => import('./pages/wedding/VaranasiWeddingPage'))
const BaliWeddingPage = lazy(() => import('./pages/wedding/BaliWeddingPage'))
const ThailandWeddingPage = lazy(() => import('./pages/wedding/ThailandWeddingPage'))
const DubaiWeddingPage = lazy(() => import('./pages/wedding/DubaiWeddingPage'))
const MaldivesWeddingPage = lazy(() => import('./pages/wedding/MaldivesWeddingPage'))
const SingaporeWeddingPage = lazy(() => import('./pages/wedding/SingaporeWeddingPage'))
const MedicalTourismPage = lazy(() => import('./pages/medical/MedicalTourismPage'))
const GujaratPage = lazy(() => import('./pages/gujarat/GujaratPage'))
const RajasthanPage = lazy(() => import('./pages/rajasthan/RajasthanPage'))
const MaharashtraPage = lazy(() => import('./pages/maharashtra/MaharashtraPage'))
const GoaPage = lazy(() => import('./pages/goa/GoaPage'))
const KeralaPage = lazy(() => import('./pages/kerala/KeralaPage'))
const TamilNaduPage = lazy(() => import('./pages/tamil-nadu/TamilNaduPage'))
const HimachalPradeshPage = lazy(() => import('./pages/himachal/HimachalPradeshPage'))
const UttarakhandPage = lazy(() => import('./pages/uttarakhand/UttarakhandPage'))
const KarnatakaPage = lazy(() => import('./pages/karnataka/KarnatakaPage'))
const JammuKashmirPage = lazy(() => import('./pages/jammu-kashmir/JammuKashmirPage'))
const UttarPradeshPage = lazy(() => import('./pages/uttar-pradesh/UttarPradeshPage'))
const MadhyaPradeshPage = lazy(() => import('./pages/madhya-pradesh/MadhyaPradeshPage'))
const WestBengalPage = lazy(() => import('./pages/west-bengal/WestBengalPage'))
const AndamanPage = lazy(() => import('./pages/andaman/AndamanPage'))
const NorthEastPage = lazy(() => import('./pages/north-east/NorthEastPage'))
const CityDetail = lazy(() => import('./pages/cities/CityDetail'))
const InternationalCityDetail = lazy(() => import('./pages/cities/InternationalCityDetail'))
const InternationalPackagesPage = lazy(() => import('./pages/international/InternationalPackagesPage'))
const LocalTravelServicePage = lazy(() => import('./pages/LocalTravelServicePage'))
const AirportTransferPage = lazy(() => import('./pages/AirportTransferPage'))
const RailwayStationTransferPage = lazy(() => import('./pages/RailwayStationTransferPage'))
const FullDayCityTourPage = lazy(() => import('./pages/FullDayCityTourPage'))
const HalfDayCityTourPage = lazy(() => import('./pages/HalfDayCityTourPage'))
const OutstationCabPage = lazy(() => import('./pages/OutstationCabPage'))
const CarRentalPage = lazy(() => import('./pages/CarRentalPage'))
const LocalTaxiCabPage = lazy(() => import('./pages/LocalTaxiCabPage'))
const CorporateTransportationPage = lazy(() => import('./pages/CorporateTransportationPage'))
const AllTravelGuidesPage = lazy(() => import('./pages/AllTravelGuidesPage'))
import { ComingSoonPage, NotFoundPage } from './pages/common/ComingSoonPage'
import { isKnownMenuRoute } from './utils/menuRouteIndex'

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))

// Customer Pages — lazy-loaded so they never ship in the public bundle.
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'))
const MyBookings = lazy(() => import('./pages/customer/MyBookings'))
const Wishlist = lazy(() => import('./pages/customer/Wishlist'))
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'))
const CustomerReviews = lazy(() => import('./pages/customer/CustomerReviews'))
const MyEnquiries = lazy(() => import('./pages/customer/MyEnquiries'))
const MyInvoices = lazy(() => import('./pages/customer/MyInvoices'))
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail'))

const AdminInvoices = lazy(() => import('./pages/admin/AdminInvoices'))
const InvoiceForm = lazy(() => import('./pages/admin/InvoiceForm'))

// Admin Pages — lazy-loaded so they never ship in the public bundle.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations'))
const AdminPackages = lazy(() => import('./pages/admin/AdminPackages'))
const AdminHotels = lazy(() => import('./pages/admin/AdminHotels'))
const AdminActivities = lazy(() => import('./pages/admin/AdminActivities'))
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'))
const AdminClientInterests = lazy(() => import('./pages/admin/AdminClientInterests'))
const AdminTravelEnquiries = lazy(() => import('./pages/admin/AdminTravelEnquiries'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))
const AdminApprovalCenter = lazy(() => import('./pages/admin/AdminApprovalCenter'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminPackageForm = lazy(() => import('./pages/admin/packages/AdminPackageForm'))
const AdminDestinationForm = lazy(() => import('./pages/admin/AdminDestinationForm'))
const AdminHotelForm = lazy(() => import('./pages/admin/AdminHotelForm'))
const AdminActivityForm = lazy(() => import('./pages/admin/AdminActivityForm'))
const AdminBlogForm = lazy(() => import('./pages/admin/AdminBlogForm'))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" /></div>
  if (!user) return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />
  if (requireAdmin && !['super_admin', 'admin', 'content_manager', 'editor'].includes(user.role)) return <div className="p-8 text-center"><h1 className="text-2xl font-bold text-red-600">Access Denied</h1><p>You don't have permission.</p></div>
  return children
}

function PublicRouteFallback() {
  const { pathname } = useLocation()
  return isKnownMenuRoute(pathname) ? <ComingSoonPage /> : <NotFoundPage />
}

export default function App() {
  return (
    <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* ── Public Routes ──────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route path="/adventure/trekking-packages" element={<TrekkingPackagesPage />} />
        <Route path="/packages/adventure/trekking" element={<Navigate to="/adventure/trekking-packages" replace />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:slug" element={<HotelDetail />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:slug" element={<ActivityDetail />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/guides/travel-tips" element={<TravelTipsPage />} />
        <Route path="/travel-guide/all-guides" element={<AllTravelGuidesPage />} />
        <Route path="/travel-guide/travel-cost" element={<TravelCostPage />} />
        <Route path="/travel-guide/travel-cost/:destinationSlug" element={<TravelCostPage />} />
        <Route path="/travel-guide/visa-information" element={<VisaInformationPage />} />
        <Route path="/travel-guide/visa-information/:countrySlug" element={<VisaInformationPage />} />
        <Route path="/travel-guide/best-time-to-visit" element={<BestTimeToVisitPage />} />
        <Route path="/travel-guide/best-time-to-visit/:season" element={<BestTimeToVisitPage />} />
        <Route path="/guides/best-time" element={<BestTimeToVisitPage />} />
        <Route path="/guides/how-to-reach" element={<HowToReachPage />} />
        <Route path="/local-travel/airport-transfer" element={<AirportTransferPage />} />
        <Route path="/local-travel/railway-station-transfer" element={<RailwayStationTransferPage />} />
        <Route path="/local-travel/full-day-city-tour" element={<FullDayCityTourPage />} />
        <Route path="/local-travel/half-day-city-tour" element={<HalfDayCityTourPage />} />
        <Route path="/local-travel/outstation-cab" element={<OutstationCabPage />} />
        <Route path="/local-travel/car-rental" element={<CarRentalPage />} />
        <Route path="/local-travel/local-taxi-cab" element={<LocalTaxiCabPage />} />
        <Route path="/local-travel/corporate-transportation" element={<CorporateTransportationPage />} />
        <Route path="/local-travel/:service" element={<LocalTravelServicePage />} />
        <Route path="/travel-guide/packing-guides" element={<PackingGuidesPage />} />
        <Route path="/travel-guide/packing-guides/:slug" element={<PackingGuidesPage />} />
        <Route path="/india/national-parks/:destinationSlug/how-to-reach" element={<HowToReachPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/plan-trip" element={<PlanTripPage />} />
        {/* Dynamic menu landing pages — data from /api/menus/{slug} */}
        <Route path="/india" element={<IndiaPage />} />
        <Route path="/india/cities" element={<PublicRouteFallback />} />
        <Route path="/india/places" element={<PublicRouteFallback />} />
        <Route path="/india/places/heritage" element={<PublicRouteFallback />} />
        <Route path="/india/places/temples" element={<PublicRouteFallback />} />
        <Route path="/india/places/beaches" element={<PublicRouteFallback />} />
        <Route path="/india/places/lakes" element={<PublicRouteFallback />} />
        <Route path="/india/places/hill-stations" element={<PublicRouteFallback />} />
        <Route path="/india/places/museums" element={<PublicRouteFallback />} />
        <Route path="/india/places/historical" element={<PublicRouteFallback />} />
        <Route path="/india/destinations/attractions" element={<PublicRouteFallback />} />
        <Route path="/india/popular-destinations" element={<PopularDestinationsPage />} />
        <Route path="/india/heritage-destinations" element={<HeritageDestinationsPage />} />
        <Route path="/india/religious-destinations" element={<ReligiousDestinationsPage />} />
        <Route path="/india/hill-stations" element={<HillStationsPage />} />
        <Route path="/india/beaches" element={<BeachesPage />} />
        <Route path="/india/wildlife-destinations" element={<WildlifeDestinationsPage />} />
        <Route path="/india/national-parks" element={<NationalParksPage />} />
        <Route path="/india/weekend-getaways" element={<WeekendGetawaysPage />} />
        <Route path="/india/offbeat-destinations" element={<OffbeatDestinationsPage />} />
        <Route path="/india/destinations" element={<AllIndiaDestinationsPage />} />
        <Route path="/india/famous-destinations" element={<FamousDestinationsPage />} />
        <Route path="/india/national-parks/gir-national-park" element={<GirNationalParkPage />} />
        <Route path="/india/national-parks/ranthambore-national-park" element={<RanthamboreNationalParkPage />} />
        <Route path="/india/national-parks/bandhavgarh-national-park" element={<BandhavgarhNationalParkPage />} />
        <Route path="/india/national-parks/pench-national-park" element={<PenchNationalParkPage />} />
        <Route path="/india/national-parks/jim-corbett-national-park" element={<JimCorbettNationalParkPage />} />
        <Route path="/india/national-parks/sundarbans-national-park" element={<SundarbansNationalParkPage />} />
        <Route path="/india/national-parks/kaziranga-national-park" element={<KazirangaNationalParkPage />} />
        <Route path="/india/national-parks/kaziranga" element={<Navigate to="/india/national-parks/kaziranga-national-park" replace />} />
        <Route path="/india/national-parks/sundarbans" element={<Navigate to="/india/national-parks/sundarbans-national-park" replace />} />
        <Route path="/india/national-parks/ranthambore" element={<Navigate to="/india/national-parks/ranthambore-national-park" replace />} />
        <Route path="/india/national-parks/bandhavgarh" element={<Navigate to="/india/national-parks/bandhavgarh-national-park" replace />} />
        <Route path="/india/national-parks/pench" element={<Navigate to="/india/national-parks/pench-national-park" replace />} />
        <Route path="/india/national-parks/jim-corbett" element={<Navigate to="/india/national-parks/jim-corbett-national-park" replace />} />
        <Route path="/india/experiences" element={<IndiaExperiencesPage />} />
        <Route path="/india/experiences/:categorySlug" element={<IndiaExperiencesPage />} />
        <Route path="/india/things-to-do" element={<IndiaExperiencesPage />} />
        <Route path="/india/things-to-do/:categorySlug" element={<IndiaExperiencesPage />} />
        <Route path="/india/:destSlug" element={<MenuLandingPage />} />
        <Route path="/international" element={<InternationalPage />} />
        <Route path="/international/destinations" element={<InternationalDestPage />} />
        <Route path="/international/destinations/:catSlug" element={<InternationalDestPage />} />
        <Route path="/international/places" element={<InternationalPlacesPage />} />
        <Route path="/international/places/:placeSlug" element={<InternationalPlacesPage />} />
        <Route path="/international/cities" element={<InternationalCitiesPage />} />
        <Route path="/international/things-to-do" element={<InternationalActivitiesPage />} />
        <Route path="/international/things-to-do/:actSlug" element={<InternationalActivitiesPage />} />
        <Route path="/international/:destSlug" element={<CountryPage />} />
        <Route path="/holiday" element={<HolidayPage />} />
        <Route path="/holiday/:destSlug" element={<HolidayPage />} />
        <Route path="/holidays" element={<HolidayPage />} />
        <Route path="/holidays/:typeSlug" element={<HolidayCategoryPage />} />
        <Route path="/holidays/domestic-honeymoon" element={<DomesticHoneymoonPage />} />
        <Route path="/holidays/international-honeymoon" element={<InternationalHoneymoonPage />} />
        <Route path="/holidays/beach-honeymoon" element={<BeachHoneymoonPage />} />
        <Route path="/holidays/hill-station-honeymoon" element={<HillStationHoneymoonPage />} />
        <Route path="/holidays/luxury-honeymoon" element={<LuxuryHoneymoonPage />} />
        <Route path="/holidays/adventure-honeymoon" element={<AdventureHoneymoonPage />} />
        <Route path="/holidays/budget-honeymoon" element={<BudgetHoneymoonPage />} />
        <Route path="/holidays/honeymoon-packages" element={<HoneymoonPackagesPage />} />
        <Route path="/holidays/:typeSlug/:subSlug" element={<HolidayCategoryPage />} />
        <Route path="/mice" element={<MICEPage />} />
        <Route path="/mice/destinations" element={<MICEDestinationPage />} />
        <Route path="/mice/destinations/:destSlug" element={<MICEDestinationPage />} />
        <Route path="/mice/corporate-travel" element={<CorporateTravelPage />} />
        <Route path="/mice/corporate-travel/:serviceSlug" element={<CorporateTravelPage />} />
        <Route path="/mice/support" element={<MICESupportPage />} />
        <Route path="/mice/support/:serviceSlug" element={<MICESupportPage />} />
        <Route path="/destination-wedding" element={<WeddingPage />} />
        <Route path="/destination-weddings" element={<WeddingPage />} />
        <Route path="/destination-weddings/india/rajasthan" element={<RajasthanWeddingPage />} />
        <Route path="/destination-weddings/india/goa" element={<GoaWeddingPage />} />
        <Route path="/destination-weddings/india/udaipur" element={<UdaipurWeddingPage />} />
        <Route path="/destination-weddings/india/jaipur" element={<JaipurWeddingPage />} />
        <Route path="/destination-weddings/india/jodhpur" element={<JodhpurWeddingPage />} />
        <Route path="/destination-weddings/india/kerala" element={<KeralaWeddingPage />} />
        <Route path="/destination-weddings/india/maharashtra" element={<MaharashtraWeddingPage />} />
        <Route path="/destination-weddings/india/himachal" element={<HimachalWeddingPage />} />
        <Route path="/destination-weddings/india/kashmir" element={<KashmirWeddingPage />} />
        <Route path="/destination-weddings/india/ayodhya" element={<AyodhyaWeddingPage />} />
        <Route path="/destination-weddings/india/varanasi" element={<VaranasiWeddingPage />} />
        <Route path="/destination-weddings/international" element={<ComingSoonPage pageName="International Weddings" />} />
        <Route path="/destination-weddings/international/bali" element={<BaliWeddingPage />} />
        <Route path="/destination-weddings/international/thailand" element={<ThailandWeddingPage />} />
        <Route path="/destination-weddings/international/dubai" element={<DubaiWeddingPage />} />
        <Route path="/destination-weddings/international/maldives" element={<MaldivesWeddingPage />} />
        <Route path="/destination-weddings/international/singapore" element={<SingaporeWeddingPage />} />
        <Route path="/destination-wedding/:destSlug" element={<WeddingPage />} />
        <Route path="/destination-weddings/:destSlug" element={<WeddingPage />} />
        <Route path="/weddings/rajasthan" element={<RajasthanWeddingPage />} />
        <Route path="/medical-tourism" element={<MedicalTourismPage />} />
        <Route path="/medical-tourism/:destSlug" element={<MedicalTourismPage />} />
        <Route path="/gujarat" element={<GujaratPage />} />
        <Route path="/rajasthan" element={<RajasthanPage />} />
        <Route path="/maharashtra" element={<MaharashtraPage />} />
        <Route path="/goa" element={<GoaPage />} />
        <Route path="/kerala" element={<KeralaPage />} />
        <Route path="/tamil-nadu" element={<TamilNaduPage />} />
        <Route path="/himachal-pradesh" element={<HimachalPradeshPage />} />
        <Route path="/uttarakhand" element={<UttarakhandPage />} />
        <Route path="/karnataka" element={<KarnatakaPage />} />
        <Route path="/jammu-kashmir" element={<JammuKashmirPage />} />
        <Route path="/uttar-pradesh" element={<UttarPradeshPage />} />
        <Route path="/madhya-pradesh" element={<MadhyaPradeshPage />} />
        <Route path="/west-bengal" element={<WestBengalPage />} />
        <Route path="/andaman" element={<AndamanPage />} />
        <Route path="/north-east" element={<NorthEastPage />} />
        <Route path="/india/:stateSlug/:citySlug" element={<CityDetail />} />
        <Route path="/international/:countrySlug/packages" element={<InternationalPackagesPage />} />
        <Route path="/international/:countrySlug/:citySlug" element={<InternationalCityDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage admin />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ── Customer Routes ────────────────────────────────────── */}
      <Route element={<ProtectedRoute><Suspense fallback={<RouteFallback />}><CustomerLayout /></Suspense></ProtectedRoute>}>
        <Route path="/account" element={<CustomerDashboard />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/bookings" element={<MyBookings />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
        <Route path="/account/reviews" element={<CustomerReviews />} />
        <Route path="/account/enquiries" element={<MyEnquiries />} />
        <Route path="/account/invoices" element={<MyInvoices />} />
        <Route path="/account/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/account/*" element={<Navigate to="/account" replace />} />
      </Route>

      {/* ── Admin Routes ───────────────────────────────────────── */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><Suspense fallback={<RouteFallback />}><AdminLayout /></Suspense></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="destinations/new" element={<AdminDestinationForm />} />
        <Route path="destinations/edit/:id" element={<AdminDestinationForm />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<AdminPackageForm />} />
        <Route path="packages/edit/:id" element={<AdminPackageForm />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="hotels/new" element={<AdminHotelForm />} />
        <Route path="hotels/edit/:id" element={<AdminHotelForm />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="activities/new" element={<AdminActivityForm />} />
        <Route path="activities/edit/:id" element={<AdminActivityForm />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blogs/new" element={<AdminBlogForm />} />
        <Route path="blogs/edit/:id" element={<AdminBlogForm />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="local-travel-enquiries" element={<AdminTravelEnquiries type="local" />} />
        <Route path="contact-enquiries" element={<AdminTravelEnquiries type="contact" />} />
        <Route path="client-interests" element={<AdminClientInterests />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="approvals" element={<AdminApprovalCenter />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="invoices/new" element={<InvoiceForm />} />
        <Route path="invoices/:id" element={<InvoiceDetail admin />} />
        <Route path="invoices/:id/edit" element={<InvoiceForm />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="/account/*" element={<Navigate to="/account" replace />} />
      <Route path="*" element={<PublicLayout><PublicRouteFallback /></PublicLayout>} />
    </Routes>
  )
}
