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
  
  // Placeholder Routes
  commissionAgents: "/commission-agents",
  animals: "/animals",
  transporters: "/transporters",
  suppliers: "/suppliers",
  agents: "/agents",
  beneficiaries: "/beneficiaries",
  team: "/team",
  reports: "/reports",
  settings: "/settings",

    agentsList: "/management/commission-agents",
  animalsList: "/management/animals",
  animalDetails: "/management/animal-details/:uid",


};