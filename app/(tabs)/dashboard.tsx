import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { ZoomIn } from "react-native-reanimated";
import { apiService } from "@/services/api";
import { getIdNumber } from "@/services/secureStore";

const PRIMARY = "#10b981"; // Emerald
const SECONDARY = "#eab308"; // Gold
const BACKGROUND = "#0a0a0f";
const CARD_BG = "#111827";
const GLASS = "rgba(255,255,255,0.07)";

export default function HomeScreen() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<any>(null);

  const loadDashboard = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const savedId = await getIdNumber();
      const idToUse = savedId || "1001123530"; // Fallback sandbox ID
      console.log("[Dashboard] Fetching data for user ID:", idToUse);
      const response = await apiService.dashboard.getDashboard(idToUse);
      
      if (response.SUCCEEDED && response.DATA) {
        const parsedData = Array.isArray(response.DATA) ? response.DATA[0] : response.DATA;
        setDashboardData(parsedData);
        
        // Handle popup notifications if present
        if (parsedData?.POPUP_NOTIFICATIONS && parsedData.POPUP_NOTIFICATIONS.length > 0) {
          setActiveNotification(parsedData.POPUP_NOTIFICATIONS[0]);
          setShowNotification(true);
        } else if (response.RESPONSEPOPUP) {
          setActiveNotification({
            MESSAGETITLE: response.MESSAGETITLE || "Alert",
            MESSAGETEXT: response.MESSAGETEXT || "New notification received.",
            BUTTONTEXT: response.BUTTONTEXT || "Ok"
          });
          setShowNotification(true);
        }
      } else {
        setError(response.RESPONSEDESCRIPTION || "Failed to load dashboard data.");
      }
    } catch (err: any) {
      console.error("[Dashboard Load Error]", err);
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard(true);
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[BACKGROUND, "#0f172a", BACKGROUND]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Syncing finance dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[BACKGROUND, "#0f172a", BACKGROUND]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="cloud-offline-outline" size={64} color="#ef4444" style={{ marginBottom: 10 }} />
        <Text style={styles.errorText}>Connection lost</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => loadDashboard()}>
          <Text style={styles.retryBtnText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const header = dashboardData?.DASHBOARD_HEADER?.[0] || {
    USERNAME: "User",
    GREETINGS: "Welcome Back",
    NEWNOTIFICATIONS: false,
    NEWNOTIFICATIONCOUNT: 0,
    ALLOWLOANAPPLICATION: true,
    ALLOWTRANSACTIONS: true,
  };

  const activeContract = dashboardData?.CURRENT_CONTRACTS?.[0];

  // Clean greeting to avoid "Hello Hello User"
  let displayName = header.USERNAME || "User";
  if (displayName.toLowerCase().startsWith("hello ")) {
    displayName = displayName.substring(6).trim();
  }

  // Dynamic details for overview
  let remainingPercent = 100;
  let utilizedPercent = 0;
  let remainingAmount = 0;
  let utilizedAmount = 0;

  if (activeContract) {
    const total = activeContract.TOTALLOANAMOUNT || 46000;
    const os = activeContract.TOTALLOANRECEIVABLEOS || 46000;
    remainingAmount = os;
    utilizedAmount = total - os;
    if (utilizedAmount < 0) utilizedAmount = 0;
    remainingPercent = Math.round((remainingAmount / total) * 100);
    utilizedPercent = 100 - remainingPercent;
  }

  const renderApplications = () => {
    const apps = dashboardData?.CURRENT_APPLICATIONS || [];
    if (apps.length === 0) {
      return (
        <View style={[styles.appCard, { alignItems: 'center', paddingVertical: 30 }]}>
          <Ionicons name="document-text-outline" size={32} color="#475569" />
          <Text style={[styles.appTitle, { color: '#64748b', fontSize: 16, marginTop: 10, marginBottom: 0 }]}>
            No active applications
          </Text>
        </View>
      );
    }

    return apps.slice(0, 3).map((app: any, idx: number) => {
      const currentStage = app.CURRENTSTAGE || 1;
      const totalStages = app.TOTALSTAGES || 12;
      const progressPercent = Math.round((currentStage / totalStages) * 100);
      const dateFormatted = app.APPLICATIONDATE 
        ? new Date(app.APPLICATIONDATE).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : "Recent";

      return (
        <View key={app.APPLICATIONNO || idx} style={[styles.appCard, { marginBottom: 16 }]}>
          <View style={styles.appHeader}>
            <Text style={[styles.appId, { color: PRIMARY }]}>#{app.APPLICATIONNO}</Text>
            <Text style={styles.appDate}>{dateFormatted}</Text>
          </View>
          <Text style={styles.appTitle}>{app.PRODUCTNAME || "Tawarruq"} - {app.STAGENAME}</Text>

          <View style={styles.appDetailsRow}>
            <View>
               <Text style={styles.appLabel}>Requested Amount</Text>
               <Text style={styles.appValue}>SAR {app.REQUESTAMOUNT?.toLocaleString() || "0"}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
               <Text style={styles.appLabel}>Status</Text>
               <Text style={[styles.appStatus, { color: PRIMARY }]}>
                 {app.APPLICATIONSTATUS || "In Progress"}
               </Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%`, backgroundColor: PRIMARY },
              ]}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>
              Stage {currentStage} of {totalStages} ({progressPercent}%)
            </Text>
            <TouchableOpacity 
              style={[styles.detailsBtn, { paddingVertical: 8, paddingHorizontal: 16 }]}
              onPress={() => {
                if (!header.ALLOWLOANAPPLICATION) {
                  setActiveNotification({
                    MESSAGETITLE: "Action Blocked",
                    MESSAGETEXT: "Action is disabled for this user.",
                    BUTTONTEXT: "Ok"
                  });
                  setShowNotification(true);
                  return;
                }
                router.push('/personal-finance');
              }}
            >
              <Text style={styles.detailsBtnText}>Resume</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[BACKGROUND, "#0f172a", BACKGROUND]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerBg}>
        <LinearGradient
          colors={[PRIMARY + "12", "transparent"]}
          style={styles.headerGradient}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY}
              colors={[PRIMARY]}
            />
          }
        >
          {/* Top Bar - Logo Unchanged */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="grid-outline" size={26} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerLogo}>
              <Ionicons name="flash" size={24} color={PRIMARY} />
              <Text style={styles.headerBrand}>
                EDGE <Text style={{ color: PRIMARY }}>FINANCE</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              {header.NEWNOTIFICATIONS && <View style={styles.notifBadge} />}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.helloText}>Hello {displayName} 👋</Text>
              <Text style={styles.morningText}>{header.GREETINGS}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image
                source={header.USERPIC ? { uri: `data:image/${header.USERPICFORMAT || 'jpeg'};base64,${header.USERPIC}` } : { uri: "https://i.pravatar.cc/150?u=edge" }}
                style={styles.avatar}
              />
              <View style={[styles.avatarBorder, { borderColor: PRIMARY }]} />
            </View>
          </View>

          {/* Active Loan Status */}
          {activeContract ? (
            <LinearGradient
              colors={[CARD_BG, "#1e293b"]}
              style={styles.activeLoanCard}
            >
              <View style={styles.activeLoanHeader}>
                <View style={styles.activeIconContainer}>
                  <Ionicons name="shield-checkmark" size={22} color={PRIMARY} />
                  <Text style={[styles.activeStatusText, { color: PRIMARY }]}>{activeContract.LOANSTATUS} Loan</Text>
                </View>
                <Text style={styles.contractNo}>{activeContract.CONTRACTNO}</Text>
              </View>

              <View style={styles.activeLoanDetails}>
                <View>
                  <Text style={styles.activeLabel}>Loan Amount</Text>
                  <Text style={styles.activeValue}>SAR {activeContract.LOANAMOUNT?.toLocaleString() || "0"}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.activeLabel}>Monthly Installment</Text>
                  <Text style={[styles.activeValue, { color: SECONDARY }]}>SAR {activeContract.INSTALLMENTAMOUNT?.toLocaleString() || "0"}</Text>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.02)", "rgba(255, 255, 255, 0.06)"]}
              style={styles.noLoanCardPremium}
            >
              <View style={styles.noLoanIconBg}>
                <Ionicons name="wallet-outline" size={26} color={PRIMARY} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.noLoanTitle}>No Active Loan Contract</Text>
                <Text style={styles.noLoanSubtitle}>Need instant liquidity? Apply for personal finance options below.</Text>
              </View>
              <TouchableOpacity style={styles.noLoanQuickApply} onPress={() => router.push('/personal-finance')}>
                <Ionicons name="chevron-forward" size={20} color={PRIMARY} />
              </TouchableOpacity>
            </LinearGradient>
          )}

          {/* Finance Options */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.financeOptionsRow}
          >
            {dashboardData?.FINANCE_PRODUCTS?.map((item: any, i: number) => {
              const route = item.PRODUCTCODE === "TWQ" ? "/personal-finance" : null;
              const hasIcon = !!item.PRODUCTBUTTONICON;
              const format = item.PRODUCTBUTTONICONFORMAT || 'png';
              const details = item.PRODUCTBUTTONICONFORMATDETAILS || `data:image/${format};base64,`;

              return (
                <TouchableOpacity 
                  key={i} 
                  style={styles.financeItem} 
                  activeOpacity={0.7}
                  onPress={() => {
                    if (!header.ALLOWLOANAPPLICATION) {
                      setActiveNotification({
                        MESSAGETITLE: "Action Blocked",
                        MESSAGETEXT: "Loan application is currently disabled for your account.",
                        BUTTONTEXT: "Ok"
                      });
                      setShowNotification(true);
                      return;
                    }
                    if (route) {
                      router.push(route as any);
                    }
                  }}
                >
                  <View style={[styles.financeIconCircle, item.PRODUCTCODE === "TWQ" && styles.financeIconActive]}>
                    {hasIcon ? (
                      <Image
                        source={{ uri: `${details}${item.PRODUCTBUTTONICON}` }}
                        style={{ width: 34, height: 34, resizeMode: 'contain' }}
                      />
                    ) : (
                      <Ionicons name="cash-outline" size={30} color={item.PRODUCTCODE === "TWQ" ? PRIMARY : "#94a3b8"} />
                    )}
                  </View>
                  <Text style={[styles.financeItemText, item.PRODUCTCODE === "TWQ" && { color: "#fff" }]}>
                    {item.PRODUCTBUTTONTEXT}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ====================== SPECIAL OFFERS - THEME CONSISTENT ====================== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promoRow}
          >
            {dashboardData?.SLIDE_SHOW?.length > 0 ? (
              dashboardData.SLIDE_SHOW.map((slide: any, index: number) => {
                const hasImg = !!slide.SLIDEIMAGE;
                return (
                  <LinearGradient
                    key={index}
                    colors={[CARD_BG, "#1e293b"]}
                    style={[styles.promoCard, { borderColor: PRIMARY + "30" }]}
                  >
                    {hasImg ? (
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${slide.SLIDEIMAGE}` }}
                        style={{ width: "100%", height: 90, borderRadius: 16, marginBottom: 12, resizeMode: 'cover' }}
                      />
                    ) : (
                      <View style={styles.promoIconPlaceholder}>
                        <Ionicons name="gift-outline" size={32} color={PRIMARY} />
                      </View>
                    )}
                    {slide.SHOWTITLE !== false && (
                      <Text style={styles.promoTitle}>{slide.TITLETEXT}</Text>
                    )}
                    {slide.SHOWBODY !== false && (
                      <Text style={styles.promoDesc}>{slide.BODYTEXT}</Text>
                    )}
                    {slide.SHOWBUTTON !== false && (
                      <TouchableOpacity 
                        style={styles.promoApplyBtn}
                        onPress={() => {
                          if (header.ALLOWLOANAPPLICATION) {
                            router.push('/personal-finance');
                          } else {
                            setActiveNotification({
                              MESSAGETITLE: "Application Disabled",
                              MESSAGETEXT: "Loan applications are temporarily disabled.",
                              BUTTONTEXT: "Ok"
                            });
                            setShowNotification(true);
                          }
                        }}
                      >
                        <LinearGradient
                          colors={[PRIMARY, "#059669"]}
                          style={styles.btnGradient}
                        >
                          <Text style={styles.promoApplyBtnText}>{slide.BUTTONTEXT || "Apply"} →</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </LinearGradient>
                );
              })
            ) : (
              <>
                <LinearGradient
                  colors={[CARD_BG, "#1e293b"]}
                  style={[styles.promoCard, { borderColor: SECONDARY + "30" }]}
                >
                  <View style={[styles.promoIconPlaceholder, { backgroundColor: SECONDARY + "15" }]}>
                    <Ionicons name="cash-outline" size={30} color={SECONDARY} />
                  </View>
                  <Text style={styles.promoTitle}>Instant Personal Loan</Text>
                  <Text style={[styles.promoAmountText, { color: SECONDARY }]}>
                    SAR 25,000
                  </Text>
                  <Text style={styles.promoDesc}>
                    Instant approval in 2 minutes
                  </Text>
                  <TouchableOpacity 
                    style={styles.promoApplyBtn}
                    onPress={() => {
                      if (header.ALLOWLOANAPPLICATION) {
                        router.push('/personal-finance');
                      } else {
                        setActiveNotification({
                          MESSAGETITLE: "Application Disabled",
                          MESSAGETEXT: "Loan applications are temporarily disabled.",
                          BUTTONTEXT: "Ok"
                        });
                        setShowNotification(true);
                      }
                    }}
                  >
                    <LinearGradient
                      colors={[SECONDARY, "#d97706"]}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.promoApplyBtnText}>Apply Now →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  colors={[CARD_BG, "#1e293b"]}
                  style={[styles.promoCard, { borderColor: PRIMARY + "30" }]}
                >
                  <View style={[styles.promoIconPlaceholder, { backgroundColor: PRIMARY + "15" }]}>
                    <Ionicons name="home-outline" size={30} color={PRIMARY} />
                  </View>
                  <Text style={styles.promoTitle}>Lifestyle Finance</Text>
                  <Text style={[styles.promoAmountText, { color: PRIMARY }]}>
                    Up to SAR 40,000
                  </Text>
                  <Text style={styles.promoDesc}>Furniture & Electronics</Text>
                  <TouchableOpacity 
                    style={styles.promoApplyBtn}
                    onPress={() => {
                      router.push('/personal-finance');
                    }}
                  >
                    <LinearGradient
                      colors={[PRIMARY, "#059669"]}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.promoApplyBtnText}>Apply Now →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}
          </ScrollView>

          {/* Virtual Wallet */}
          <Text style={styles.sectionTitle}>Virtual Wallet</Text>
          <Animated.View
            entering={ZoomIn.duration(800)}
            style={styles.walletCard}
          >
            <LinearGradient
              colors={["#1e293b", "#0f172a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.walletGradient}
            >
              <View style={styles.cardGlowOverlay} />

              <View style={styles.walletHeader}>
                <View>
                  <Text style={styles.cardBrandName}>EDGE <Text style={{ color: SECONDARY }}>VIP</Text></Text>
                  <Text style={styles.walletSub}>Available Balance</Text>
                </View>
                <Ionicons name="flash" size={32} color={SECONDARY} />
              </View>

              <Text style={styles.walletBalanceText}>
                {activeContract ? `SAR ${activeContract.TOTALLOANRECEIVABLEOS?.toLocaleString()}` : "SAR 0.00"}
              </Text>

              <View style={styles.walletFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="hardware-chip-outline" size={30} color="#64748b" />
                  <Text style={styles.walletCardNumber}>•••• •••• •••• 4026</Text>
                </View>
                <Text style={styles.walletLabel}>{displayName}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Overview */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewRow}>
            <LinearGradient
              colors={[CARD_BG, "rgba(255,255,255,0.01)"]}
              style={[styles.overviewCard, { borderColor: PRIMARY + "20" }]}
            >
              <View style={[styles.chartCircle, { borderColor: PRIMARY }]}>
                <Text style={[styles.chartPercent, { color: PRIMARY }]}>
                  {remainingPercent}%
                </Text>
              </View>
              <View style={styles.chartTextContainer}>
                <Text style={styles.chartLabel}>Remaining Amount</Text>
                <Text style={styles.chartAmount}>SAR {remainingAmount.toLocaleString()}</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={[CARD_BG, "rgba(255,255,255,0.01)"]}
              style={[styles.overviewCard, { borderColor: SECONDARY + "20" }]}
            >
              <View style={[styles.chartCircle, { borderColor: SECONDARY }]}>
                <Text style={[styles.chartPercent, { color: SECONDARY }]}>
                  {utilizedPercent}%
                </Text>
              </View>
              <View style={styles.chartTextContainer}>
                <Text style={styles.chartLabel}>Utilized</Text>
                <Text style={styles.chartAmount}>SAR {utilizedAmount.toLocaleString()}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Reminder */}
          {activeContract && (
            <View style={styles.reminderCard}>
              <View
                style={[styles.reminderBadge, { backgroundColor: SECONDARY }]}
              >
                <Text style={styles.reminderBadgeText}>REMINDER</Text>
              </View>
              <View style={styles.reminderContent}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.reminderTitle}>Next Installment Due</Text>
                  <Text style={styles.reminderSub}>Installment due for {activeContract.CONTRACTNO}</Text>
                </View>
                <View style={styles.reminderDateBox}>
                  <Text style={styles.reminderDate}>
                    {activeContract.NEXTDUEDATE 
                      ? new Date(activeContract.NEXTDUEDATE).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                      : "N/A"
                    }
                  </Text>
                  <Text style={styles.reminderSAR}>
                    SAR {activeContract.NEXTINSTALLMENTAMOUNT?.toLocaleString() || "0"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Application Tracker */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Application Tracker</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: SECONDARY }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {renderApplications()}

          {/* Featured Partners */}
          {dashboardData?.PARTNERS && dashboardData.PARTNERS.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Partners</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.partnersRow}
              >
                {dashboardData.PARTNERS.map((partner: any, idx: number) => {
                  const format = partner.LOGOFORMAT || 'jpeg';
                  const details = partner.FORMATDETAILS || `data:image/${format};base64,`;
                  const imageUri = `${details}${partner.SUPPLIERLOGO}`;

                  return (
                    <View key={partner.SUPPLIERRECID || idx} style={styles.partnerCard}>
                      <View style={styles.partnerLogoBox}>
                        {partner.SUPPLIERLOGO ? (
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.partnerLogo}
                          />
                        ) : (
                          <Ionicons name="business" size={28} color="#94a3b8" />
                        )}
                      </View>
                      <Text style={styles.partnerName} numberOfLines={1}>
                        {partner.SUPPLIERNAME}
                      </Text>
                      <Text style={styles.partnerType}>
                        {partner.SUPPLIERTYPE}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Notification Alert Modal */}
      <Modal
        visible={showNotification}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotification(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.warningCard}>
            <View style={[styles.warningIconCircle, { backgroundColor: SECONDARY + '20' }]}>
              <Ionicons 
                name={activeNotification?.ISFACEIDNOTIFICATION ? "finger-print-outline" : "notifications-outline"} 
                size={50} 
                color={SECONDARY} 
              />
            </View>
            <Text style={styles.warningTitle}>{activeNotification?.MESSAGETITLE || "Alert"}</Text>
            <Text style={styles.warningDesc}>
              {activeNotification?.MESSAGETEXT || "No message content available."}
            </Text>
            
            <TouchableOpacity 
              style={[styles.tryAgainBtn, { backgroundColor: PRIMARY }]}
              onPress={() => {
                setShowNotification(false);
                if (activeNotification?.SCREENADDRESS) {
                  router.push(activeNotification.SCREENADDRESS as any);
                }
              }}
            >
              <Text style={[styles.tryAgainText, { color: BACKGROUND }]}>
                {activeNotification?.BUTTONTEXT || "Understand"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND,
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND,
    paddingHorizontal: 30,
  },
  errorText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubText: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 18,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  retryBtnText: {
    color: BACKGROUND,
    fontSize: 16,
    fontWeight: "900",
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    overflow: "hidden",
  },
  headerGradient: { flex: 1 },

  scrollContent: { paddingBottom: 100, paddingTop: 20 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 30,
    marginBottom: 30,
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: GLASS,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerBrand: {
    fontSize: 19,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 24,
  },

  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: GLASS,
    justifyContent: "center",
    alignItems: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 11,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: SECONDARY,
    borderWidth: 2,
    borderColor: BACKGROUND,
  },

  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 35,
  },
  helloText: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "600",
    lineHeight: 24,
  },
  morningText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginTop: 2,
    lineHeight: 34,
  },

  avatarContainer: { position: "relative" },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarBorder: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 38,
    borderWidth: 3,
  },

  noLoanCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CARD_BG,
    marginHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GLASS,
    marginBottom: 24,
  },
  noLoanText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },

  noLoanCardPremium: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    marginHorizontal: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 28,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  noLoanIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  noLoanTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  noLoanSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    fontWeight: "600",
  },
  noLoanQuickApply: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
  },

  activeLoanCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: PRIMARY + "40",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  activeLoanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  activeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeStatusText: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  contractNo: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },
  activeLoanDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 6,
  },
  activeValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },

  financeOptionsRow: {
    paddingLeft: 24,
    marginBottom: 35,
  },
  financeItem: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  financeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CARD_BG,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  financeIconActive: {
    borderColor: PRIMARY,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  financeItemText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: 14,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fff",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  viewAll: { fontSize: 15, fontWeight: "700", color: PRIMARY },

  actionsRow: { paddingLeft: 24, marginBottom: 38 },
  actionItem: { alignItems: "center", marginRight: 24 },
  actionIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  actionLabel: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 9,
  },

  promoRow: { paddingLeft: 24, marginBottom: 40 },
  promoCard: {
    width: 245,
    borderRadius: 28,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  promoIconPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  promoTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 6,
  },
  promoAmountText: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  promoDesc: { fontSize: 13, color: "#94a3b8", marginBottom: 18, fontWeight: "600" },
  promoApplyBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  promoApplyBtnText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  walletCard: {
    marginHorizontal: 24,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 40,
    elevation: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  walletGradient: { padding: 26, height: 200, justifyContent: "space-between" },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardGlowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.015)",
  },
  cardBrandName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    marginBottom: 6,
  },
  walletSub: { fontSize: 12.5, color: "#94a3b8", fontWeight: "700" },
  walletBalanceText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    marginVertical: 12,
  },
  walletFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletCardNumber: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  walletLabel: { fontSize: 15, fontWeight: "800", color: "#fff" },
  walletDecor: {
    position: "absolute",
    right: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    opacity: 0.12,
  },

  overviewRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 35,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
  },
  chartCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  chartPercent: { fontSize: 14.5, fontWeight: "900" },
  chartTextContainer: { marginTop: 16 },
  chartLabel: { fontSize: 12.5, color: "#94a3b8", fontWeight: "600" },
  chartAmount: {
    fontSize: 17.5,
    fontWeight: "900",
    color: "#fff",
    marginTop: 4,
  },

  reminderCard: {
    marginHorizontal: 24,
    backgroundColor: CARD_BG,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: SECONDARY + "35",
    marginBottom: 35,
  },
  reminderBadge: {
    position: "absolute",
    top: -12,
    left: 24,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  reminderBadgeText: { fontSize: 12, fontWeight: "900", color: "#0a0a0f" },
  reminderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  reminderTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  reminderSub: { fontSize: 13.5, color: "#94a3b8", marginTop: 4 },
  reminderDateBox: { alignItems: "flex-end" },
  reminderDate: { fontSize: 15, fontWeight: "800", color: "#fff" },
  reminderSAR: {
    fontSize: 16,
    fontWeight: "900",
    color: SECONDARY,
    marginTop: 4,
  },

  appCard: {
    marginHorizontal: 24,
    backgroundColor: CARD_BG,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: GLASS,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  appId: { fontSize: 14, fontWeight: "800" },
  appDate: { fontSize: 13, color: "#94a3b8" },
  appTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 18,
  },
  appDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  appLabel: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
  appValue: { fontSize: 16.5, fontWeight: "800", color: "#fff" },
  appStatus: { fontSize: 14, fontWeight: "800" },
  progressBar: {
    height: 7,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: { height: "100%", borderRadius: 10 },
  detailsBtn: {
    alignSelf: "center",
    paddingHorizontal: 34,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: GLASS,
  },
  detailsBtnText: { color: "#94a3b8", fontSize: 14.5, fontWeight: "700" },

  partnersRow: {
    paddingLeft: 24,
    marginBottom: 40,
  },
  partnerCard: {
    width: 120,
    alignItems: "center",
    marginRight: 20,
    backgroundColor: CARD_BG,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  partnerLogoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    padding: 10,
  },
  partnerLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  partnerName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  partnerType: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  warningCard: {
    width: "100%",
    backgroundColor: CARD_BG,
    borderRadius: 35,
    padding: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  warningIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  warningDesc: {
    fontSize: 15.5,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  tryAgainBtn: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: SECONDARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  tryAgainText: {
    fontSize: 17,
    fontWeight: "900",
  },
});
