import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import InvoicesPage from "../pages/invoices/InvoicesPage";
import NotFoundPage from "../pages/NotFoundPage";
const AddInvocePage = lazy(()=>import("../pages/invoices/AddEditInvocePage"));
const AccountStatements = lazy(()=>import("../pages/accountStatements/AccountStatements"));
const AddAccountStatement = lazy(()=>import("../pages/accountStatements/AddAccountStatement"));
const AccountStatementDetails = lazy(()=>import("../pages/accountStatements/AccountStatementDetails"));
const ApartmentDetails = lazy(()=>import("../pages/apartments/ApartmentDetails"));
const AddEditApartment = lazy(()=>import("../pages/apartments/AddEditApartment"));
const AddEditInvocePage = lazy(()=>import("../pages/invoices/AddEditInvocePage"));
import PaymentsAndPatches from "../pages/paymentsAndPatches/PaymentsAndPatches";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const SuspenseWrapper = ({children}:{children:React.ReactNode}) => {
  return <Suspense fallback={<Spin size="large" tip="Loading" fullscreen />}>{children}</Suspense>
}

const RouterContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/account-statement/add-account" />} />
      <Route path="/invoices" element={<Layout />}>
        <Route path="" element={<InvoicesPage />} />
        <Route path="add-invoice" element={<AddInvocePage />} />
      </Route>
      {/* <Route path="/customers" element={<Layout />}>
        <Route path="" element={<CustomersPage />} />
        <Route path="add-customer" element={<AddCustomerPage />} />
        <Route path="edit-customer/:id" element={<AddCustomerPage />} />
      </Route> */}
      <Route path="/account-statement" element={<Layout />}>
        <Route path="" element={<SuspenseWrapper><AccountStatements /></SuspenseWrapper>} />
        <Route path=":id" element={<SuspenseWrapper><AccountStatementDetails /></SuspenseWrapper>} />
        <Route path=":id/apartment/:apartmentId" element={<ApartmentDetails />} />
        <Route path=":id/add-apartment" element={<AddEditApartment />} />
        <Route path=":id/edit-apartment/:apartmentId" element={<AddEditApartment />} />
        <Route path=":id/apartment/:apartmentId/add-invoice" element={<AddEditInvocePage />} />
        <Route path=":id/apartment/:apartmentId/edit-invoice/:invoiceId" element={<AddEditInvocePage />} />
        <Route path="add-account" element={<SuspenseWrapper><AddAccountStatement /></SuspenseWrapper>} />
        <Route path="edit-account/:id" element={<SuspenseWrapper><AddAccountStatement /></SuspenseWrapper>} />
      </Route>
      <Route path="/payments-and-patches" element={<Layout />}>
      <Route path="" element={<PaymentsAndPatches />} />
      <Route path=":id/apartment/:apartmentId/add-invoice" element={<AddEditInvocePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RouterContainer;
