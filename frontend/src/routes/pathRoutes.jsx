// router/pathRoutes.js
export const PATHROUTES = {

  // // Procurement Routes
  // sellerRegistration: "/procurement/seller-registration",
  // animalRegistration: "/procurement/animal-registration",
  // healthCheckupList: "/procurement/health-checkup-List",
  // healthCheckupForm: "/health-checkup/form/:id",
  // healthCheckUpList: "/procurement/health-check",
  
  // // Management Routes
  // sellersList: "/management/sellers",
  // sellerDetails: "/management/seller-details/:uid",
  // editSeller: "/management/edit-seller/:uid",

  // // Placeholder Routes
  // commissionAgents: "/commission-agents",
  // transporters: "/transporters",
  // suppliers: "/suppliers",
  // agents: "/agents",
  // beneficiaries: "/beneficiaries",
  // team: "/team",
  // reports: "/reports",

  // // Animal Procurement old
  // AnimalRegistration: "/animal-registration",
  // editanimalProcurement: "/edit-animal-details",
  // animalProcuredList: "/animal-list",
  // animalProcurementView: "/view-animal-details",




/*********** Latest Path Routes************/

  // Auth routes
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  // Dashboard
  dashboard: "/dashboard",

  // Animal Procurement
  animalProcurement: "/animal-procurement",

  // Batch Management
  animalBatches : "/animal-batches",
  
  // Procured Animals
  procuredAnimals: "/procured-animals",
  animalDetails: "/animal-details",
  editAnimal: "/edit-animal",

  // beneficiary Routes
  beneficiaryList: "/beneficiary",
  addBeneficiary: "/add-beneficiary",
  editBeneficiary: "/edit-beneficiary",
  beneficiaryDetails: "/beneficiary-details",
  
  // Handover Routes
  handoverList: "/handover",
  addHandover: "/add-handover",
  editHandover: "/edit-handover",
  handoverDetails: "/handover-details",

  //Broker Registration
  brokerRegistration: "/broker-registration",
  brokerList: "/brokers",
  brokerDetails: "/broker-details",
  editBroker: "/edit-broker",

  // scheme Management
  schemeList: "/manage-schemes",
  addScheme: "/add-scheme",
  editScheme: "/edit-scheme",

  // User Management
  userList: "/manage-users",
  addUsers: "/add-user",
  editUsers: "/edit-user",
  viewUsers: "/view-user",
  
  //Setting
  settings: "/settings",
};