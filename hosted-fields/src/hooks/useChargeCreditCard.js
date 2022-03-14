import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useHistory } from 'react-router-dom';
import CHARGECREDITCARD_VARIABLES from '../gql-variables/chargeCreditCard.json';

const useChargeCreditCard = () => {
  const history = useHistory();
  const [chargeCreditCard] = useMutation(loader('../gql/chargeCreditCard.gql'), {
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
    const variables = Object.assign({}, CHARGECREDITCARD_VARIABLES);
    variables.input.paymentMethodId = nonce;
    chargeCreditCard({
      variables,
    });
  };
};

export default useChargeCreditCard;
