export const Endpoints = {
  // Auth
  LOGIN: "/auth/login",
  GET_USER_BY_ID: (id) => `/admin/user/${id}`,
  UPDATE_PROFILE: "/admin/update-user",
  CHANGE_PASSWORD: "/admin/change-password",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Agent MANAGEMENT
  GET_AGENT: "/admin/commission-agent",
  CREATE_AGENT: "/admin/commission-agent",
  UPDATE_AGENT: (uid) => `/admin/commission-agent/${uid}`,
  DELETE_AGENT: (uid) => `/admin/commission-agent/${uid}?status=false`,
  GET_AGENT_BY_ID: (uid) => `/admin/commission-agent/${uid}`,

  GET_ROLES: "/admin/roles",

  // Vendor Management
  GET_SELLERS: "/admin/vendor",
  CREATE_SELLER: "/admin/seller",
  UPDATE_VENDOR: (uid) => `/admin/vendor/${uid}`,
  // DELETE_VENDOR: (uid) => `/admin/vendor/${uid}`,
  DELETE_VENDOR: (uid, status = false) =>
    `/admin/vendor/${uid}?status=${status}`,
  GET_VENDOR_BY_UID: (uid) => `/admin/vendor/${uid}`,
  GET_STATS: "/admin/vendor/stats",
  EXPORT_VENDORS: "/admin/vendor/export",

  // Animal Management
//   GET_ANIMALS: "/admin/animal",
//   CREATE_ANIMAL: "/admin/animal",
//   UPDATE_ANIMAL: (uid) => `/admin/animal/${uid}`,
//   DELETE_ANIMAL: (uid) => `/admin/animal/${uid}`,
//   GET_ANIMAL_BY_UID: (uid) => `/admin/animal/${uid}`,
//   EXPORT_ANIMALS: "/admin/animals/export",
//   GET_ANIMAL_STATS: "/admin/animals/stats",

//   VENDOR_DROPDOWN: "/admin/vendor-dropdown",
//   HOLDING_STATION_DROPDOWN: "/admin/holding-station-dropdown",

//   GET_PAYMENT: "/admin/payment",
//   CREATE_PAYMENT: "/admin/payment",
//   DELETE_PAYMENT: (uid) => `/admin/payment/${uid}`,
//   GET_PAYMENT_BY_ID: (uid) => `/admin/payment/${uid}`,
//   GET_ANIMAL_LIST_BY_VENDOR_ID: (uid) => `/admin/vendor-animal/${uid}`,
};
