import { useSuiClientQuery } from '@mysten/dapp-kit';

export const useGetReqBoard = () => {
  const handleGetReqBoard = () => {
    const id: string =
      "0x397958187cf47b9632944fc6e81ca999a2c51a0d5a3fd3e2904d580d45920c17";

    const { data, isLoading, error, refetch } = useSuiClientQuery("getObject", {
      id,
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    return { data, isLoading, error, refetch };
  };

  return { handleGetReqBoard };
};