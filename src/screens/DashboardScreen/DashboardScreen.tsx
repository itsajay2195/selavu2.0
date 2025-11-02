import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from '../../components/IconComponent';
const DashboardScreen = () => {
  const [spending, setSpending] = useState(0);
  const [transactions1, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for transactions
  const transactions = [
    {id: '1', name: 'Swiggy', category: 'Food', amount: -340, time: '2h ago'},
    {
      id: '2',
      name: 'Salary Credited',
      category: 'Income',
      amount: 50000,
      time: 'Yesterday',
    },
    {
      id: '3',
      name: 'Amazon',
      category: 'Shopping',
      amount: -2499,
      time: '2d ago',
    },
  ];

  const renderHeader = () => (
    <>
      {/* Header with Gradient - Part of scrollable content */}
      <LinearGradient
        colors={['#6366f1', '#a855f7']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientHeader}>
        {/* Total Balance Section */}
        <View style={styles.balanceSection}>
          <View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>₹45,280</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Icon
              library={'Ionicons'}
              name="notifications-outline"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>₹18,450</Text>
            <Text style={styles.statSubtext}>↓ 12% vs last month</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Budget Left</Text>
            <Text style={styles.statValue}>₹6,550</Text>
            <Text style={styles.statSubtext}>74% used</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions - Overlapping */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="receipt-outline"
              label="Bills"
              color="#dbeafe"
              iconColor="#2563eb"
            />
            <QuickAction
              icon="pricetag-outline"
              label="Offers"
              color="#d1fae5"
              iconColor="#059669"
            />
            <QuickAction
              icon="card-outline"
              label="Cards"
              color="#e9d5ff"
              iconColor="#9333ea"
            />
            <QuickAction
              icon="calendar-outline"
              label="Budget"
              color="#fed7aa"
              iconColor="#ea580c"
            />
          </View>
        </View>
      </View>

      {/* Upcoming Bills */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.billsContainer}>
          <BillCard
            name="Electricity Bill"
            amount="₹1,200"
            dueDate="Due in 2 days"
            bgColor="#fef3c7"
            borderColor="#fbbf24"
          />
          <BillCard
            name="Credit Card Payment"
            amount="₹15,430"
            dueDate="Due tomorrow"
            bgColor="#fee2e2"
            borderColor="#ef4444"
          />
        </View>
      </View>

      {/* Recent Transactions Header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
    </>
  );

  const renderTransaction = ({item}: any) => (
    <TransactionItem
      name={item.name}
      category={item.category}
      amount={item.amount}
      time={item.time}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const QuickAction = ({icon, label, color, iconColor}: any) => (
  <TouchableOpacity style={styles.quickActionItem}>
    <View style={[styles.quickActionIcon, {backgroundColor: color}]}>
      <Icon library={'Ionicons'} name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const BillCard = ({name, amount, dueDate, bgColor, borderColor}: any) => (
  <View style={[styles.billCard, {backgroundColor: bgColor, borderColor}]}>
    <View>
      <Text style={styles.billName}>{name}</Text>
      <Text style={styles.billDueDate}>{dueDate}</Text>
    </View>
    <Text style={styles.billAmount}>{amount}</Text>
  </View>
);

const TransactionItem = ({name, category, amount, time}: any) => (
  <View style={styles.transactionItem}>
    <View>
      <Text style={styles.transactionName}>{name}</Text>
      <Text style={styles.transactionMeta}>
        {category} • {time}
      </Text>
    </View>
    <Text
      style={[styles.transactionAmount, amount > 0 && styles.positiveAmount]}>
      {amount > 0 ? '+' : ''}₹{Math.abs(amount).toLocaleString()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flatListContent: {
    paddingBottom: 20,
  },

  // Gradient Header (scrollable)
  gradientHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 96, // Extra padding for overlapping card
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  bellButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 12,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },

  // Quick Actions (overlapping)
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginTop: -64, // Overlap with gradient
    marginBottom: 24,
  },
  quickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionItem: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllButton: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },

  // Bills
  billsContainer: {
    gap: 12,
  },
  billCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  billAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },

  // Transactions
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 13,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  positiveAmount: {
    color: '#10b981',
  },
});

export default DashboardScreen;
