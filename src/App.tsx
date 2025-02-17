import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { CartProvider } from "@/contexts/CartContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { RouteGuard } from "@/components/auth/RouteGuard";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { SearchDialog } from "@/components/search/SearchDialog";
import { ChatWidget } from "@/components/chat/ChatWidget";
import FloatingCartWidget from "@/components/cart/FloatingCartWidget";

// Pages
import HomePage from "@/pages/index";
import AuthCallback from "@/pages/auth/callback";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ProductDetails from "@/pages/products/[id]";
import CategoryPage from "@/pages/categories/[category]";
import SearchPage from "@/pages/search";
import ProfilePage from "@/pages/profile";
import SellerDashboard from "@/pages/seller/dashboard";
import CheckoutPage from "@/pages/checkout";
import CheckoutSuccessPage from "@/pages/checkout/success";
import OrdersPage from "@/pages/orders";
import AdminReviewsPage from "@/pages/admin/reviews";
import NotFoundPage from "@/pages/404";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import FAQPage from "@/pages/faq";
import HelpPage from "@/pages/help";
import ContactPage from "@/pages/contact";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <PaymentProvider>
          <CartProvider>
            <CategoryProvider>
              <SearchProvider>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/auth/login" element={<LoginPage />} />
                      <Route path="/auth/register" element={<RegisterPage />} />
                      <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                      />
                      <Route
                        path="/categories/:category"
                        element={<CategoryPage />}
                      />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/contact" element={<ContactPage />} />

                      {/* Protected Routes */}
                      <Route
                        path="/profile"
                        element={
                          <RouteGuard requireAuth>
                            <ProfilePage />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/seller/dashboard"
                        element={
                          <RouteGuard requireAuth>
                            <SellerDashboard />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <RouteGuard requireAuth>
                            <CheckoutPage />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/checkout/success"
                        element={
                          <RouteGuard requireAuth>
                            <CheckoutSuccessPage />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <RouteGuard requireAuth>
                            <OrdersPage />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/admin/reviews"
                        element={
                          <RouteGuard requireAuth>
                            <AdminReviewsPage />
                          </RouteGuard>
                        }
                      />

                      {/* Tempo Routes */}
                      {import.meta.env.VITE_TEMPO && (
                        <Route path="/tempobook/*" />
                      )}

                      {/* 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
                  </main>
                  <Footer />
                  <Toaster />
                  <SearchDialog />
                  <ChatWidget />
                  <FloatingCartWidget />
                </div>
              </SearchProvider>
            </CategoryProvider>
          </CartProvider>
        </PaymentProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
