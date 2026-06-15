import sys

file_path = 'e:\\Finsol\\edge_finance-\\app\\(tabs)\\dashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace loading and error gradient blocks
content = content.replace(
'''        <LinearGradient
          colors={[BACKGROUND, "#0f172a", BACKGROUND]}
          style={StyleSheet.absoluteFill}
        />''', ''
)

# Find the start of the return block
start_idx = content.find('  return (\n    <View style={styles.container}>')
if start_idx == -1:
    print('Could not find start of return block')
    sys.exit(1)

# The new return block and styles
new_tail = '''  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

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
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="menu" size={32} color={PRIMARY} />
            </TouchableOpacity>

            <View style={styles.headerLogo}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={{ width: 140, height: 45, resizeMode: 'contain' }} 
              />
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={PRIMARY} />
              {header.NEWNOTIFICATIONS && <View style={styles.notifBadge} />}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.helloText}>Hello {displayName}</Text>
              <Text style={styles.morningText}>{header.GREETINGS || "Good Morning"}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image
                source={header.USERPIC ? { uri: `data:image/${header.USERPICFORMAT || 'jpeg'};base64,${header.USERPIC}` } : { uri: "https://i.pravatar.cc/150?u=edge" }}
                style={styles.avatar}
              />
            </View>
          </View>

          {/* Active Loan Status */}
          {activeContract ? (
            <View style={styles.activeLoanCard}>
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
                  <Text style={[styles.activeValue, { color: PRIMARY }]}>SAR {activeContract.INSTALLMENTAMOUNT?.toLocaleString() || "0"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noLoanCardPremium}>
              <Ionicons name="cash-outline" size={36} color={TEXT_SECONDARY} />
              <Text style={styles.noLoanTitle}>No active loan</Text>
            </View>
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
                  <View style={styles.financeIconCircle}>
                    {hasIcon ? (
                      <Image
                        source={{ uri: `${details}${item.PRODUCTBUTTONICON}` }}
                        style={{ width: 34, height: 34, resizeMode: 'contain', tintColor: PRIMARY }}
                      />
                    ) : (
                      <Ionicons name="cash-outline" size={30} color={PRIMARY} />
                    )}
                  </View>
                  <Text style={styles.financeItemText}>
                    {item.PRODUCTBUTTONTEXT}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Special Offers (Converted to vertical swipable cards to match mock) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promoRow}
          >
            {dashboardData?.SLIDE_SHOW?.length > 0 ? (
              dashboardData.SLIDE_SHOW.map((slide: any, index: number) => {
                const hasImg = !!slide.SLIDEIMAGE;
                return (
                  <View key={index} style={styles.promoCard}>
                    <View style={styles.promoIconPlaceholder}>
                      <Ionicons name="cash-outline" size={40} color={PRIMARY} />
                    </View>
                    <Text style={styles.promoDesc}>{slide.TITLETEXT || "Get Instant"}</Text>
                    <Text style={styles.promoTitle}>{slide.BODYTEXT || "Finance for..."}</Text>
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
                      <Text style={styles.promoApplyBtnText}>{slide.BUTTONTEXT || "Apply Now"}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <>
                <View style={styles.promoCard}>
                  <View style={styles.promoIconPlaceholder}>
                    <Ionicons name="cash-outline" size={40} color={PRIMARY} />
                  </View>
                  <Text style={styles.promoDesc}>Get Instant</Text>
                  <Text style={styles.promoTitle}>loan of up to{"\\n"}<Text style={styles.promoAmountText}>SAR 25,000</Text></Text>
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
                    <Text style={styles.promoApplyBtnText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.promoCard}>
                  <View style={styles.promoIconPlaceholder}>
                    <Ionicons name="home-outline" size={40} color={PRIMARY} />
                  </View>
                  <Text style={styles.promoDesc}>Get Instant</Text>
                  <Text style={styles.promoTitle}>Finance for...</Text>
                  <TouchableOpacity 
                    style={styles.promoApplyBtn}
                    onPress={() => {
                      router.push('/personal-finance');
                    }}
                  >
                    <Text style={styles.promoApplyBtnText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>

          {/* Application Tracker */}
          {dashboardData?.CURRENT_APPLICATIONS?.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Application Tracker</Text>
              </View>
              {renderApplications()}
            </>
          )}

          {/* Padding for bottom nav */}
          <View style={{ height: 80 }} />

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
            <View style={styles.warningIconCircle}>
              <Ionicons 
                name={activeNotification?.ISFACEIDNOTIFICATION ? "finger-print-outline" : "notifications-outline"} 
                size={50} 
                color={PRIMARY} 
              />
            </View>
            <Text style={styles.warningTitle}>{activeNotification?.MESSAGETITLE || "Alert"}</Text>
            <Text style={styles.warningDesc}>
              {activeNotification?.MESSAGETEXT || "No message content available."}
            </Text>
            
            <TouchableOpacity 
              style={styles.tryAgainBtn}
              onPress={() => {
                setShowNotification(false);
                if (activeNotification?.SCREENADDRESS) {
                  router.push(activeNotification.SCREENADDRESS as any);
                }
              }}
            >
              <Text style={styles.tryAgainText}>
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BACKGROUND },
  loadingText: { color: TEXT_SECONDARY, fontSize: 16, fontWeight: "600", marginTop: 15 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BACKGROUND, paddingHorizontal: 30 },
  errorText: { color: TEXT_MAIN, fontSize: 22, fontWeight: "900", marginTop: 20, marginBottom: 8 },
  errorSubText: { color: TEXT_SECONDARY, fontSize: 15, textAlign: "center", marginBottom: 30, lineHeight: 22 },
  retryBtn: { backgroundColor: PRIMARY, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 18 },
  retryBtnText: { color: WHITE, fontSize: 16, fontWeight: "900" },
  
  scrollContent: { paddingBottom: 30, paddingTop: 10 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, paddingTop: 20, marginBottom: 30 },
  menuBtn: { justifyContent: "center", alignItems: "center" },
  headerLogo: { flex: 1, alignItems: "center" },
  notificationBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY + '15', justifyContent: "center", alignItems: "center" },
  notifBadge: { position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: "#ef4444", borderWidth: 2, borderColor: WHITE },
  
  greetingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, marginBottom: 30 },
  helloText: { fontSize: 18, color: PRIMARY, fontWeight: "500", lineHeight: 24 },
  morningText: { fontSize: 24, fontWeight: "600", color: PRIMARY, marginTop: 2, lineHeight: 30 },
  avatarContainer: { position: "relative" },
  avatar: { width: 64, height: 64, borderRadius: 32 },

  noLoanCardPremium: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: WHITE, marginHorizontal: 24, paddingVertical: 24, borderRadius: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 35, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  noLoanTitle: { fontSize: 18, fontWeight: "500", color: "#9CA3AF", marginLeft: 15 },
  
  activeLoanCard: { backgroundColor: WHITE, marginHorizontal: 24, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: PRIMARY, marginBottom: 35, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  activeLoanHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  activeIconContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeStatusText: { fontSize: 15, fontWeight: "800", textTransform: "uppercase" },
  contractNo: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: "700" },
  activeLoanDetails: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  activeLabel: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: "600", marginBottom: 6 },
  activeValue: { fontSize: 20, fontWeight: "900", color: TEXT_MAIN },

  financeOptionsRow: { paddingLeft: 24, marginBottom: 40 },
  financeItem: { alignItems: "center", marginRight: 20, width: 75 },
  financeIconCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 1.5, borderColor: PRIMARY, justifyContent: "center", alignItems: "center", backgroundColor: WHITE, marginBottom: 10 },
  financeItemText: { fontSize: 9, color: TEXT_SECONDARY, fontWeight: "600", textAlign: "center", textTransform: "uppercase", lineHeight: 12 },

  sectionTitle: { fontSize: 20, fontWeight: "800", color: TEXT_MAIN, paddingHorizontal: 24, marginBottom: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 14 },
  
  promoRow: { paddingLeft: 24, marginBottom: 40 },
  promoCard: { width: 220, borderRadius: 16, padding: 24, marginRight: 16, backgroundColor: WHITE, borderWidth: 1.5, borderColor: PRIMARY },
  promoIconPlaceholder: { width: 50, height: 50, justifyContent: "center", alignItems: "flex-start", marginBottom: 16 },
  promoDesc: { fontSize: 14, color: TEXT_SECONDARY, marginBottom: 4, fontWeight: "600" },
  promoTitle: { fontSize: 20, color: TEXT_MAIN, fontWeight: "800", marginBottom: 16 },
  promoAmountText: { fontSize: 24, fontWeight: "900", color: PRIMARY },
  promoApplyBtn: { borderRadius: 12, borderWidth: 1.5, borderColor: PRIMARY, paddingVertical: 12, alignItems: "center", justifyContent: "center", marginTop: 10 },
  promoApplyBtnText: { color: PRIMARY, fontWeight: "700", fontSize: 15 },

  appCard: { marginHorizontal: 24, backgroundColor: WHITE, borderRadius: 16, padding: 22, borderWidth: 1, borderColor: BORDER, marginBottom: 16 },
  appHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  appId: { fontSize: 14, fontWeight: "800" },
  appDate: { fontSize: 13, color: TEXT_SECONDARY },
  appTitle: { fontSize: 19, fontWeight: "800", color: TEXT_MAIN, marginBottom: 18 },
  appDetailsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  appLabel: { fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 },
  appValue: { fontSize: 16.5, fontWeight: "800", color: TEXT_MAIN },
  appStatus: { fontSize: 14, fontWeight: "800" },
  progressBar: { height: 7, backgroundColor: "#E5E7EB", borderRadius: 10, overflow: "hidden", marginBottom: 20 },
  progressFill: { height: "100%", borderRadius: 10 },
  detailsBtn: { alignSelf: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: PRIMARY },
  detailsBtnText: { color: WHITE, fontSize: 14, fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 30 },
  warningCard: { width: "100%", backgroundColor: WHITE, borderRadius: 24, padding: 30, alignItems: "center" },
  warningIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: PRIMARY + '20', justifyContent: "center", alignItems: "center", marginBottom: 20 },
  warningTitle: { fontSize: 24, fontWeight: "800", color: TEXT_MAIN, marginBottom: 15, textAlign: "center" },
  warningDesc: { fontSize: 15, color: TEXT_SECONDARY, textAlign: "center", lineHeight: 24, marginBottom: 30 },
  tryAgainBtn: { width: "100%", height: 56, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: "center", alignItems: "center" },
  tryAgainText: { fontSize: 16, fontWeight: "700", color: WHITE },
});
'''

# Slice the content
new_content = content[:start_idx] + new_tail

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Dashboard UI updated successfully.')
