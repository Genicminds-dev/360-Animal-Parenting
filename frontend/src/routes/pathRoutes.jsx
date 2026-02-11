// router/pathRoutes.js
export const PATHROUTES = {
  // Auth routes
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  
  // Dashboard
  dashboard: "/dashboard",
  
  // Procurement Routes
  agentRegistration: "/procurement/agent-registration",
  sellerRegistration: "/procurement/seller-registration", 
  animalRegistration: "/procurement/animal-registration",
  healthCheckUpList: "/procurement/health-checkUp-List",
  // healthCheckUpList: "/procurement/health-check",
  
  // Management Routes
  sellersList: "/management/sellers",
  sellerDetails: "/management/seller-details/:uid",
  editSeller: "/management/edit-seller/:uid",

  agentsList: "/management/commission-agents",
  agentDetails: "/management/agent-details/:uid",
  editAgent: "/management/edit-agent/:uid",
  animalsList: "/management/animals",
  animalDetails: "/management/animal-details/:uid",
  
  // Placeholder Routes
  transporters: "/transporters",
  suppliers: "/suppliers",
  beneficiaries: "/beneficiaries",
  team: "/team",
  reports: "/reports",
  settings: "/settings",

};