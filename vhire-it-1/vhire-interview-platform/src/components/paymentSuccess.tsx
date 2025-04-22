import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const email = params.get('email');
  const interviewId = params.get('interviewId');

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await axios.get('http://localhost:5001/check-payment-status', {
          params: { email, interviewId },
        });
        alert(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    checkPayment();
  }, [email, interviewId]);

  return (
    <div className="p-5 text-center">
      <h2>Verifying your payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
