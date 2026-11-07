import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

const InvoicesPage = lazy(() => import("../pages/invoices/InvoicesPage"));
const AddEditInvocePage = lazy(
  () => import("../pages/invoices/AddEditInvocePage")
);
const AccountStatements = lazy(
  () => import("../pages/accountStatements/AccountStatements")
);
const AddAccountStatement = lazy(
  () => import("../pages/accountStatements/AddAccountStatement")
);
const AccountStatementDetails = lazy(
  () => import("../pages/accountStatements/AccountStatementDetails")
);
const ApartmentDetails = lazy(
  () => import("../pages/apartments/ApartmentDetails")
);
const AddEditApartment = lazy(
  () => import("../pages/apartments/AddEditApartment")
);
const PaymentsAndPatches = lazy(
  () => import("../pages/paymentsAndPatches/PaymentsAndPatches")
);
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const Layout = () => {
  return <Outlet />;
};

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center py-20 min-h-[300px] w-full gap-3">
          <Spin size="large" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
            جاري التحميل...
          </span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export const RouterContainer = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/account-statement/add-account" replace />}
      />

      {/* Invoices */}
      <Route path="/invoices" element={<Layout />}>
        <Route
          path=""
          element={
            <SuspenseWrapper>
              <InvoicesPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="add-invoice"
          element={
            <SuspenseWrapper>
              <AddEditInvocePage />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* Account Statements */}
      <Route path="/account-statement" element={<Layout />}>
        <Route
          path=""
          element={
            <SuspenseWrapper>
              <AccountStatements />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id"
          element={
            <SuspenseWrapper>
              <AccountStatementDetails />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/apartment/:apartmentId"
          element={
            <SuspenseWrapper>
              <ApartmentDetails />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/add-apartment"
          element={
            <SuspenseWrapper>
              <AddEditApartment />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/edit-apartment/:apartmentId"
          element={
            <SuspenseWrapper>
              <AddEditApartment />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/apartment/:apartmentId/add-invoice"
          element={
            <SuspenseWrapper>
              <AddEditInvocePage />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/apartment/:apartmentId/edit-invoice/:invoiceId"
          element={
            <SuspenseWrapper>
              <AddEditInvocePage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="add-account"
          element={
            <SuspenseWrapper>
              <AddAccountStatement />
            </SuspenseWrapper>
          }
        />
        <Route
          path="add-account/:id"
          element={
            <SuspenseWrapper>
              <AddAccountStatement />
            </SuspenseWrapper>
          }
        />
        <Route
          path="edit-account/:id"
          element={
            <SuspenseWrapper>
              <AddAccountStatement />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* Payments and Patches */}
      <Route path="/payments-and-patches" element={<Layout />}>
        <Route
          path=""
          element={
            <SuspenseWrapper>
              <PaymentsAndPatches />
            </SuspenseWrapper>
          }
        />
        <Route
          path=":id/apartment/:apartmentId/add-invoice"
          element={
            <SuspenseWrapper>
              <AddEditInvocePage />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
};

export default RouterContainer;
