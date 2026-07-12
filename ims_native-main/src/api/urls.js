const baseUrl = "http://192.168.43.60:8080"



const serverUrl = {
  baseUrl: baseUrl,
  invoiceApi:
    baseUrl + "/api/generateBillPdf/",

    //sales
    getSales: "/api/getTotalSalesCount",
    getSalesByDate: "/api/getSalesByDate",
    getTopSellingProducts: "/api/getTopSellingProducts",
    getTotalDeliveryProducts: "/api/getTotalDeliveryProducts",
    getSalesByMonth: "/api/getSalesByMonth/",
    getOrderQuantityByMonth: "/api/getOrderQuantityByMonth/",

    //profile
    getGodownHead: '/api/getGodownHead',
    updateGodownHead: '/api/updateGodownHead',
    updatePassword: '/api/updatePassword',
    getGodownHeadByGodownId: '/api/getGodownHeadByGodownId',

    //products

    getAllProducts: '/api/listAllProducts',
    addProduct: '/api/addProduct',
    updateProduct: '/api/updateProduct',
    singleProduct: '/api/getAllProduct',

    getGodownProducts: '/api/listProducts/',

  //supplier
  createSupplier: "/api/createSupplier",
  createCustomer: "/api/createCustomer",
  createGodown: "/api/createGodown",
  createGodownhead: "/api/register",
  updateSupplier: "/api/updateSuppliers",
  getAllSuppliers: "/api/getAllSuppliers",

  //delivery
  getAllDelivery: "/api/getDeliveryOrders",
  getDeliveryOrdersById: "/api/getDeliveryOrdersById/",
  downloadInvoice: "/api/generateBillPdf/",
  placeOrder: "/api/placeOrder/",
  getDeliveryOrdersByGodownId: "/api/getDeliveryOrdersByGodownId/",

    //purchase
    getAllPurchase: '/api/getAllPurchaseOrders',
    getPurchaseOrderByPurchaseId: 'api/getPurchaseOrderByPurchaseId',
    getPurchaseProductCountBygodownId: '/api/getPurchasedProductsCountByGodownId/',
    getPurchaseProductsCount: '/api/getPurchasedProductsCount',

    //customers
    getAllCustomers: '/api/getAllCustomers',
    getCustomerById: 'api/getCustomerById',
    updateCustomer: 'api/updateCustomerById',

  //login
  login: "api/login",
  sendOtp: "/api/sendOtp",
  resetPassword: "/api/resetpassword",
  verifyOtp: "/api/verifyotp",
  loginWithOtp: "/api/loginWithOtp",

    //logout
    logout: '/api/logout',

    //admin
    getAllGodown: '/api/getAllGodown',
    getDeliveryOrders: '/api/getDeliveryOrders',

    //Details
    getPurchaseDetails: '/api/getPurchaseOrderByPurchaseId',
    getDeliveryDetails: '/api/getDeliveryOrdersById',
    getGodownDetails: '/api/getGodown',
    getCapacity: '/api/getCapacity/',
    getGodwnCount: '/api/getGodwnCount',
    getGH:'/api/getGodownHead/',
    getGodownHeadDetails :'/api/getGodownHead/',
    // Purchase Order
    createPurchaseOrder: '/api/createPurchaseOrder',
    getSalesByWeek: '/api/getSalesByWeek',

}

export default serverUrl;