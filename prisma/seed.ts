import { PrismaClient, Role, CustomerStatus, OpportunityStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FlowTech CRM complete prototype database with real person avatars...');

  // 1. Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flowtech.com' },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      avatar: '/avatars/user1.jpg',
    },
    create: {
      email: 'admin@flowtech.com',
      password: hashedPassword,
      name: 'Shirley.H',
      role: Role.ADMIN,
      avatar: '/avatars/user1.jpg',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Metric Summary
  await prisma.metricSummary.deleteMany({});
  await prisma.metricSummary.create({
    data: {
      totalRevenue: 82340,
      totalRevenueInc: 1.24,
      totalQuantity: 3734,
      totalQuantityInc: -0.24,
      numberOrders: 5532,
      numberOrdersInc: 0.91,
      averageOrderValue: 14.88,
      averageOrderValueInc: 1.02,
      customerCount: 4982,
      customerCountInc: -0.92,
    },
  });
  console.log('Metric summary seeded.');

  // 3. Sales Team Members (With Real Person Avatars)
  await prisma.salesTeamMember.deleteMany({});
  await prisma.salesTeamMember.createMany({
    data: [
      { name: 'Shirley.H', avatar: '/avatars/user1.jpg', revenue: 719, orders: 39, conversionRate: 86 },
      { name: 'GlobalMart', avatar: '/avatars/user2.jpg', revenue: 684, orders: 35, conversionRate: 75 },
      { name: 'Bright Solutions', avatar: '/avatars/user3.jpg', revenue: 643, orders: 32, conversionRate: 36 },
      { name: 'Tech Innovations', avatar: '/avatars/user4.jpg', revenue: 533, orders: 29, conversionRate: 75 },
      { name: 'Blue Horizon', avatar: '/avatars/user5.jpg', revenue: 521, orders: 34, conversionRate: 86 },
    ],
  });

  // 4. Task Completion Data (With Real Person Avatars)
  await prisma.taskCompletion.deleteMany({});
  await prisma.taskCompletion.createMany({
    data: [
      { companyName: 'GlobalMart', avatar: '/avatars/user2.jpg', completed: 34, inProgress: 7 },
      { companyName: 'Tech Innovations', avatar: '/avatars/user4.jpg', completed: 31, inProgress: 5 },
      { companyName: 'Bright Solutions', avatar: '/avatars/user3.jpg', completed: 24, inProgress: 9 },
      { companyName: 'Alpha Solutions', avatar: '/avatars/user6.jpg', completed: 21, inProgress: 3 },
      { companyName: 'Prime Goods', avatar: '/avatars/user7.jpg', completed: 20, inProgress: 6 },
      { companyName: 'BestBuyer', avatar: '/avatars/user8.jpg', completed: 18, inProgress: 10 },
      { companyName: 'Shirley.H', avatar: '/avatars/user1.jpg', completed: 16, inProgress: 2 },
      { companyName: 'Blue Horizon', avatar: '/avatars/user5.jpg', completed: 12, inProgress: 7 },
      { companyName: 'Quick Solutions', avatar: '/avatars/user9.jpg', completed: 9, inProgress: 9 },
      { companyName: 'Wise Shoppers', avatar: '/avatars/user10.jpg', completed: 7, inProgress: 3 },
    ],
  });

  // 5. Customers List
  await prisma.customer.deleteMany({});
  await prisma.customer.createMany({
    data: [
      { customerNo: '13846', name: 'Bright Solutions', email: 'bright@example.com', region: 'North America', source: 'Online', status: CustomerStatus.Loyal, lastPurchase: new Date('2024-04-14') },
      { customerNo: '98745', name: 'GlobalMart', email: 'info@globalmart.com', region: 'Europe', source: 'Retail', status: CustomerStatus.Loyal, lastPurchase: new Date('2024-05-01') },
      { customerNo: '34972', name: 'Tech Innovations', email: 'tech@innovate.com', region: 'Asia Pacific', source: 'Online', status: CustomerStatus.Loyal, lastPurchase: new Date('2024-04-17') },
      { customerNo: '29373', name: 'Blue Horizon', email: 'horizon@gmail.com', region: 'Europe', source: 'Online', status: CustomerStatus.New, lastPurchase: new Date('2024-03-29') },
      { customerNo: '48759', name: 'BestBuyer', email: 'tbuyer@hotmail.com', region: 'North America', source: 'Online', status: CustomerStatus.New, lastPurchase: new Date('2024-06-11') },
    ],
  });

  // 6. Sales Opportunities
  await prisma.opportunity.deleteMany({});
  await prisma.opportunity.createMany({
    data: [
      { opportunityNo: '110', name: 'Project Theta', status: OpportunityStatus.Pending, revenue: 23000, expCloseDate: new Date('2024-04-14'), customerName: 'Tau Corporation', ownerName: 'Lucy Tan', notes: 'Proposal submitted' },
      { opportunityNo: '111', name: 'Deal Beta', status: OpportunityStatus.Won, revenue: 25000, expCloseDate: new Date('2024-05-01'), customerName: 'Tau Corporation', ownerName: 'Lucy Tan', notes: 'Deal Finalized' },
      { opportunityNo: '112', name: 'Project Omega', status: OpportunityStatus.InProgress, revenue: 14000, expCloseDate: new Date('2024-04-17'), customerName: 'Pi Enterprises', ownerName: 'Andy Chen', notes: 'Discussing terms' },
      { opportunityNo: '113', name: 'Deal Gamma', status: OpportunityStatus.Lost, revenue: 0, expCloseDate: new Date('2024-03-29'), customerName: 'Xi Group', ownerName: 'Mary Foo', notes: 'Decision postponed' },
      { opportunityNo: '114', name: 'Deal Alpha', status: OpportunityStatus.Pending, revenue: 22000, expCloseDate: new Date('2024-06-11'), customerName: 'Lambda Ltd', ownerName: 'Andy Chen', notes: 'Budget constraints' },
      { opportunityNo: '115', name: 'Project Theta II', status: OpportunityStatus.Pending, revenue: 23000, expCloseDate: new Date('2024-04-14'), customerName: 'Tau Corporation', ownerName: 'Lucy Tan', notes: 'Proposal submitted' },
      { opportunityNo: '116', name: 'Deal XYZ', status: OpportunityStatus.Pending, revenue: 53000, expCloseDate: new Date('2024-05-24'), customerName: 'Delta Industries', ownerName: 'Peter Wu', notes: 'Send follow-up email' },
      { opportunityNo: '117', name: 'Project Iota', status: OpportunityStatus.InProgress, revenue: 13000, expCloseDate: new Date('2024-07-10'), customerName: 'Iota Corporation', ownerName: 'Lucy Tan', notes: 'Sent follow-up email' },
      { opportunityNo: '118', name: 'Deal XYZ II', status: OpportunityStatus.InProgress, revenue: 16000, expCloseDate: new Date('2024-04-14'), customerName: 'Big Company Ltd', ownerName: 'Peter Wu', notes: 'Proposal submitted' },
    ],
  });

  // 7. Initial Clients
  await prisma.client.deleteMany({});
  await prisma.client.createMany({
    data: [
      { name: 'Tau Corporation', industry: 'Technology', region: 'North America', tier: 'Enterprise Tier 1' },
      { name: 'Pi Enterprises', industry: 'Manufacturing', region: 'Europe', tier: 'Mid-Market' },
      { name: 'GlobalMart Inc.', industry: 'Retail & E-commerce', region: 'Europe', tier: 'Enterprise Tier 1' },
      { name: 'Delta Industries', industry: 'Logistics & Supply', region: 'Asia Pacific', tier: 'Mid-Market' },
    ],
  });
  console.log('Clients seeded.');

  console.log('Prototype database seeded with real person avatars successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
