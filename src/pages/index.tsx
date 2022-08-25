import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { Card, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type PaginateImgs = {
  data: Card[];
  after: null | string;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginateImgs>(
    'images',
    async () => {
      const { data: axiosRes } = await api.get<PaginateImgs>('/api/images', {
        params: {
          after: '',
        },
      });

      return {
        data: axiosRes.data,
        after: axiosRes.after,
      };
    },
    {
      getNextPageParam: lastPage => lastPage.after,
    }
  );

  const formattedData = useMemo<Card[]>(() => {
    let dataArr = [];

    data?.pages.forEach(page => {
      dataArr = dataArr.concat(page.data);
    });

    return dataArr;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>Carregar mais</Button>
        )}
      </Box>
    </>
  );
}
