import { Outlet } from 'react-router-dom';
import CheckoutHeader from '../checkout/CheckoutHeader.jsx';
import CheckoutFooter from '../checkout/CheckoutFooter.jsx';

function CheckoutLayout() {
  return (
    <>
      <CheckoutHeader />
      <Outlet />
      <CheckoutFooter />
    </>
  );
}

export default CheckoutLayout;
