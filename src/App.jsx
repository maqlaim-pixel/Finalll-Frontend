import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/home/HomePage'
import DestinationsPage from './pages/destinations/DestinationsPage'
import DestinationDetail from './pages/destinations/DestinationDetail'
import PackagesPage from './pages/packages/PackagesPage'
import PackageDetail from './pages/packages/PackageDetail'
import TrekkingPackagesPage from './pages/adventure/TrekkingPackagesPage'
import HotelsPage from './pages/hotels/HotelsPage'
import HotelDetail from './pages/hotels/HotelDetail'
import ActivitiesPage from './pages/activities/ActivitiesPage'
import ActivityDetail from './pages/activities/ActivityDetail'
import BlogPage from './pages/blog/BlogPage'
import BlogDetail from './pages/blog/BlogDetail'
import TravelTipsPage from './pages/TravelTipsPage'
import BestTimeToVisitPage from './pages/BestTimeToVisitPage'
import TravelCostPage from './pages/TravelCostPage'
import VisaInformationPage from './pages/VisaInformationPage'
import OffersPage from './pages/offers/OffersPage'
import AboutPage from './pages/about/AboutPage'
import ContactPage from './pages/contact/ContactPage'
import PlanTripPage from './pages/home/PlanTripPage'
import MenuLandingPage from './pages/menu/MenuLandingPage'
import IndiaPage from './pages/india/IndiaPage'
import PopularDestinationsPage from './pages/india/PopularDestinationsPage'
import HeritageDestinationsPage from './pages/india/HeritageDestinationsPage'
import ReligiousDestinationsPage from './pages/india/ReligiousDestinationsPage'
import HillStationsPage from './pages/india/HillStationsPage'
import BeachesPage from './pages/india/BeachesPage'
import WildlifeDestinationsPage from './pages/india/WildlifeDestinationsPage'
import NationalParksPage from './pages/india/NationalParksPage'
import WeekendGetawaysPage from './pages/india/WeekendGetawaysPage'
import OffbeatDestinationsPage from './pages/india/OffbeatDestinationsPage'
import FamousDestinationsPage from './pages/india/FamousDestinationsPage'
import AllIndiaDestinationsPage from './pages/india/AllIndiaDestinationsPage'
import IndiaExperiencesPage from './pages/india/IndiaExperiencesPage'
import GirNationalParkPage from './pages/india/GirNationalParkPage'
import RanthamboreNationalParkPage from './pages/india/RanthamboreNationalParkPage'
import BandhavgarhNationalParkPage from './pages/india/BandhavgarhNationalParkPage'
import PenchNationalParkPage from './pages/india/PenchNationalParkPage'
import JimCorbettNationalParkPage from './pages/india/JimCorbettNationalParkPage'
import SundarbansNationalParkPage from './pages/india/SundarbansNationalParkPage'
import KazirangaNationalParkPage from './pages/india/KazirangaNationalParkPage'
import HowToReachPage from './pages/india/HowToReachPage'
import PackingGuidesPage from './pages/PackingGuidesPage'
import InternationalPage from './pages/international/InternationalPage'
import CountryPage from './pages/international/CountryPage'
import InternationalDestPage from './pages/international/InternationalDestPage'
import InternationalPlacesPage from './pages/international/InternationalPlacesPage'
import InternationalActivitiesPage from './pages/international/InternationalActivitiesPage'
import InternationalCitiesPage from './pages/international/InternationalCitiesPage'
import HolidayPage from './pages/holiday/HolidayPage'
import HolidayCategoryPage from './pages/holiday/HolidayCategoryPage'
import DomesticHoneymoonPage from './pages/holiday/DomesticHoneymoonPage'
import InternationalHoneymoonPage from './pages/holiday/InternationalHoneymoonPage'
import BeachHoneymoonPage from './pages/holiday/BeachHoneymoonPage'
import HillStationHoneymoonPage from './pages/holiday/HillStationHoneymoonPage'
import LuxuryHoneymoonPage from './pages/holiday/LuxuryHoneymoonPage'
import AdventureHoneymoonPage from './pages/holiday/AdventureHoneymoonPage'
import BudgetHoneymoonPage from './pages/holiday/BudgetHoneymoonPage'
import HoneymoonPackagesPage from './pages/holiday/HoneymoonPackagesPage'
import MICEPage from './pages/mice/MICEPage'
import MICEDestinationPage from './pages/mice/MICEDestinationPage'
import CorporateTravelPage from './pages/mice/CorporateTravelPage'
import MICESupportPage from './pages/mice/MICESupportPage'
import WeddingPage from './pages/wedding/WeddingPage'
import RajasthanWeddingPage from './pages/wedding/RajasthanWeddingPage'
import GoaWeddingPage from './pages/wedding/GoaWeddingPage'
import UdaipurWeddingPage from './pages/wedding/UdaipurWeddingPage'
import JaipurWeddingPage from './pages/wedding/JaipurWeddingPage'
import JodhpurWeddingPage from './pages/wedding/JodhpurWeddingPage'
import KeralaWeddingPage from './pages/wedding/KeralaWeddingPage'
import MaharashtraWeddingPage from './pages/wedding/MaharashtraWeddingPage'
import HimachalWeddingPage from './pages/wedding/HimachalWeddingPage'
import KashmirWeddingPage from './pages/wedding/KashmirWeddingPage'
import AyodhyaWeddingPage from './pages/wedding/AyodhyaWeddingPage'
import VaranasiWeddingPage from './pages/wedding/VaranasiWeddingPage'
import BaliWeddingPage from './pages/wedding/BaliWeddingPage'
import ThailandWeddingPage from './pages/wedding/ThailandWeddingPage'
import DubaiWeddingPage from './pages/wedding/DubaiWeddingPage'
import MaldivesWeddingPage from './pages/wedding/MaldivesWeddingPage'
import SingaporeWeddingPage from './pages/wedding/SingaporeWeddingPage'
import MedicalTourismPage from './pages/medical/MedicalTourismPage'
import GujaratPage from './pages/gujarat/GujaratPage'
import RajasthanPage from './pages/rajasthan/RajasthanPage'
import MaharashtraPage from './pages/maharashtra/MaharashtraPage'
import GoaPage from './pages/goa/GoaPage'
import KeralaPage from './pages/kerala/KeralaPage'
import TamilNaduPage from './pages/tamil-nadu/TamilNaduPage'
import HimachalPradeshPage from './pages/himachal/HimachalPradeshPage'
import UttarakhandPage from './pages/uttarakhand/UttarakhandPage'
import KarnatakaPage from './pages/karnataka/KarnatakaPage'
import JammuKashmirPage from './pages/jammu-kashmir/JammuKashmirPage'
import UttarPradeshPage from './pages/uttar-pradesh/UttarPradeshPage'
import MadhyaPradeshPage from './pages/madhya-pradesh/MadhyaPradeshPage'
import WestBengalPage from './pages/west-bengal/WestBengalPage'
import AndamanPage from './pages/andaman/AndamanPage'
import NorthEastPage from './pages/north-east/NorthEastPage'
import CityDetail from './pages/cities/CityDetail'
import InternationalCityDetail from './pages/cities/InternationalCityDetail'
import InternationalPackagesPage from './pages/international/InternationalPackagesPage'
import LocalTravelServicePage from './pages/LocalTravelServicePage'
import AirportTransferPage from './pages/AirportTransferPage'
import RailwayStationTransferPage from './pages/RailwayStationTransferPage'
import FullDayCityTourPage from './pages/FullDayCityTourPage'
import HalfDayCityTourPage from './pages/HalfDayCityTourPage'
import OutstationCabPage from './pages/OutstationCabPage'
import CarRentalPage from './pages/CarRentalPage'
import LocalTaxiCabPage from './pages/LocalTaxiCabPage'
import CorporateTransportationPage from './pages/CorporateTransportationPage'
import AllTravelGuidesPage from './pages/AllTravelGuidesPage'
import { ComingSoonPage, NotFoundPage } from './pages/common/ComingSoonPage'
import { isKnownMenuRoute } from './utils/menuRouteIndex'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import MyBookings from './pages/customer/MyBookings'
import Wishlist from './pages/customer/Wishlist'
import ProfilePage from './pages/customer/ProfilePage'
import CustomerReviews from './pages/customer/CustomerReviews'
import MyEnquiries from './pages/customer/MyEnquiries'
import MyInvoices from './pages/customer/MyInvoices'
import InvoiceDetail from './pages/invoices/InvoiceDetail'

import AdminInvoices from './pages/admin/AdminInvoices'
import InvoiceForm from './pages/admin/InvoiceForm'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDestinations from './pages/admin/AdminDestinations'
import AdminPackages from './pages/admin/AdminPackages'
import AdminHotels from './pages/admin/AdminHotels'
import AdminActivities from './pages/admin/AdminActivities'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminBookings from './pages/admin/AdminBookings'
import AdminLeads from './pages/admin/AdminLeads'
import AdminClientInterests from './pages/admin/AdminClientInterests'
import AdminTravelEnquiries from './pages/admin/AdminTravelEnquiries'
import AdminReviews from './pages/admin/AdminReviews'
import AdminApprovalCenter from './pages/admin/AdminApprovalCenter'
import AdminSettings from './pages/admin/AdminSettings'
import AdminPackageForm from './pages/admin/packages/AdminPackageForm'
import AdminDestinationForm from './pages/admin/AdminDestinationForm'
import AdminHotelForm from './pages/admin/AdminHotelForm'
import AdminActivityForm from './pages/admin/AdminActivityForm'
import AdminBlogForm from './pages/admin/AdminBlogForm'

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
      <Route element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
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
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
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
