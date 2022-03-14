import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useHistory } from 'react-router-dom';
import CHARGEPAYPALACCOUNT_VARIABLES from '../gql-variables/chargePayPalAccount.json';

const useChargePayPalAccount = () => {
  const history = useHistory();
  const [chargePayPalAccount] = useMutation(loader('../gql/chargePayPalAccount.gql'), {
    onCompleted: (data) => {
      console.log(data);
      history.push('/paymentResult', { data });
    },
    onError: (error) => {
      console.error(error);
      history.push('/paymentResult', { error });
    },
  });

  return (nonce) => {
    // generate variables
    const variables = Object.assign({}, CHARGEPAYPALACCOUNT_VARIABLES);
    variables.input.paymentMethodId = nonce;
    chargePayPalAccount({
      variables,
    });
  };
};

export default useChargePayPalAccount;
