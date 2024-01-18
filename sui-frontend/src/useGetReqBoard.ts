import { useSuiClientQuery } from '@mysten/dapp-kit';

export const useGetReqBoard = () => {
  const handleGetReqBoard = () => {
    const id: string =
      "0x8c619ab6e30bcd0322a63eef174587e04590a4dc62a5d605f7f2bec8228ce659";

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