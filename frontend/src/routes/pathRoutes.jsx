// router/pathRoutes.js
export const PATHROUTES = {
  // Auth routes
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  // Dashboard
  dashboard: "/dashboard",

  // User Management
  userList: "/manage-users",
  addUsers: "/add-user",
  editUsers: "/edit-user",
  viewUsers: "/view-user",

    // scheme Management
  schemeList: "/manage-schemes",
  // addUsers: "/add-user",
  // editUsers: "/edit-user",
  // viewUsers: "/view-user",
 
  // Handover Routes
  handoverList: "/management/handover",

  // Procurement Routes
  sellerRegistration: "/procurement/seller-registration",
  animalRegistration: "/procurement/animal-registration",
  healthCheckupList: "/procurement/health-checkup-List",
  healthCheckupForm: "/health-checkup/form/:id",
  // healthCheckUpList: "/procurement/health-check",
  
  // Management Routes
  sellersList: "/management/sellers",
  sellerDetails: "/management/seller-details/:uid",
  editSeller: "/management/edit-seller/:uid",
  
  brokerRegistration: "/broker-registration",
  brokerList: "/brokers",
  brokerDetails: "/broker-details/:uid",
  editBroker: "/edit-broker/:uid",

  animalsList: "/management/animals",
  animalDetails: "/management/animal-details/:uid",
  editAnimal: "/management/edit-animal/:uid",

  // Placeholder Routes
  commissionAgents: "/commission-agents",
  transporters: "/transporters",
  suppliers: "/suppliers",
  agents: "/agents",
  beneficiaries: "/beneficiaries",
  team: "/team",
  reports: "/reports",


  settings: "/settings",





  animalProcurement: "/animal-registration",
  editanimalProcurement: "/edit-animal-details",
  animalProcuredList: "/animal-list",
  animalProcurementView: "/view-animal-details"

};